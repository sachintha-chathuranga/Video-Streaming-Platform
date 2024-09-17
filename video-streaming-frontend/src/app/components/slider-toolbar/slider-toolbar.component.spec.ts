import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderToolbarComponent } from './slider-toolbar.component';

describe('SliderToolbarComponent', () => {
  let component: SliderToolbarComponent;
  let fixture: ComponentFixture<SliderToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
