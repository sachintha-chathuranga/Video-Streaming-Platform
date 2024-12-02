import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadStepperComponent } from './video-upload-stepper.component';

describe('VideoUploadStepperComponent', () => {
  let component: VideoUploadStepperComponent;
  let fixture: ComponentFixture<VideoUploadStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoUploadStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoUploadStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
