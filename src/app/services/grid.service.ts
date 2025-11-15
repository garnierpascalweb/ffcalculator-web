import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Grid } from '../models/grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private grids$!: Observable<Grid[]>;

  constructor(private http: HttpClient) {}

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
}
