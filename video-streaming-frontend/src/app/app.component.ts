import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from './core/services/user.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'video-streaming-frontend';

	constructor(
		private oidcSecurityService: OidcSecurityService,
		private userService: UserService
	) {}

	ngOnInit() {
		let localUser = this.userService.getUser();
		console.log('App Component Render');

		this.oidcSecurityService.checkAuth().subscribe((loginResponse: LoginResponse) => {
			const { isAuthenticated, userData, accessToken } = loginResponse;
			console.log('Auth : ' + isAuthenticated);
			if (isAuthenticated) {
				if (!localUser) {
					console.log('Request Send!');
					this.userService.registerUser(userData, accessToken);
				}
			}
		});
	}
}
