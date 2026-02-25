import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { ViewService } from '../components/view/services/view.service';
import { RankingResponse } from '../models/ranking.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour le calcul de la position au classement national
 */
export class RankingService {
  private readonly TAG = 'RankingService';
  private readonly JSON_URL_RANKING = 'assets/data/ranking.json';

    constructor(private log: LoggerService, private http: HttpClient, private viewService: ViewService) {

  }

  // Cache Observable  
  private rankingData$ = this.http.get<RankingResponse>(this.JSON_URL_RANKING).pipe(
    shareReplay(1)
  );

  /**
   * le rankingScore en vigueur actuellement en fonction de la vue
   */
  rankingScores$: Observable<number[]> = combineLatest([
    this.rankingData$,
    this.viewService.selectedView$
  ]).pipe(
    map(([data, view]) => {
      // calcul de la cle du classement a charger
      const key = view.id === 'U17' ? 'U17' : 'H';
      this.log.debug(this.TAG, 'vue ' + view.id + ' - branchement sur le classement ' + key);
      const ranking = data.rankingObjects.find(r => r.name === key);
      return ranking?.rankingScores ?? [];
    }),
    shareReplay(1)
  );



  /**
   * combineLatest : À chaque changement des valeurs du classement ( a priori jamais) ou des points de l’utilisateur (a chaque add ou delete)
   * le ranking se recalcul automatiquement
   * @param pts$ un observable de points
   * @returns une place au classement national 
   */
  getRanking(pts$: Observable<number>): Observable<number> {
    return combineLatest([
      this.rankingScores$, // Observable<number[]>
      pts$
    ]).pipe(
      map(([values, pts]) => this.findClosestIndexDicho(values, pts))
    );
  }


  getPercent(pts$: Observable<number>): Observable<number> {
    return combineLatest([
      this.rankingScores$, // Observable<number[]>
      pts$
    ]).pipe(
      map(([values, pts]) => {
        const index = this.findClosestIndexDicho(values, pts);
        return 100 - ((index / values.length) * 100);
      })
    );
  }

  /**
   * @deprecated
   * @param values 
   * @param target 
   * @returns 
   */
  private findClosestIndex(values: number[], target: number): number {
    let low = 0;
    let high = values.length - 1;
    if (target >= values[0]) return 0;
    if (target <= values[high]) return high;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (values[mid] === target) return mid;

      if (values[mid] > target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return Math.abs(values[low] - target) < Math.abs(values[high] - target)
      ? low
      : high;
  }

  /**
   * 
   * @param values 
   * @param target 
   * @returns 
   */
  private findClosestIndexDicho(values: number[], target: number): number {
    if (!values.length) return -1;

    let left = 0;
    let right = values.length - 1;

    // Cas limites
    if (target >= values[0]) return 0;
    if (target <= values[right]) return right;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midVal = values[mid];

      if (midVal === target) {
        return mid;
      }

      // ⚠️ tableau trié du PLUS GRAND au PLUS PETIT
      if (midVal < target) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // left et right encadrent la position
    // on prend le plus proche des deux
    const leftDiff = Math.abs(values[left] - target);
    const rightDiff = Math.abs(values[right] - target);

    return leftDiff < rightDiff ? left : right;
  }

}