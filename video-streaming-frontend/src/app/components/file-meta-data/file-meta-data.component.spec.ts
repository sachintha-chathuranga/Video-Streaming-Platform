import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMetaDataComponent } from './file-meta-data.component';

describe('FileMetaDataComponent', () => {
  let component: FileMetaDataComponent;
  let fixture: ComponentFixture<FileMetaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMetaDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileMetaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
