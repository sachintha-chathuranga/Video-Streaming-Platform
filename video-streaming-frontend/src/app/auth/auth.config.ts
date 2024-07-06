import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'http://localhost:8181/realms/local-keycloak',
    redirectUrl: 'http://localhost:4200',
    clientId: 'app-client',
    scope: 'openid profile offline_access email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    secureRoutes: ['http://localhost:8080/'],
    customParamsAuthRequest: {
      audience: 'http://localhost:8080/',
    },
  },
};
