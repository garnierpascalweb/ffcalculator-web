import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
 private readonly TAG = 'CityService';
 private cities$!: Observable<string[]>;
  private readonly JSON_URL = 'assets/data/towns.txt';
  constructor(private http: HttpClient) {}

  /** Chargement unique + mise en cache */
  getCities(): Observable<string[]> {
    if (!this.cities$) {
      this.cities$ = this.http
        .get(this.JSON_URL, { responseType: 'text' })
        .pipe(
          map((text: string) =>
            text.split('\n')
                .map(v => v.trim())
                .filter(v => v.length > 0)
          ),
          shareReplay(1) // <--- CACHE ILLIMITÉ
        );
    }
    return this.cities$;
  }
}
