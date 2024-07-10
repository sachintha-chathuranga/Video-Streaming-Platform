import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { VideoUploadComponent } from '../../components/video-upload/video-upload.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  readonly dialog = inject(MatDialog);
  constructor() {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: '80%',
      maxWidth: '900px',
      height: '590px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
