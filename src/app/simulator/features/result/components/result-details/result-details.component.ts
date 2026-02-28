import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
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
export class ResultDetailsComponent {
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

  constructor(private log: LoggerService, private notificationService: NotificationService, private gridService: GridService, private resultService: ResultService, private translate: TranslateService) {

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

  onHelpResult(esultToHelp: Result) {
    this.log.debug(this.TAG, "demande aide de resultat " + esultToHelp.place);
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
