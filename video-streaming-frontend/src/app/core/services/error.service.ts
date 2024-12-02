import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorDto } from '../models/error.dto';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	errorObject!: ErrorDto;
	constructor() {}

	generateError(error: HttpErrorResponse) {
		console.log(error);
		switch (error.status) {
			case 0:
				this.errorObject = {
					errorTitle: 'Server Does not Respond!',
					errorMessage: 'Try again after few second.',
					errorIcon: 'assets/astroMan.png',
				};
				break;
			case 404:
				this.errorObject = {
					errorTitle: 'Page Not Found!',
					errorMessage: "You're offline. Check your connection.",
					errorIcon: 'assets/astroMan.png',
				};
				break;
			default:
				this.errorObject = {
					errorTitle: error.error.title,
					errorMessage: error.error.description,
					errorIcon: 'assets/astroMan.png',
				};
				break;
		}
		return this.errorObject;
	}
}
