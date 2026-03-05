import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { GridService } from 'src/app/simulator/shared/services/grid.service';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';
import { NotificationService } from 'src/app/simulator/shared/services/notification.service';
import { Result } from '../../models/result.model';
import { ResultService } from '../../services/result.service';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';


@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit, OnChanges {
  /**
   * Le resultat
   */
  @Input() result!: Result;
  /**
   * S'il fait parti du top 15 des meilleurs résultats
   */
  @Input() isTop15 = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  private readonly TAG = 'ResultDetailsComponent';

  constructor(private log: LoggerService, private notificationService: NotificationService, private gridService: GridService, private resultService: ResultService, private translate: TranslateService, private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  onDeleteResult(resultToDelete: Result) {
    this.log.debug(this.TAG, "demande de suppression de resultat " + resultToDelete.place);
    this.resultService.deleteResult(resultToDelete)
      .subscribe({
        next: () => {
          this.notificationService.success(this.translate.instant('NOTIFICATION.DELETE_RESULT.OK'));
        },
        error: (err) => {
          this.notificationService.error(this.translate.instant('NOTIFICATION.DELETE_RESULT.KO'));
        }
      });
  }

  openResultDialog(resultToHelp: Result) {
    this.log.debug(this.TAG, "demande aide de resultat " + resultToHelp.place);
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      data: resultToHelp
    });
  }

  getAvatarUrl(): string {
    return `assets/icons/logo/${this.getLogo(this.result?.code)}`;
  }

  getLogo(code: string): string {
    let imgLogo: string = 'logo-default.svg';
    this.gridService.getGridByCode(code).subscribe(grid => {
      if (grid) {
        imgLogo = `${grid.logo}.png`;        
      } else {
        imgLogo = 'logo-default.png'; // valeur par défaut si aucun match
      }
    }
      //TODO 1.0.0 logo pour championnat de france 
    );
    return imgLogo;
  }

  /**
   * Construction du subtitle (longLabel et code)
   * @returns longLabel et code
   */
 getResultSubtitle(): Observable<string> {
  return this.gridService.getGridByCode(this.result.code).pipe(
    map(grid => {
      if (!grid) return '';
      return `${grid.longLabel}`;
    })
  );
}
}
