import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 constructor(private snackBar: MatSnackBar) {}

  success(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: 'snackbar-success'
    });
  }

  error(msg: string) {
    this.snackBar.open(msg, 'Fermer', {
      panelClass: 'snackbar-error'
    });
  }

  info(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }
}
