import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { 
  constructor(private http: HttpClient){}
  ngOnInit(): void {    
     //this.http.get(environment.trackingUrl).subscribe();
     // 28/08/2025 - POST et utilisation du nouveau service
    this.http.post(environment.trackingUrl,{}, {
        params: { script: 'FFCalculator' }
      }
    ).subscribe();
  }
}
