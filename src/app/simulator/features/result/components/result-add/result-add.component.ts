import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { CityService } from 'src/app/simulator/shared/components/city/services/city.service';
import { ViewService } from 'src/app/simulator/shared/components/view/services/view.service';
import { Grid } from 'src/app/simulator/shared/models/grid.model';
import { GridService } from 'src/app/simulator/shared/services/grid.service';
import { NotificationService } from 'src/app/simulator/shared/services/notification.service';
import { PosLessThanPrtsValidator } from 'src/app/simulator/shared/validators/pos-less-than-prts-validator';
import { ResultService } from '../../services/result.service';


@Component({
  selector: 'app-result-add',
  templateUrl: './result-add.component.html',
  styleUrls: ['./result-add.component.scss']
})
export class ResultAddComponent implements OnInit {

  /**
   * pour emettre un evenement quand un résultat est ajouté pour switcher sur l'nglet "liste des résultats"
   */
  @Output() resultAdded = new EventEmitter<void>();

  /**
   * Label de 
   */
  currentViewLabel: string;
  /**
   * Observable de la liste des grilles
   */
  grids$!: Observable<Grid[]>;
  /**
   * Observable de la grille sélectionnée 
   */
  grid$!: Observable<Grid | null>;
  /**
   * Observable du nombre de la liste des grilles
   */
  gridsCount$!: Observable<number>;

  cities$: Observable<string[]>;
  /**
   * Observable de la liste des villes filtrées
   */
  filteredCities!: Observable<string[]>;
  /**
   * Liste des positions possibles de 1 à maxPos
   */
  positions$: Observable<number[]>;
  
  hintPos$: Observable<{ maxPos: number; longLabel: string; } | null>;
  /**
   * Liste des partants de 1 à maxPos
   */
  partants: number[];
  /**
   * Positions 
   */
  isPosDisabled$: Observable<boolean>;

  resultFormGroup = new FormGroup({
    placeCtrl: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    classCtrl: new FormControl<Grid | null>(null, { nonNullable: true, validators: Validators.required }),
    posCtrl: new FormControl<number | null>(null, { validators: Validators.required }),
    prtsCtrl: new FormControl<number | null>(null, { validators: Validators.required })
  },
    { validators: PosLessThanPrtsValidator }
  );

  constructor(private cityService: CityService, private viewService: ViewService, private gridService: GridService, private resultService: ResultService, private notificationService: NotificationService, private translate: TranslateService) {
    this.partants = Array.from({ length: 200 }, (_, i) => i + 1);
  }

  ngOnInit() {
    // Charge la liste des villes
    this.cities$ = this.cityService.getCities();
    // mise en forme de la liste des villes
    this.filteredCities = combineLatest([
      this.cities$,
      this.resultFormGroup.get('placeCtrl')!.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([cities, value]) => {
        if (!value || value.length < 3) return [];
        return this.filterCities(cities, value);
      })
    );

    // chargement de la liste des grilles selon l'observable selectedView
    this.grids$ = this.viewService.selectedView$.pipe(
      tap(view => this.currentViewLabel = view.label),
      switchMap(view => this.gridService.getGridsFromCodeVue(view.id))
    );

    // chargement du nombre de grilles selon l'observable grids
    this.gridsCount$ = this.grids$.pipe(
      map(grids => grids.length)
    );

    // chargement de la grille selectionnée 
    this.grid$ = this.resultFormGroup.get('classCtrl')!.valueChanges.pipe(
      startWith(this.resultFormGroup.get('classCtrl')!.value)
    );

    // chargement des positions possibles selon l'observable grid
    this.positions$ = this.grid$.pipe(
      map(grid => grid ? Array.from({ length: grid.maxPos }, (_, i) => i + 1) : []),
      startWith([])
    );
    // chargement de l'accessibilité de la liste deroulante des positions selon la grille selectionnée
    this.isPosDisabled$ = this.grid$.pipe(
      map(grid => !grid),
      startWith(true)
    );

    this.hintPos$ = combineLatest([
      this.isPosDisabled$,
      this.grid$
    ]).pipe(
      map(([isDisabled, grid]) => {
        if (isDisabled || !grid) return null;

        return {
          maxPos: grid.maxPos,
          longLabel: grid.longLabel
        };
      })
    );
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
          //TODO faire apparaitre dans la notification le nombre de points ajoutés
          //  this.translate.instant('OK', { points: 10 }); et modifier le i18n avec "OK": "Résultat ajouté - + {{points}} points"
          this.notificationService.success(this.translate.instant('NOTIFICATION.ADD_RESULT.OK'));
          this.resetForm();
          // emission d'un evenement pour switch sur l'onglet "liste de resultats"
          this.resultAdded.emit();
        },
        error: (err) => {
          this.notificationService.error(this.translate.instant('NOTIFICATION.ADD_RESULT.KO'));
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
   * annulation de la saisie de nouveau resultat
   */
  onCancelAddResult() {
    this.resetForm();
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
