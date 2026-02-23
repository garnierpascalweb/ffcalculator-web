import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Result } from '../models/result.model';
import { LoggerService } from '../services/logger.service';
import { ResultService } from '../services/result.service';
import { ViewService } from '../services/view.service';
import { ResultAddComponent } from './result-add/result-add.component';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {
  private readonly TAG = 'SimulatorComponent';
  private readonly APPNAME = 'FFCalculator';
  results$: Observable<Result[]> | undefined;

  constructor(private log: LoggerService, private resultService: ResultService, private viewService: ViewService) {

  }

  ngOnInit(): void {
    this.results$ = this.resultService.results$;
  }

  getCurrentViewLabel() {
    return this.viewService.getCurrentView()?.label;
  }

  
}