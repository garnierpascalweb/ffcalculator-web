import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss']
})
export class ShareMenuComponent {
  private readonly TAG = 'ShareMenuComponent';
  constructor(private http: HttpClient, private log: LoggerService, private translate: TranslateService) {

  }

  share() {
    const customTitle = this.translate.instant('MENU.SHARE.TITLE');
    const customText = this.translate.instant('MENU.SHARE.TEXT');
    const customUrl = this.translate.instant('MENU.SHARE.URL');
    const shareData = {
      title: customTitle,
      text: customText,
      // url: window.location.href
      url: customUrl
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          this.log.debug(this.TAG, "Partage effectué");
          if (environment.production) {
            this.http.post(environment.trackingUrl, {}, {
              params: { script: 'FFCalculator-Share' }
            }
            ).subscribe();
          }
        })
        .catch(err => this.log.error(this.TAG, "Probleme lors du partage"));
    } else {
      this.log.error(this.TAG, "Partage impossible");
    }
  }
}