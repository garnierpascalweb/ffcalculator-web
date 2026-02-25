import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {

  }

  trace(className: string, message: string){
    console.log("[TRACE] [" + className + "] " + message);
  }

  debug(className: string, message: string){
    console.log("[DEBUG] [" + className + "] " + message);
  }

  info(className: string, message: string){
    console.log("[INFO] [" + className + "] " + message);
  }

  error(className: string, message: string){
    console.log("[ERROR] [" + className + "] " + message);
  }
}
