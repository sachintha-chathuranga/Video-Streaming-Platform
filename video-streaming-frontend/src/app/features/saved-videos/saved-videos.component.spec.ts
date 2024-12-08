import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedVideosComponent } from './saved-videos.component';

describe('SavedVideosComponent', () => {
  let component: SavedVideosComponent;
  let fixture: ComponentFixture<SavedVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
