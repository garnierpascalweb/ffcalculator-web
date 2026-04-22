import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Result } from '../../models/result.model';


@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements  OnChanges {

  private readonly TAG = 'ResultListComponent';

  @Input() results: Result[] | null = null;
  top15Pts: number[] = [];

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.results) return;
    this.top15Pts = [...this.results]
      .map(r => r.pts)         // mapper un resultat a ses points
      .sort((a, b) => b - a)   // du plus grand au plus petit
      .slice(0, 15);           // garder les 15 meilleurs
  }
}
