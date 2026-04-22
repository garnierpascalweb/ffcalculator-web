import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';
import { ViewOption } from 'src/app/simulator/shared/components/view/models/viewoption.model';
import { ViewService } from 'src/app/simulator/shared/components/view/services/view.service';
import { RankingService } from 'src/app/simulator/shared/services/ranking.service';
import { ResultService } from '../../../result/services/result.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  /**
   * somme des points dans la limite des 15 meilleurs résultats (calculés par ResultService)
   */
  sumPts$: Observable<number>;
  /**
   * rang sur le classement correspondant a la vue ()
   */
  ranking$: Observable<number>;
  /**
   * pourcentage au niveau du classement (pour la fleche)
   */
  percent$: Observable<number>;
  /**
   * vue courante
   */
  view$: Observable<ViewOption>;
  /**
   * le type de classement associé a la vue courante
   */
  classType$!: Observable<string>;

  constructor(private readonly resultService: ResultService, private readonly rankingService: RankingService, private readonly viewService: ViewService) {

  }
  ngOnInit(): void {
    this.sumPts$ = this.resultService.getSumPts();
    this.ranking$ = this.rankingService.getRanking(this.sumPts$);
    this.percent$ = this.rankingService.getPercent(this.sumPts$);
    this.view$ = this.viewService.selectedView$;
    this.classType$ = this.view$.pipe(
      map(view => view?.classType)
    );
  }


}
