import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient) { }
  getVersion() {
    return this.http.get<{ buildDate: string }>('/assets/version.json');
  }
}
