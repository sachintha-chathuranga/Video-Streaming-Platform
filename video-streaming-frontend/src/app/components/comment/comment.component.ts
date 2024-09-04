import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardAvatar, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommentDto } from '../../dto/comment.dto';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    CommentCardComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input()
  videoId: string = '';
  commentsForm: FormGroup;
  comment: FormControl;
  commentsDto: CommentDto[] = [];
  isFocus: boolean = false;
  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private matSnackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.commentsForm = this.fb.group({
      comment: [''],
    });
    this.comment = this.commentsForm.get('comment') as FormControl;
  }
  onFocus() {
    this.isFocus = true;
  }

  onCancel() {
    this.isFocus = false;
    this.comment.reset();
  }

  
  ngOnInit(): void {
    // this.getComments();
  }
  
  postComment() {
    if (this.comment.value) {
      // Handle posting the comment here
      console.log('Comment posted:', this.comment.value);
      
      const commentDto = {
        commentText: this.comment,
        authorId: this.userService.getUserId(),
      };
      
      this.commentService.postComment(commentDto, this.videoId).subscribe(() => {
        this.matSnackBar.open('Comment Posted Successfully', 'OK');
        this.comment.reset();
        this.isFocus = false;
        this.getComments();
      });
    }
    }
    autoGrow(event: Event): void {
    const textArea = event.target as HTMLTextAreaElement;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
  getComments() {
    this.commentService.getAllComments(this.videoId).subscribe((data) => {
      this.commentsDto = data;
    });
  }
}
