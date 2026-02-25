import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Result } from './features/result/models/result.model';
import { ResultService } from './features/result/services/result.service';
import { ViewService } from './shared/components/view/services/view.service';
import { LoggerService } from './shared/services/logger.service';


@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {
  private readonly TAG = 'SimulatorComponent';
  private readonly APPNAME = 'FFCalculator';
  selectedTabIndex = 0;

  results$: Observable<Result[]> | undefined;

  constructor(private log: LoggerService, private resultService: ResultService, private viewService: ViewService) {

  }

  ngOnInit(): void {
    this.results$ = this.resultService.results$.pipe(
    map(results => [...results].reverse())
  );
  }

  getCurrentViewLabel() {
    return this.viewService.getCurrentView()?.label;
  }

  /**
   * evenement envoyé par le composant enfant app-result-add
   * survient quand un resultat est réellement ajouté
   * change d'onglet pour basculer sur l'onglet résultats
   */
  onResultAdded() {
    this.selectedTabIndex = 1; // bascule sur l'onglet liste
  }

  
}