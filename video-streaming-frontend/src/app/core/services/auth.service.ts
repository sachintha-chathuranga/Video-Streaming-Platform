import { Injectable } from '@angular/core';
import { AuthenticatedResult, LoginResponse, OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { Observable, combineLatest, map, take } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private oidcAuthService: OidcSecurityService) {}

	login() {
		this.oidcAuthService.authorize();
	}
	logout() {
		this.oidcAuthService.logoffAndRevokeTokens().pipe(take(1)).subscribe();
		// this.oidcAuthService.logoffAndRevokeTokens();
	}

	isAuthenticated(): Observable<AuthenticatedResult> {
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
