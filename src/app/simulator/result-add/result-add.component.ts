import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { Grid } from 'src/app/models/grid.model';
import { CityService } from 'src/app/services/city.service';
import { GridService } from 'src/app/services/grid.service';
import { ResultService } from 'src/app/services/result.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-result-add',
  templateUrl: './result-add.component.html',
  styleUrls: ['./result-add.component.scss']
})
export class ResultAddComponent  {
  placeCtrl = new FormControl<string>('',{nonNullable: true,validators:Validators.required});
  classCtrl = new FormControl<Grid | null>(null,{nonNullable: true,validators:Validators.required});
  posCtrl = new FormControl<number>(1,{nonNullable: true,validators:Validators.required});
  prtsCtrl = new FormControl<number>(1,{nonNullable: true,validators:Validators.required});


  grids$!: Observable<Grid[]>;
  filteredCities!: Observable<string[]>;
  positions: number[];// = Array.from({ length: 50 }, (_, i) => i + 1);
  partants: number[];// = Array.from({ length: 200 }, (_, i) => i + 1);
  

  constructor(private cityService: CityService, private viewService: ViewService, private gridService: GridService, private resultService:ResultService) { 

  }

  ngOnInit() {   
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
   * Choix d'une grille dans la liste déroulante
   * @param classeLibelle le libelle selectionné dans la liste déroulante
   */
  onGridSelectionChange(grid:Grid){    
    this.gridService.setGrid(grid);
    this.positions = Array.from({ length: grid.maxPos }, (_, i) => i + 1);
    this.partants = Array.from({ length: 200 }, (_, i) => i + 1);
  }

  onAddResult(){    
    this.resultService.addResult(this.placeCtrl.value, this.getSelectedGrid(), this.posCtrl.value, this.prtsCtrl.value);
  }

  getSelectedGrid(){
    return this.gridService.getCurrentGrid();
  }


  private filterCities(cities: string[], value: string): string[] {
    const v = value.toLowerCase();
    return cities.filter(c => c.toLowerCase().includes(v));
  }
}
