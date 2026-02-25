import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.versionInfo$ = this.getVersion();   
  }

  getVersion(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>(this.versionUrl);
  }
}
