import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent {

  @Input() place!: string;
  @Input() details!: string;
  @Input() pts!: string;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

 ngOnInit() {
  console.log("LOGO =", this.place);
}
}
