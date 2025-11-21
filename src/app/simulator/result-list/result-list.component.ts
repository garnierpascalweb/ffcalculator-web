import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result.model';
import { LoggerService } from 'src/app/services/logger.service';
import { ResultService } from 'src/app/services/result.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {

private readonly TAG = 'ResultListComponent';
  
@Input() results: Result[] | null = null;
  constructor(private log: LoggerService, private resultService: ResultService){

  }

  ngOnInit(): void {
   
  }
 
}
