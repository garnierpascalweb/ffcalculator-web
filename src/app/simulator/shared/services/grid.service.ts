import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Grid } from '../models/grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private readonly TAG = 'GridService';
  private grids$!: Observable<Grid[]>;

  constructor(private readonly http: HttpClient) {
    
  }

  /** Charge les données une seule fois + cache */
  getGrids(): Observable<Grid[]> {
    if (!this.grids$) {
      this.grids$ = this.http
        .get<Grid[]>('assets/data/grids.json')
        .pipe(
          shareReplay(1) // ⬅️ cache : un seul chargement
        );
    }
    return this.grids$;
  }

  /**
   * Utilisée dans result-add 
   * @param codeVue O1,O2,A, etc
   * @returns la liste des grilles pour un codeVue
   */
  getGridsFromCodeVue(codeVue: string): Observable<Grid[]> {
    return this.getGrids().pipe(
      map((grids: Grid[]) =>
        grids
          .filter(g => g.vues.includes(codeVue))
          .sort((a, b) => a.priority - b.priority)
      )
    );
  }

  /**
   * Utilisée dans result-details pour fabriquer un logo
   * @param code code de la grille (exemple 1.25.1)
   * @returns l'instance Grid correspondante
   */
  getGridByCode(code: string): Observable<Grid | undefined> {
    return this.getGrids().pipe(
      map((grids: Grid[]) => grids.find(g => g.code === code))
    );
  }
}