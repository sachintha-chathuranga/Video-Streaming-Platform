import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAnalyticComponent } from './channel-analytic.component';

describe('ChannelAnalyticComponent', () => {
  let component: ChannelAnalyticComponent;
  let fixture: ComponentFixture<ChannelAnalyticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAnalyticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelAnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
