import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-position-marker',
  templateUrl: './position-marker.component.html',
  styleUrls: ['./position-marker.component.scss']
})
export class PositionMarkerComponent {
  @Input() percent!: Observable<number>;
  /**
   * le type de classement correspondant a la vue courante donné par le parent
   */
  @Input() classType!: Observable<string>;

  //TODO 1.0.0 mettre ca en parametre quelque part
  yPercent = 20;
}


