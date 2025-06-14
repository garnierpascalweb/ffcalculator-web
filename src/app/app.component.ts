import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { 
  constructor(private meta: Meta, private title: Title,private http: HttpClient){}
  ngOnInit(): void {
    this.title.setTitle('FFCalculator');
      this.meta.addTags([
    { name: 'description', content: 'Page d’accueil de l’application Angular' },
    { name: 'keywords', content: 'FFCalculator, Calcul de points FFC, Open 1, Open 2, Open 3, Access, Elite, U17, U23, Android, cyclisme, course FFC' },
    { name: 'author', content: 'Pascal GARNIER' }
  ]);
     this.http.get(environment.trackingUrl).subscribe();
  }
}
