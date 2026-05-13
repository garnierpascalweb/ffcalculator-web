import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { map } from 'rxjs';
import { Result } from '../../models/result.model';
import { ResultService } from '../../services/result.service';


@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent {

  private readonly TAG = 'ResultListComponent';
results$ = this.resultService.results$;

top15Set$ = this.resultService.results$.pipe(
  map(results => {
    const top15 = results
      .map(r => r.pts)
      .sort((a, b) => b - a)
      .slice(0, 15);

    return new Set(top15);
  })
);

  constructor(private readonly resultService: ResultService) {

  }

 
}
