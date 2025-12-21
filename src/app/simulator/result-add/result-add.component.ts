import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { Grid } from 'src/app/models/grid.model';
import { CityService } from 'src/app/services/city.service';
import { GridService } from 'src/app/services/grid.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ResultService } from 'src/app/services/result.service';
import { ViewService } from 'src/app/services/view.service';
import { PosLessThanPrtsValidator } from 'src/app/validators/pos-less-than-prts-validator';

@Component({
  selector: 'app-result-add',
  templateUrl: './result-add.component.html',
  styleUrls: ['./result-add.component.scss']
})
export class ResultAddComponent {

  resultFormGroup = new FormGroup({
    placeCtrl: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    classCtrl: new FormControl<Grid | null>(null, { nonNullable: true, validators: Validators.required }),
    posCtrl: new FormControl<number | null>(null, { validators: Validators.required }),
    prtsCtrl: new FormControl<number>(1, { nonNullable: true, validators: Validators.required })
  }, 
  { validators: PosLessThanPrtsValidator }
);

  currentViewLabel: string;
  grids$!: Observable<Grid[]>;
  gridsCount$!: Observable<number>;
  filteredCities!: Observable<string[]>;
  positions: number[];// = Array.from({ length: 50 }, (_, i) => i + 1);
  partants: number[];// = Array.from({ length: 200 }, (_, i) => i + 1);
  isPosDisabled: boolean;
  placeHint: string;
  classHint: string;
  posHint: string;
  prtsHint: string;


  constructor(private cityService: CityService, private viewService: ViewService, private gridService: GridService, private resultService: ResultService, private notificationService: NotificationService) {

  }

  ngOnInit() {
    // initialisation des hint
    this.placeHint = "Lieu ou nom de l'épreuve";

    // Charge la liste des villes + filtre dynamique
    this.filteredCities = this.resultFormGroup.get('placeCtrl')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        // Ne rien afficher avant 3 caractères
        if (!value || value.length < 3) {
          return of([]);  // liste vide
        }

        return this.cityService.getCities().pipe(
          map((cities: string[]) => this.filterCities(cities, value))
        );
      })
    );
    // 
    // observation de la vue
    this.viewService.selectedView$.subscribe(view => {
      if (view) {
        this.currentViewLabel = view.label;
        // changement de la liste des classes       
        this.grids$ = this.viewService.selectedView$.pipe(
          switchMap(view => this.gridService.getGridsFromCodeVue(view.id))
        );
        //
        this.gridsCount$ = this.grids$.pipe(
          map(grids => grids.length)
        );
      }
    });
  }

  /**
   * Choix d'une grille dans la liste déroulante
   * @param classeLibelle le libelle selectionné dans la liste déroulante
   */
  onGridSelectionChange(grid: Grid) {
    this.gridService.setGrid(grid);
    // mise a jour de la liste des positions disponibles
    this.isPosDisabled = false;
    this.positions = Array.from({ length: grid.maxPos }, (_, i) => i + 1);
    this.posHint = "Points attribués au TOP " + grid.maxPos + " pour une épreuve de type " + grid.libelle;
    this.partants = Array.from({ length: 200 }, (_, i) => i + 1);
    this.prtsHint = "200 participants maximum";
  }

  /**
   * Ajout d'un nouveau resultat
   * @returns Action delcnechée sur le clic du bouton "Ajouter Resultat"
   */
  onAddResult() {
     if (this.resultFormGroup.invalid) {
      this.resultFormGroup.markAllAsTouched();
      return;
    }
    
    // recuperation des données du formulaire
    // getRawValue() retourne un objet strictement typé - Les clés ne sont plus optionnelles
    // Respecte nonNullable: true
    // typescript comprend alors  placeCtrl: string classCtrl: Grid | null posCtrl: number | null prtsCtrl: number
    const { placeCtrl, classCtrl, posCtrl, prtsCtrl } = this.resultFormGroup.getRawValue(); 
    if (posCtrl == null || prtsCtrl == null) {      
      return;
    }
    this.resultService.addResult(placeCtrl, classCtrl, posCtrl, prtsCtrl)
    .subscribe({
    next: () => {      
      this.notificationService.success('résultat ajoute avec succes');
      this.resetForm();
    },
    error: (err) => {
      this.notificationService.error('erreur');
    }});   
  }

  /**
   * Reinitialisation du formulaire
   */
  resetForm() {
  this.resultFormGroup.reset({
    placeCtrl: '',
    classCtrl: null,
    posCtrl: null,
    prtsCtrl: 1
  });
}

  /**
   * 
   * @returns  la grisse sélectionnée actuellement
   */
  getSelectedGrid() {
    return this.gridService.getCurrentGrid();
  }

  /**
   * 
   * @param cities la liste de scommunes francaises
   * @param value la valeur en train d'etre saisie a l'écran
   * @returns une liste de resultats qui matchent
   */
  private filterCities(cities: string[], value: string): string[] {
    const v = value.toLowerCase();
    return cities.filter(c => c.toLowerCase().includes(v));
  }
}
