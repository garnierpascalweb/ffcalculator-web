import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-position-marker',
  templateUrl: './position-marker.component.html',
  styleUrls: ['./position-marker.component.scss']
})
export class PositionMarkerComponent  {
  @Input() percent!: Observable<number>;  
  /**
   * le type de classement correspondant a la vue courante donné par le parent
   */
  @Input() classType!: Observable<String>;

  //xPercent = 2.9;  
  yPercent = 20;  

}


