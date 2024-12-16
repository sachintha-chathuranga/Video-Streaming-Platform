import { Injectable } from '@angular/core';
import { AuthenticatedResult, LoginResponse, OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthUserDto } from '../models/auth.dto';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private oidcAuthService: OidcSecurityService) {}

	login() {
		this.oidcAuthService.authorize();
	}
	logout() {
		this.oidcAuthService.logoffAndRevokeTokens().subscribe();
	}

	isAuthenticated() {
		return this.oidcAuthService.isAuthenticated$;
	}
	checkAuth(): Observable<LoginResponse> {
		return this.oidcAuthService.checkAuth();
	}
	getAuthState(): Observable<{ authResult: AuthenticatedResult; userDataResult: UserDataResult }> {
		return combineLatest([
			this.oidcAuthService.isAuthenticated$,
			this.oidcAuthService.userData$,
		]).pipe(
			map(([authResult, userDataResult]) => ({
				authResult,
				userDataResult,
			}))
		);
	}
}
