import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Grid } from '../models/grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private grids$!: Observable<Grid[]>;


  constructor(private http: HttpClient) { }

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
   * Alimentation de la liste deroulante classes
   * @param vue la vue courante
   * @returns la liste a faire apparaitre dans la liste deroulante
   */
  getLibelleClasses(vue: string): Observable<string[]> {
    return this.getGrids().pipe(
      map((grids: Grid[]) =>
        grids
          .filter(g => g.vues.includes(vue))     // ⬅️ filtre sur la vue
          .map(g => `${g.libelle} (${g.code})`)  // ⬅️ format final
      )
    );
  }

  /**
   * Fonction utilitaire
   * @param label 
   * @returns le code a partir d'une chaine de caractère donnée par getLibelleClasses
   */
  getCodeFromLibelleClasse(label: string): string | null {
    // Cherche tout ce qui est entre parenthèses
    const match = label.match(/\(([^)]+)\)/);
    // Si trouvé → match[1] contient le code
    return match ? match[1] : null;
  }

  /**
   * Alimentation de la liste déroulante position
   * @param code le code epreuve
   * @returns la liste des positions possibles pour ce code epreuve
   */
  getAvailablePos(code: string): Observable<number[]> {
    return this.getGrids().pipe(
      map((grids: Grid[]) => {
        const grid = grids.find(g => g.code === code);

        if (!grid) {
          console.warn(`Aucune grille trouvée pour le code : ${code}`);
          return [];
        }

        // Construit un tableau de 1 à maxPos
        return Array.from({ length: grid.maxPos }, (_, i) => i + 1);
      })
    );
  }
}
