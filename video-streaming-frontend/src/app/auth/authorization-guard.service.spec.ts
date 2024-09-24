import { TestBed } from '@angular/core/testing';

import { AuthorizationGuard } from './authorization-guard.service';

describe('AuthorizationGuardService', () => {
  let service: AuthorizationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
