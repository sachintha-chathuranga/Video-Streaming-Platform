import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginResponse } from 'angular-auth-oidc-client';
import { AuthService } from './core/services/auth.service';
import { UserService } from './shared/services/user.service';
import { UserDto } from './shared/models/user.dto';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'video-streaming-frontend';

	constructor(private oidcAuthService: AuthService, private userService: UserService) {}

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
