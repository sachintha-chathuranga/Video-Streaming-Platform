import { TestBed } from '@angular/core/testing';
import { CommentService } from '../features/video/components/comments/services/comment.service';



describe('CommentService', () => {
  let service: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
