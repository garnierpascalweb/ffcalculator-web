import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { VersionService } from '../version.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  versionService: VersionService;
  buildDate!: string;
  
  constructor(private meta: Meta, private title: Title,versionService: VersionService) {
    this.versionService = versionService;
  }

  ngOnInit() {
     this.title.setTitle('FFCalculator');
      this.meta.addTags([
    { name: 'description', content: 'Page d’accueil de l’application Angular' },
    { name: 'keywords', content: 'FFCalculator, Calcul de points FFC, Open 1, Open 2, Open 3, Access, Elite, U17, U23, Android, cyclisme, course FFC' },
    { name: 'author', content: 'Pascal GARNIER' }
  ]);
  this.versionService.getVersion().subscribe(data => {
    this.buildDate = data.buildDate;
  });
}
}
