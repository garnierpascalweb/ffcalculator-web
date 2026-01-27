import { Component, OnInit } from '@angular/core';
import { RankingService } from 'src/app/services/ranking.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ResultService } from 'src/app/services/result.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  sumPts$: Observable<number>;
  ranking$: Observable<number>;
  percent$: Observable<number>;
  constructor(private log: LoggerService, private resultService: ResultService, private rankingService : RankingService){

  }
  ngOnInit(): void {
    this.sumPts$ = this.resultService.getSumPts();
    this.ranking$ = this.rankingService.getRanking(this.sumPts$);
    this.percent$ = this.rankingService.getPercent(this.sumPts$);
  }
}
