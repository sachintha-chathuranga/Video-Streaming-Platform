import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginResponse } from 'angular-auth-oidc-client';
import { takeUntil } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { BaseComponent } from './shared/components/base/base.component';
import { UserService } from './shared/services/user.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent extends BaseComponent {
	title = 'video-streaming-frontend';

	constructor(private oidcAuthService: AuthService, private userService: UserService) {
		super();
	}
	ngOnInit() {
		let localUser = this.userService.getUser();
		console.log('App Component Render');

		this.oidcAuthService
			.checkAuth()
			.pipe(takeUntil(this.destroy$))
			.subscribe((loginResponse: LoginResponse) => {
				const { isAuthenticated, userData, accessToken } = loginResponse;
				console.log('Auth : ' + isAuthenticated);
				if (isAuthenticated) {
					if (!localUser) {
						this.userService.registerUser(userData, accessToken);
					}
				}
			});
	}
}
