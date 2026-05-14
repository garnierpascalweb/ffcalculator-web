import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  enabled: boolean;

  constructor() {
    this.enabled = environment.features.logging;
    console.log(' loggine enabled : ' + this.enabled);
  }

  trace(className: string, message: string) {
    if (this.enabled)
      console.log("[TRACE] [" + className + "] " + message);
  }

  debug(className: string, message: string) {
    if (this.enabled)
      console.log("[DEBUG] [" + className + "] " + message);
  }

  info(className: string, message: string) {
    if (this.enabled)
      console.log("[INFO] [" + className + "] " + message);
  }

  error(className: string, message: string) {
    if (this.enabled)
      console.log("[ERROR] [" + className + "] " + message);
  }
}
