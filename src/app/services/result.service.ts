import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Grid } from '../models/grid.model';
import { Result } from '../models/result.model';
import { LoggerService } from './logger.service';
import { PointsService } from './points.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly STORAGE_KEY = 'season';
  private readonly TAG = 'ResultService';
  private resultsSubject!: BehaviorSubject<Result[]>;
  results$!: Observable<Result[]>;


  constructor(private log: LoggerService, private ptsService: PointsService) {
    this.log.debug(this.TAG, "lecture de la liste des resultats dans le localStorage sous <" + this.STORAGE_KEY + ">");
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.log.debug(this.TAG, "  json <" + saved + ">");
    const stored: Result[] = saved ? JSON.parse(saved) : [];
    this.resultsSubject = new BehaviorSubject<Result[]>(stored);
    this.results$ = this.resultsSubject.asObservable();
    log.debug(this.TAG, "fin recuperation liste des resultats en localStorage - <" + stored.length + "> resultats recuperes");
    log.trace(this.TAG, JSON.stringify(stored));
  }

  private getResults() {
    return this.resultsSubject.value;
  }

  getResultsObservable(): Observable<Result[]>{
    return this.results$;
  }



  /**
   * 
   * @param place le lieu de l'épreuve
   * @param grid l'instance de grille selectionnée
   * @param pos la position obtenue
   * @param prts le nombre de participants
   * @returns un Observable qui renvoie rien mais permet de gerer les erreurs
   */
  addResult(place: string, grid: Grid | null, pos: number, prts: number): Observable<void> {
    return new Observable<void>((observer) => {
      try {
        this.log.debug(this.TAG, "ajout d'un nouveau resultat");
        if (!grid) {
           this.log.error(this.TAG, "aucune grille selectionnée");
          throw new Error("Grid is null");
        }
        const result: Result = {
          code: grid.code,
          place,
          pos,
          prts,
          pts: this.ptsService.calcPts(grid, pos, prts)
        };
        const newList = [...this.getResults(), result]; // <-- PAS de push(), immutabilité
        this.log.debug(this.TAG, "alimentation de la nouvelle liste de resultats");
        this.resultsSubject.next(newList);
        this.log.debug(this.TAG, "mise a jour de la liste des resultats dans le localStorage sous " + this.STORAGE_KEY);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
        observer.next();
        this.log.error(this.TAG, "notification observer complete");
        observer.complete();
      } catch (e) {
        this.log.error(this.TAG, "notification observer error");
        observer.error(e);
      }
    });
  }

  /**
   * 
   * @param resultToDelete 
   * @returns un Observable qui renvoie rien mais permet de gerer les erreurs
   */
deleteResult(resultToDelete: Result): Observable<void> {
  return new Observable<void>((observer) => {
    try {
      this.log.info(this.TAG, "suppression d'un resultat");
      const currentResults = this.getResults();
      // On filtre la liste pour retirer l'élément
      const newList = currentResults.filter(r =>
        !(
          r.code === resultToDelete.code &&
          r.place === resultToDelete.place &&
          r.pos === resultToDelete.pos &&
          r.prts === resultToDelete.prts &&
          r.pts === resultToDelete.pts
        )
      );
      this.log.debug(this.TAG, "nouvelle liste après suppression");
      this.resultsSubject.next(newList);
      this.log.debug(this.TAG, "mise a jour localStorage sous " + this.STORAGE_KEY);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
      observer.next();
      observer.complete();
    } catch (e) {
      this.log.error(this.TAG, "erreur suppression resultat");
      observer.error(e);
    }
  });
}



  /**
   * @deprecated
   * @since 1.0.0
   * @returns les points des 15 meilleurs résultats de la saison, arrondis a deux décimales
   */
  getPts(): number {
    const results = this.getResults();
    //TODO 15 a mettre en parametre
    const sum = results
      .map(result => result.pts)
      .sort((a, b) => b - a)
      .slice(0, 15)
      .reduce((s, v) => s + v, 0);
    return Math.round(sum * 100) / 100;
  }

  getSumPts(): Observable<number> {
  return this.results$.pipe(
    map(results =>
      results
        .map(r => r.pts)          // on prend les points
        .sort((a, b) => b - a)    // tri décroissant
        .slice(0, 15)             // top 15
        .reduce((sum, pts) => sum + pts, 0) // somme
    )
  );
}


}
