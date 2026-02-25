import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';
import { Result } from '../../models/result.model';
import { ResultService } from '../../services/result.service';


@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit, OnChanges {

  private readonly TAG = 'ResultListComponent';

  @Input() results: Result[] | null = null;
  top15Pts: number[] = [];

  constructor(private log: LoggerService, private resultService: ResultService) {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.results) return;
    this.top15Pts = [...this.results]
      .map(r => r.pts)         // mapper un resultat a ses points
      .sort((a, b) => b - a)   // du plus grand au plus petit
      .slice(0, 15);           // garder les 15 meilleurs
  }
}
