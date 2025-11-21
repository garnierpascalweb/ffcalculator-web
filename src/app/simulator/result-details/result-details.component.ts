import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Result } from 'src/app/models/result.model';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent {

  @Input() result!: Result;


  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor(private gridService : GridService){

  }

 ngOnInit() {
  //console.log("LOGO =", this.place);
    console.log('result reçu =', this.result);
  console.log('type =', typeof this.result);
}

ngOnChanges(changes: SimpleChanges) {
  console.log('result reçu :', this.result);
}
  getLogo(code: string):string {
    let gridLogo = "rien";
    this.gridService.getGridByCode(code).subscribe(grid => {
      if (grid){
        gridLogo = grid.logo;
      } else {
        
      }
    }

    );
    return gridLogo;
    
  }
}
