import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Result } from 'src/app/models/result.model';
import { GridService } from 'src/app/services/grid.service';
import { LoggerService } from 'src/app/services/logger.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ResultService } from 'src/app/services/result.service';

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

  constructor(private log: LoggerService, private notificationService: NotificationService, private gridService: GridService, private resultService: ResultService) {

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
          this.notificationService.success('résultat supprimé');
        },
        error: (err) => {
          this.notificationService.error('erreur');
        }
      });
  }

  getAvatarUrl(): string {
    return `assets/icons/logo/${this.getLogo(this.result?.code)}`;
  }

  getLogo(code: string): string {
    let imgLogo: string = 'logo-default.svg';
    this.gridService.getGridByCode(code).subscribe(grid => {
      if (grid) {
        switch (grid.logo) {
          case 'Elite':
            imgLogo = 'logo-elite.png';
            break;
          case 'CDF N1':
            imgLogo = 'logo-cdfn1.png';
            break;
          case 'CDF N2':
            imgLogo = 'logo-cdfn2.png';
            break;
          case 'CDF N3':
            imgLogo = 'logo-cdfn1.png';
            break;
          case 'Open 1/2':
            imgLogo = 'logo-open-12.png';
            break;
          case 'Open 1/2/3':
            imgLogo = 'logo-open-123.png';
            break;
          case 'Open 2/3':
            imgLogo = 'logo-open-23.png';
            break;
          case 'Open 3':
            imgLogo = 'logo-open-3.png';
            break;
          case 'U23':
            imgLogo = 'logo-u23.png';
            break;
          case 'U19':
            imgLogo = 'logo-u19.png';
            break;
          case 'U17':
            imgLogo = 'logo-u17.png';
            break;
          default:
            imgLogo = 'logo-default.png'; // valeur par défaut si aucun match
        }

      } else {
        imgLogo = 'logo-default.png'; // valeur par défaut si aucun match
      }
    }
      //TODO 1.0.0 logo pour championnat de france 
    );
    return imgLogo;
  }
}
