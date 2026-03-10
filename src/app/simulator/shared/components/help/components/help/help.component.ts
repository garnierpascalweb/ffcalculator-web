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
export class HelpComponent implements OnInit {

  private versionUrl = 'assets/version.json';
   versionInfo$: Observable<VersionInfo>;
    buildDate$: Observable<string>;
    version$: Observable<string>;

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.versionInfo$ = this.getVersionInfo(); 
      this.buildDate$ = this.versionInfo$.pipe(
      map(versionInfo => versionInfo?.buildDate)
    );
    this.version$ = this.versionInfo$.pipe(
      map(versionInfo => versionInfo?.version)
    );
  }

  getVersionInfo(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>(this.versionUrl + `?v=${Date.now()}`);
  }
}
