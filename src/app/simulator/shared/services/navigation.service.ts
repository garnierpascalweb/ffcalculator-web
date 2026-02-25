import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }
  selectedTabIndex = 0;

  goToTab(index: number) {
    this.selectedTabIndex = index;
  }

}
