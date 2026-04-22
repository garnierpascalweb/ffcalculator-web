import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of } from 'rxjs';
import { Grid } from 'src/app/simulator/shared/models/grid.model';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';
import { PointsService } from 'src/app/simulator/shared/services/points.service';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result.model';


@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly STORAGE_KEY = 'season';
  private readonly TAG = 'ResultService';
  private readonly resultsSubject!: BehaviorSubject<Result[]>;
  results$!: Observable<Result[]>;


  constructor(private readonly log: LoggerService, private readonly ptsService: PointsService, private readonly http: HttpClient) {
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
        // envoi http non bloquant
        this.sendResultToBackend(result).subscribe();
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
    this.log.info(this.TAG, "suppression d'un resultat");
    const currentResults = this.getResults();
    const newList = currentResults.filter(r =>
      !(r.code === resultToDelete.code &&
        r.place === resultToDelete.place &&
        r.pos === resultToDelete.pos &&
        r.prts === resultToDelete.prts &&
        r.pts === resultToDelete.pts)
    );
    this.resultsSubject.next(newList);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
    return of(void 0);
  }


  /**
   * Calcul du nombre total de points
   * @returns un observable number : la somme des 15 meilleurs résultats : le nombre de points de la saison
   */
  getSumPts(): Observable<number> {
    return this.results$.pipe(
      map(results =>
        Math.round(
          results
            .map(r => r.pts)               // points
            .sort((a, b) => b - a)         // tri décroissant
            .slice(0, 15)                  // top 15
            .reduce((sum, pts) => sum + pts, 0) // somme
          * 100
        ) / 100
      )
    );
  }

  /**
   * trace sur le backend
   * @param result 
   * @param env 
   * @returns 
   */
  sendResultToBackend(result: Result): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      uuid: crypto.randomUUID(),
      env: environment.env
    });    
    const jsonRes = {
      prts: result.prts,
      pos: result.pos,
      code: result.code,
      place: result.place
    };    
    return this.http.post<void>(environment.addResultUrl, jsonRes, { headers }).pipe(
      catchError(err => {
        this.log.error(this.TAG, 'Erreur envoi résultat backend' + err);
        return EMPTY; // on ignore l'erreur
      })
    );
  }
}
