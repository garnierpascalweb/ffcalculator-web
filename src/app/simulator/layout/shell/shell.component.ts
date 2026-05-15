import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  selectedTabIndex = 0;

  private routes = ['add', 'list', 'overview'];

  constructor(private readonly router: Router) {

    // sync URL -> bottom nav
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncTabWithUrl();
      });
  }

  ngOnInit(): void {
    this.syncTabWithUrl();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.router.navigate([this.routes[index]]);
  }

  private syncTabWithUrl(): void {
    const url = this.router.url;

    if (url.includes('list')) {
      this.selectedTabIndex = 1;
    } else if (url.includes('overview')) {
      this.selectedTabIndex = 2;
    } else {
      this.selectedTabIndex = 0;
    }
  }

  getCurrentViewLabel(): string {
    switch (this.selectedTabIndex) {
      case 1: return 'Résultats';
      case 2: return 'Synthèse';
      default: return 'Ajout d un résultat';
    }
  }
}
