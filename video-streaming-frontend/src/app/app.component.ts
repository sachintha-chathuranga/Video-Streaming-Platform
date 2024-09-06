import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'video-streaming-frontend';

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } =
          loginResponse;
        console.log('isAuthenticated:' + isAuthenticated);

        console.log('Token:', accessToken);
        // Decode the token to inspect the payload
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('Token payload:', payload);
      });
  }
}
