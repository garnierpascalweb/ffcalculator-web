import { Component } from '@angular/core';
import { ClassementService } from 'src/app/services/classement.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ResultService } from 'src/app/services/result.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  constructor(private log: LoggerService, private resultService: ResultService, private rankingService : ClassementService){

  }
}
