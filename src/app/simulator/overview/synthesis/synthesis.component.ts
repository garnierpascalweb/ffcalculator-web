import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewOption } from 'src/app/models/viewoption.model';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.scss']
})
export class SynthesisComponent {
  /**
   * Somme des points, dans la limite des 15 meilleurs résultats
   */
  @Input() sumpts!: Observable<number>;
  /**
   * Position au classement national (sur le classement correspondant à la vue)
   */
  @Input() ranking!: Observable<number>;
  /**
   * le type de classement correspondant a la vue courante donné par le parent
   */
  @Input() classType!: Observable<String>;

}