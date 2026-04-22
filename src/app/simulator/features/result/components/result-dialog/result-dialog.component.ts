import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, of } from 'rxjs';
import { Grid } from 'src/app/simulator/shared/models/grid.model';
import { GridService } from 'src/app/simulator/shared/services/grid.service';
import { PointsService } from 'src/app/simulator/shared/services/points.service';
import { Result } from '../../models/result.model';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss'],
})
export class ResultDialogComponent {

    grid$: Observable<Grid | undefined>;
  gridItems$ : Observable<number[] | undefined>;
  gridLongLabel$ : Observable<string | undefined>;
  gridBasePts$ : Observable<number | undefined>;
  coef!: number;


  constructor(@Inject(MAT_DIALOG_DATA) public result: Result, private readonly pointsService: PointsService, private readonly gridService: GridService) {
     this.coef = this.result ? this.pointsService.calcCoef(this.result.prts) : 0; 
      this.grid$ = this.result
      ? this.gridService.getGridByCode(this.result.code)
      : of(undefined);
     this.gridItems$ = this.grid$.pipe(map(grid => grid?.pts));
     this.gridLongLabel$ = this.grid$.pipe(map(grid => grid?.longLabel));
     this.gridBasePts$ = this.grid$.pipe(map(grid => grid?.pts.at(result.pos-1)));
  }
}