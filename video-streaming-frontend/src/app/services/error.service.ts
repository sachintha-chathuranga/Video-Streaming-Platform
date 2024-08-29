import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorDto } from '../dto/error.dto';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errorObject!: ErrorDto;
  constructor() { }

  generateError(error: HttpErrorResponse) {
    switch (error.status) {
      case 404:
        this.errorObject = {
          errorTitle: 'Page Not Found!',
          errorMessage: "You're offline. Check your connection.",
          errorIcon: 'assets/astroMan.png',
        };
        break
      default:
        this.errorObject = {
          errorTitle: 'Connect to the internet',
          errorMessage: "You're offline. Check your connection.",
          errorIcon: 'assets/astroMan.png',
        };
        break
    }
    return this.errorObject;
  }
}
