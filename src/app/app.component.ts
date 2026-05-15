import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY, timeout } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
  ) {
    // Utilisation du language francais
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }
  ngOnInit(): void {
    //this.http.get(environment.trackingUrl).subscribe();
    // 28/08/2025 - POST et utilisation du nouveau service
    // 02/02/2026 - tracking que si prod
    if (environment.features.tracking) {
      this.http
        .post(
          environment.api.trackingUrl,
          {},
          {
            params: { script: 'FFCalculator' },
          },
        )
        .pipe(
          timeout(3000),
          catchError(() => EMPTY),
        )
        .subscribe();
    }
  }
}
