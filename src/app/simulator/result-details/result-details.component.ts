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

  constructor(private gridService: GridService) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  getAvatarUrl(): string {
    return `assets/icons/logo/${this.getLogo(this.result?.code)}`;
    //return `assets/icons/logo/logo-elite.svg`;
  }

  getLogo(code: string): string { 
    let svgLogo: string = 'logo-default.svg';
    this.gridService.getGridByCode(code).subscribe(grid => {
      if (grid) {        
        switch (grid.logo) {
          case 'Elite':
          case 'CDF N1':
          case 'CDF N2':
          case 'CDF N3':
            svgLogo = 'logo-elite.svg';
            break;

          case 'Open 1/2':
            svgLogo = 'logo-open-1-2.svg';
            break;

          case 'Open 1/2/3':
            svgLogo = 'logo-open-1-2-3.svg';
            break;

          case 'Open 2/3':
            svgLogo = 'logo-open-2-3.svg';
            break;

          case 'Open 3':
            svgLogo = 'logo-open-3.svg';
            break;

          case 'U23':
            svgLogo = 'logo-u23.svg';
            break;

          case 'U19':
            svgLogo = 'logo-u19.svg';
            break;

          case 'U17':
            svgLogo = 'logo-u17.svg';
            break;

          default:
            svgLogo = 'logo-default.svg'; // valeur par défaut si aucun match
        }

      } else {
        svgLogo = 'logo-default.svg'; // valeur par défaut si aucun match
      }
    }

    );
    return svgLogo;
  }
}
