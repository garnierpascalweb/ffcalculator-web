import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-position-marker',
  templateUrl: './position-marker.component.html',
  styleUrls: ['./position-marker.component.scss']
})
export class PositionMarkerComponent  {
  @Input() percent!: Observable<number>;  

  //xPercent = 2.9;  
  yPercent = 20;  
}


