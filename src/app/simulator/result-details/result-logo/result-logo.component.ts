import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-logo',
  templateUrl: './result-logo.component.html',
  styleUrls: ['./result-logo.component.scss']
})
export class ResultLogoComponent {
@Input() value: string = '';

  // Génère une classe CSS basée sur la valeur
  get cssClass(): string {
    return this.value
      .toLowerCase()
      .replace(/\s+/g, '-')   // remplace espaces par tirets
      .replace(/\//g, '-')    // remplace slash par tirets
      .replace(/[^a-z0-9-]/g, ''); // nettoie caractères spéciaux
  }
}
