import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-result-add',
  templateUrl: './result-add.component.html',
  styleUrls: ['./result-add.component.scss']
})
export class ResultAddComponent {
 placeCtrl = new FormControl('');
  filteredPlaces!: Observable<string[]>;

  places: string[] = [
    'Paris', 'Marseille', 'Lyon', 'Toulouse'
  ];

  classes: string[] = [
    'GT', 'Tourisme', 'Prototype', 'Rallye'
  ];

  positions: number[] = Array.from({ length: 50 }, (_, i) => i + 1);
  partants: number[] = Array.from({ length: 50 }, (_, i) => i + 1);

  classCtrl = new FormControl('');
  posCtrl = new FormControl('');
  prtsCtrl = new FormControl('');

  ngOnInit() {
    this.filteredPlaces = this.placeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPlaces(value || ''))
    );
  }

  private filterPlaces(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.places.filter(
      item => item.toLowerCase().includes(filterValue)
    );
  }
}
