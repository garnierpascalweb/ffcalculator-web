import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';


@Component({
  selector: 'app-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.scss']
})
export class HelpMenuComponent {
  private readonly TAG = 'HelpMenuComponent';
  constructor(private readonly log: LoggerService, private readonly dialog: MatDialog) {

  }

  openHelpDialog(): void {
    this.log.debug(this.TAG, "click menu a propos");
  }

}
