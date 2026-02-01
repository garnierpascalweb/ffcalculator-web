import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, of, startWith, switchMap } from 'rxjs';
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

  /**
   * Label de 
   */
  currentViewLabel: string;
  /**
   * Observable de la liste des grilles
   */
  grids$!: Observable<Grid[]>;
  /**
   * Observable de la grille sélectionnée et son subject
   */
  grid$!: Observable<Grid | null>;
  private gridSubject: BehaviorSubject<Grid | null>;
  /**
   * Observable du nombre de la liste des grilles
   */
  gridsCount$!: Observable<number>;
  /**
   * Observable de la liste des villes filtrées
   */
  filteredCities!: Observable<string[]>;
  /**
   * Liste des positions possibles de 1 à maxPos
   */
  positions: number[];
  /**
   * Liste des partants de 1 à maxPos
   */
  partants: number[];
  /**
   * Positions 
   */
  isPosDisabled: boolean;
  /**
   * 
   */
  classHint: string;
  /**
   * 
   */
  maxPos: number;

  resultFormGroup = new FormGroup({
    placeCtrl: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    classCtrl: new FormControl<Grid | null>(null, { nonNullable: true, validators: Validators.required }),
    posCtrl: new FormControl<number | null>(null, { validators: Validators.required }),
    prtsCtrl: new FormControl<number | null>(null, { validators: Validators.required })
  },
    { validators: PosLessThanPrtsValidator }
  );




  constructor(private cityService: CityService, private viewService: ViewService, private gridService: GridService, private resultService: ResultService, private notificationService: NotificationService) {
    this.partants = Array.from({ length: 200 }, (_, i) => i + 1);
    this.isPosDisabled = true;
    this.gridSubject = new BehaviorSubject<Grid | null>(null);
    this.grid$ = this.gridSubject.asObservable();
  }

  ngOnInit() {
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

    // observation de la grille selectionnée
    this.grid$.subscribe(grid => {
      if (grid) {
        this.maxPos = grid.maxPos;
        this.positions = Array.from({ length: grid.maxPos }, (_, i) => i + 1);
        this.isPosDisabled = false;
      }
    });

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
   * Action sur l'ihm : Choix d'une grille dans la liste déroulante
   * @param classeLibelle le libelle selectionné dans la liste déroulante
   */
  onGridSelectionChange(grid: Grid) {
    // this.gridService.setGrid(grid);
    //TODO plutot manipuler un observable ici
    this.gridSubject.next(grid);
  }

  /**
   * Action sur l'ihm : Ajout d'un nouveau resultat
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
        }
      });
  }

  /**
   * Reinitialisation du formulaire
   */
  resetForm() {
    this.resultFormGroup.reset({
      placeCtrl: '',
      classCtrl: null,
      posCtrl: null,
      prtsCtrl: null
    });
  }


  /**
   * 
   * @param cities la liste de scommunes francaises
   * @param value la valeur en train d'etre saisie a l'écran
   * @returns une liste de resultats qui matchent
   */
  private filterCities(cities: string[], value: string): string[] {
    const normalizedValue = this.normalize(value);
    return cities.filter(city =>
      this.normalize(city).startsWith(normalizedValue)
    );
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')                  // sépare lettres / accents
      .replace(/[\u0300-\u036f]/g, '')   // supprime les accents
      .replace(/[-\s']/g, '');           // supprime tirets, espaces, apostrophes
  }
}
