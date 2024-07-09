import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommentDto } from '../../dto/comment.dto';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';

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
    MatDividerModule
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input()
  videoId: string = '';
  commentsForm: FormGroup;
  commentsDto: CommentDto[] = [];

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private matSnackBar: MatSnackBar
  ) {
    this.commentsForm = new FormGroup({
      comment: new FormControl('comment'),
    });
  }

  ngOnInit(): void {
    this.getComments();
  }

  postComment() {
    const comment = this.commentsForm.get('comment')?.value;

    const commentDto = {
      commentText: comment,
      authorId: this.userService.getUserId(),
    };

    this.commentService.postComment(commentDto, this.videoId).subscribe(() => {
      this.matSnackBar.open('Comment Posted Successfully', 'OK');

      this.commentsForm.get('comment')?.reset();
      this.getComments();
    });
  }

  getComments() {
    this.commentService.getAllComments(this.videoId).subscribe((data) => {
      this.commentsDto = data;
    });
  }
}
