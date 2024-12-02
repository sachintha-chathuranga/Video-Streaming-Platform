import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUpdateDialogComponent } from './video-update-dialog.component';

describe('VideoUpdateDialogComponent', () => {
  let component: VideoUpdateDialogComponent;
  let fixture: ComponentFixture<VideoUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
