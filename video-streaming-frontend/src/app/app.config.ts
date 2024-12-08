import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {  authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './core/services/auth.config';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([authInterceptor()])), // this will manage adding token to every request
		provideAuth(authConfig), // this will use angular-auth-oidc configuration
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withRouterConfig({ onSameUrlNavigation: "reload" })),
		provideAnimationsAsync(),
	],
};
