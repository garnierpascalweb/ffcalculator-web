import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { Grid } from 'src/app/models/grid.model';
import { CityService } from 'src/app/services/city.service';
import { GridService } from 'src/app/services/grid.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-result-add',
  templateUrl: './result-add.component.html',
  styleUrls: ['./result-add.component.scss']
})
export class ResultAddComponent {
  placeCtrl = new FormControl('');
  filteredPlaces!: Observable<string[]>;  
  grids$!: Observable<Grid[]>;


  places: string[] = [
    'Paris', 'Marseille', 'Lyon', 'Toulouse'
  ];
  filteredCities!: Observable<string[]>;


  positions: number[] = Array.from({ length: 50 }, (_, i) => i + 1);
  partants: number[] = Array.from({ length: 50 }, (_, i) => i + 1);

  classCtrl = new FormControl('');
  posCtrl = new FormControl('');
  prtsCtrl = new FormControl('');

  constructor(private cityService: CityService, private viewService: ViewService, private gridService: GridService) { }

  ngOnInit() {
    this.filteredPlaces = this.placeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPlaces(value || ''))
    );
    // Charge la liste des villes + filtre dynamique
    this.filteredCities = this.placeCtrl.valueChanges.pipe(
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
        // changement de la liste des classes       
        this.grids$ = this.viewService.selectedView$.pipe(
          switchMap(view => this.gridService.getGridsFromCodeVue(view.id))
        );
      }
    });
  }

  /**
   * 
   * @param classeLibelle le libelle selectionné dans la liste déroulante
   */
  onGridSelectionChange(grid:Grid){
    console.log('selection de ' + grid.code);
  }

  private filterPlaces(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.places.filter(
      item => item.toLowerCase().includes(filterValue)
    );
  }

  private filterCities(cities: string[], value: string): string[] {
    const v = value.toLowerCase();
    return cities.filter(c => c.toLowerCase().includes(v));
  }
}
