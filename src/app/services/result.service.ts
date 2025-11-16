import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Grid } from '../models/grid.model';
import { Result } from '../models/result.model';
import { PointsService } from './points.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly STORAGE_KEY = 'season';
  private resultsSubject!: BehaviorSubject<Result[]>;
  results$!: Observable<Result[]>;
 

  constructor(private ptsService : PointsService) {

  }

  getResults(){
    return this.resultsSubject.value;
  }

  addResult(place: string, grid: Grid, pos: number, prts: number) {
    const result: Result = {
      code: grid.code,
      place: place,
      pos: pos,
      prts: prts,
      pts: this.ptsService.calcPts(grid,pos,prts)
    };
    this.getResults().push(result);
    this.resultsSubject.next(this.getResults());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.getResults()));
  }
}
