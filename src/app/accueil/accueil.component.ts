import { Component } from '@angular/core';
import { VersionService } from '../version.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  versionService: VersionService;
  buildDate!: string;
  
  constructor(versionService: VersionService) {
    this.versionService = versionService;
  }

  ngOnInit() {
  this.versionService.getVersion().subscribe(data => {
    this.buildDate = data.buildDate;
  });
}
}
