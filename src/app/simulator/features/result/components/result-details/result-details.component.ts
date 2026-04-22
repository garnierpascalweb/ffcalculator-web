import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, of } from 'rxjs';
import { GridService } from 'src/app/simulator/shared/services/grid.service';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';
import { NotificationService } from 'src/app/simulator/shared/services/notification.service';
import { Result } from '../../models/result.model';
import { ResultService } from '../../services/result.service';


@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent  {
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

  constructor(private readonly log: LoggerService, private readonly notificationService: NotificationService, private readonly gridService: GridService, private readonly resultService: ResultService, private readonly translate: TranslateService, private readonly dialog: MatDialog) {

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
  }

  getLogo(code: string): Observable<string> {
    if (!code) {
      return of('logo-default.png');
    }
    return this.gridService.getGridByCode(code).pipe(
      map(grid => grid ? `${grid.logo}.png` : 'logo-default.png')
    );
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
