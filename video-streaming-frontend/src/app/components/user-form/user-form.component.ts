import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    FlexLayoutModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  userDetails: FormGroup;
  firstName: FormControl = new FormControl('', [Validators.required]);
  lastName: FormControl = new FormControl('', [Validators.required]);
  about: FormControl = new FormControl('');
  errorMessage = {
    firstName: '',
    lastName: '',
  };
  selectedFile!: File;
  selectedFileName: string = '';
  videoId = '';
  readonly addOnBlur = true;

  isLoading = false;
  uploadProgress = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.userDetails = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      about: this.about,
    });
  }
  updateErrorMessage(controlName: string): void {
    const control = this.userDetails.get(controlName);
    if (control?.hasError('required')) {
      this.errorMessage = {
        ...this.errorMessage,
        [controlName]: `You must enter a ${controlName}`,
      };
    } else {
      this.errorMessage = { firstName: '', lastName: '' };
    }
  }
  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.getVideoDetails();
    }, 2000);
  }

  getVideoDetails(): void {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    // this.userService.getUserDetails(this.videoId).subscribe((data: VideoDto) => {
    //   this.videoUrl = data.videoUrl;
    //   this.thumbnailUrl = data.thumbnailUrl;
    // });

    // this.userDetails.setValue({
    //   firstName: this.data.firstName,
    //   lastName: this.data.firstName,
    //   about: '',
    // });
  }

  saveVideo() {
    // Call the video service to make a http call to our backend

    // const videoMetaData: VideoDto = {
    //   id: Number(this.videoId),
    //   firstName: this.userDetails.get('firstName')?.value,
    //   userId: 1,
    //   lastName: this.userDetails.get('lastName')?.value,
    //   tags: this.tags,
    //   about: this.userDetails.get('about')?.value,
    //   videoUrl: this.videoUrl,
    //   thumbnailUrl: this.thumbnailUrl,
    //   likesCount: 0,
    //   dislikesCount: 0,
    //   viewsCount: 0,
    // };
    // this.userService.saveVideo(videoMetaData).subscribe((data) => {
    //   this.snackBar.open('Video Metadata Updated successfully', 'OK');
    // });
    console.log(this.userDetails);
    if (this.userDetails.status == 'VALID') {
      this.isLoading = true;
      this.uploadProgress = 0;
      const interval = setInterval(() => {
        if (this.uploadProgress < 100) {
          this.uploadProgress += 10;
        } else {
          clearInterval(interval);
          this.isLoading = false;
        }
      }, 200);
    } else {
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.keys(this.userDetails.controls).forEach((field) => {
      const control = this.userDetails.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
