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

    pts: number;
  ranking$: Observable<number>;
  percent$: Observable<number>;
  constructor(private log: LoggerService, private resultService: ResultService, private rankingService : RankingService){

  }
  ngOnInit(): void {
    this.pts = this.resultService.getPts();
    this.ranking$ = this.getRanking(this.pts);
    this.percent$ = this.getPercent(this.pts);
  }




  getRanking(pts: number){
    return this.rankingService.getRanking(pts);
  }

  getPercent(pts: number){
    return this.rankingService.getPercent(pts);
  }
}
