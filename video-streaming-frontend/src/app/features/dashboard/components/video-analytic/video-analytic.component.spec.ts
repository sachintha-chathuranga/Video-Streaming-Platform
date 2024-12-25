import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAnalyticComponent } from './video-analytic.component';

describe('VideoAnalyticComponent', () => {
  let component: VideoAnalyticComponent;
  let fixture: ComponentFixture<VideoAnalyticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoAnalyticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoAnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
