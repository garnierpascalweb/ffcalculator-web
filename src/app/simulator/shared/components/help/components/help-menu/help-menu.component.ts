import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from 'src/app/simulator/shared/services/logger.service';

import { HelpComponent } from '../help/help.component';

@Component({
  selector: 'app-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.scss']
})
export class HelpMenuComponent {
 private readonly TAG = 'HelpMenuComponent';
  constructor(private log: LoggerService, private dialog: MatDialog){

  }

    openHelpDialog(): void {
    this.log.debug(this.TAG, "click menu a propos");
    const dialogRef = this.dialog.open(HelpComponent, {
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false
    });
  }

}
