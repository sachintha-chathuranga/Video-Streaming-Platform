import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeStatisticsComponent } from './realtime-statistics.component';

describe('RealtimeStatisticsComponent', () => {
  let component: RealtimeStatisticsComponent;
  let fixture: ComponentFixture<RealtimeStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
