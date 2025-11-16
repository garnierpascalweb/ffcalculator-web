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
   * Alimentation de la liste deroulante classes
   * @param vue la vue courante
   * @returns la liste a faire apparaitre dans la liste deroulante
   * @deprecated use getGridsFromCodeVue
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

  getGridsFromCodeVue(codeVue: string) : Observable<Grid[]>{
    return this.getGrids().pipe(
      map((grids: Grid[]) =>
        grids
          .filter(g => g.vues.includes(codeVue))     // ⬅️ filtre sur la vue          
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

  /**
   * 
   * @returns la grille selectionnée
   */
  getCurrentGrid(){
    return this.selectedGridSubject.value;
  }

  /**
   * 
   * @param code code epreuve (exemple 1.25.1)
   * @returns l'instance de Grid
   */
  getGridByCode(code: string | null): Observable<Grid | undefined> {
  return this.grids$.pipe(
    map((grids: Grid[]) => grids.find(g => g.code === code))
  );
}

  


}
