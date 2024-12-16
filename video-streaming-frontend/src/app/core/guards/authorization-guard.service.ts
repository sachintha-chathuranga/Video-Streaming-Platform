import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		return this.authService.isAuthenticated().pipe(
			take(1),
			map(({ isAuthenticated }) => {
				console.log("isAuthInAuthGuard: "+isAuthenticated)
				// allow navigation if authenticated
				if (isAuthenticated) {
					return true;
				}

				// redirect if not authenticated
				return this.router.parseUrl('/');
			})
		);
	}
}
