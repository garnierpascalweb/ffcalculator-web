import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, Subject } from 'rxjs';
import { Grid } from '../models/grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private grids$!: Observable<Grid[]>;
   private readonly STORAGE_KEY = 'selectedGrid';

  private selectedGridSubject!:  BehaviorSubject<Grid | null>;
  selectedGrid$!: Observable<Grid | null>;

  constructor(private http: HttpClient) { 
    const saved = localStorage.getItem(this.STORAGE_KEY);    
    //const defaultView = this.grids$.find(v => v.id === (saved ?? 'E'))!;
     // 👉 INITIALISATION EFFECTIVE ICI
     // Subject et pas BehaviorSubject car pas de valeur par defaut
    this.selectedGridSubject = new BehaviorSubject<Grid | null>(null);
    // 👉 maintenant seulement, on peut définir selectedGrid$
    this.selectedGrid$ = this.selectedGridSubject.asObservable();
  }

  /** Charge les données une seule fois + cache */
  getGrids(): Observable<Grid[]> {
    if (!this.grids$) {
      this.grids$ = this.http
        .get<Grid[]>('assets/data/grilles.json')
        .pipe(
          shareReplay(1) // ⬅️ cache : un seul chargement
        );
    }

    return this.grids$;
  }


  /**
   * 
   * @param codeVue O1,O2,A, etc
   * @returns la liste des grilles pour un codeVue
   */
  getGridsFromCodeVue(codeVue: string) : Observable<Grid[]>{
    return this.getGrids().pipe(
      map((grids: Grid[]) =>
        grids
          .filter(g => g.vues.includes(codeVue))     // ⬅️ filtre sur la vue          
      )
    );
  }

  getGridByCode(code: string): Observable<Grid | undefined> {
  return this.getGrids().pipe(
    map((grids: Grid[]) => grids.find(g => g.code === code))
  );
}

  /**
   * 
   * @returns la grille selectionnée
   */
  getCurrentGrid(){
    return this.selectedGridSubject.value;
  }


  setGrid(grid:Grid){
    if (!grid)
      return;
    this.selectedGridSubject.next(grid);
    localStorage.setItem(this.STORAGE_KEY, grid.code);
  }
}
