import { TestBed } from '@angular/core/testing';

import { SubscriptionManagerServiceService } from './subscription-manager-service.service';

describe('SubscriptionManagerServiceService', () => {
  let service: SubscriptionManagerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionManagerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
