import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { map, Observable, of } from 'rxjs';
import { Grid } from 'src/app/simulator/shared/models/grid.model';
import { GridService } from 'src/app/simulator/shared/services/grid.service';
import { PointsService } from 'src/app/simulator/shared/services/points.service';
import { Result } from '../../models/result.model';
import { MatDialog } from '@angular/material/dialog';

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


  constructor(@Inject(MAT_DIALOG_DATA) public result: Result, private pointsService: PointsService, private gridService: GridService, private dialog: MatDialog) {
     this.coef = this.result ? this.pointsService.calcCoef(this.result.prts) : 0; 
      this.grid$ = this.result
      ? this.gridService.getGridByCode(this.result.code)
      : of(undefined);
     this.gridItems$ = this.grid$.pipe(map(grid => grid?.pts));
     this.gridLongLabel$ = this.grid$.pipe(map(grid => grid?.longLabel));
     this.gridBasePts$ = this.grid$.pipe(map(grid => grid?.pts.at(result.pos-1)));
  }
}