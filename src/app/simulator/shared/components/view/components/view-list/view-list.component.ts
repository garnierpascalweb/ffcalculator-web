import { Component } from '@angular/core';
import { ViewOption } from '../../models/viewoption.model';
import { ViewService } from '../../services/view.service';


@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent {
  viewOptions!: ViewOption[];
  currentView!: ViewOption;

  constructor(private viewService: ViewService) { }

  ngOnInit() {
    this.viewOptions = this.viewService.getViews();
    this.currentView = this.viewService.getCurrentView();

    // Pour réagir aux changements depuis d’autres composants
    this.viewService.selectedView$.subscribe(v => this.currentView = v);
  }

  changeView(id: string) {
    this.viewService.setView(id);
  }
}
