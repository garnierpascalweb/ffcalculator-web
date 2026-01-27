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
  constructor(private log: LoggerService, private resultService: ResultService, private rankingService : RankingService){

  }
  ngOnInit(): void {
    this.pts = 265.64;
    this.ranking$ = this.getRanking(this.pts);
  }




  getRanking(pts: number){
    return this.rankingService.getRanking(pts);
  }
}
