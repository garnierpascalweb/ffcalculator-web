import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    log.debug(this.TAG, JSON.stringify(stored));
  }

  getResults() {
    return this.resultsSubject.value;
  }

  addResult(place: string, grid: Grid | null, pos: number, prts: number) {
    this.log.debug(this.TAG, "ajout d'un nouveau resultat");
    if (grid) {
      const result: Result = {
        code: grid.code,
        place: place,
        pos: pos,
        prts: prts,
        pts: this.ptsService.calcPts(grid, pos, prts)
      };
      this.log.debug(this.TAG, "  ajout du resultat dans la liste");
      this.getResults().push(result);
      this.log.debug(this.TAG, "  publication de la liste des resultats dans le subject");
      this.resultsSubject.next(this.getResults());
      this.log.debug(this.TAG, "  ecriture de la liste des resultats dans le localStorage sous <" + this.STORAGE_KEY + ">");
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.getResults()));
    }
    this.log.debug(this.TAG, "fin ajout d'un nouveau resultat");
  }
}
