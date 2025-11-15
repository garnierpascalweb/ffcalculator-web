import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewOption } from 'src/app/models/viewoption.model';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-view-menu',
  templateUrl: './view-menu.component.html',
  styleUrls: ['./view-menu.component.scss']
})
export class ViewMenuComponent {
viewOptions!: ViewOption[];
  currentView!: ViewOption;
  currentView$: Observable<ViewOption>;
  constructor(private viewService: ViewService) {
     this.currentView$ = this.viewService.selectedView$;
  }

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
