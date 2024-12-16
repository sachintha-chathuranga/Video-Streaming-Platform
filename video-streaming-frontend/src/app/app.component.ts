import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { UserDto } from './core/models/user.dto';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';

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
		private oidcAuthService: AuthService,
		private userService: UserService
	) {}

	ngOnInit() {
		let localUser = this.userService.getUser();
		console.log('App Component Render');

		this.oidcAuthService.checkAuth().subscribe((loginResponse: LoginResponse) => {
			const { isAuthenticated, userData, accessToken } = loginResponse;
			console.log('Auth : ' + isAuthenticated);
			if (isAuthenticated) {
				if (!localUser) {
					console.log('Request Send to Backend for get User!');
					this.userService.registerUser(userData, accessToken).subscribe({
						next: (user: UserDto) => {
							this.userService.setUser(user);
						},
						error: (errorResponse: HttpErrorResponse) => {
							console.log(errorResponse.error);
						},
					});
				}
			}
		});
	}
}
