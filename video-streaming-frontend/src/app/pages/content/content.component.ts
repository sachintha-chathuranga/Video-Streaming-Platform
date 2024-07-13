import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VideoFormComponent } from '../../components/video-form/video-form.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  readonly dialog = inject(MatDialog);
  constructor() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(VideoFormComponent, {
      width: '80%',
      maxWidth: '900px',
      height: '590px',
      disableClose: true,
      data: {
        videoId: '1',
        videoUrl: '',
        thumbnailUrl: '',
        title: "Video Title"
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
