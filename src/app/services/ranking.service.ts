import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour le calcul de la position au classement national
 */
export class RankingService {
  private readonly TAG = 'RankingService';
  private readonly JSON_URL_H = 'assets/data/H.json';
  private readonly JSON_URL_U17 = 'assets/data/U17.json';
 
  // Cache Observable
  private valuesH$?: Observable<number[]>;

  constructor(private http: HttpClient) {}

  /**
   * Charge le json une seule fois
   */
  private getValues(): Observable<number[]> {
    if (!this.valuesH$) {
      this.valuesH$ = this.http.get<number[]>(this.JSON_URL_H).pipe(
        shareReplay(1)
      );
    }
    return this.valuesH$;
  }

  /**
   * 
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
   * combineLatest : À chaque changement des valeurs du classement ( a priori jamais) ou des points de l’utilisateur (a chaque add ou delete)
   * le ranking se recalcul automatiquement
   * @param pts$ un observable de points
   * @returns une place au classement national 
   */
 getRanking(pts$: Observable<number>): Observable<number> {
  return combineLatest([
    this.getValues(), // Observable<number[]>
    pts$
  ]).pipe(
    map(([values, pts]) => this.findClosestIndex(values, pts))
  );
}


 getPercent(pts$: Observable<number>): Observable<number> {
  return combineLatest([
    this.getValues(), // Observable<number[]>
    pts$
  ]).pipe(
    map(([values, pts]) => {
      const index = this.findClosestIndex(values, pts);
      return 100 - ((index / 7000) * 100);
    })
  );
}
}