import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface VersionInfo {
  buildDate: string;
  version: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent  {

   private readonly versionUrl = 'assets/version.json';

  versionInfo$ = this.getVersionInfo();

  buildDate$ = this.versionInfo$.pipe(
    map(v => v?.buildDate)
  );

  version$ = this.versionInfo$.pipe(
    map(v => v?.version)
  );

  constructor(private readonly http: HttpClient) {}

  getVersionInfo(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>(
      `${this.versionUrl}?v=${Date.now()}`
    );
  }
}
