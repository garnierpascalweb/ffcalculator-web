import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
 @Input() selected = 0;
  @Output() tabChange = new EventEmitter<number>();

  tabs = [
    {
      icon: 'assets/icons/tabs/add-logo.svg',
      label: 'Add'
    },
    {
      icon: 'assets/icons/tabs/list-logo.svg',
      label: 'List'
    },
    {
      icon: 'assets/icons/tabs/cup-logo.svg',
      label: 'Overview'
    }
  ];

  selectTab(index: number): void {
    this.tabChange.emit(index);
  }
}
