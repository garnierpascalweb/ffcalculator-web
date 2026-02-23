import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from 'src/app/services/logger.service';
import { ResultAddComponent } from '../result-add/result-add.component';

@Component({
  selector: 'app-result-add-menu',
  templateUrl: './result-add-menu.component.html',
  styleUrls: ['./result-add-menu.component.scss']
})
export class ResultAddMenuComponent {
  private readonly TAG = 'ResultAddMenuComponent';

  constructor(private log: LoggerService, private dialog: MatDialog) {
    
  }

  openAddDialog(): void {
    this.log.debug(this.TAG, "click menu ajouter resultat");
    const dialogRef = this.dialog.open(ResultAddComponent, {
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(newResult => {
      if (newResult) {
        console.log('Résultat ajouté', newResult);
      }
    });
  }
}
