import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { UserFormComponent } from '../../components/user-form/user-form.component';
@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [CommonModule,UserFormComponent, MatButtonModule, MatTabsModule],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css',
})
export class PersonalDataComponent {
  coverImage: string =
    'url("https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png")';

  changeBackground(newImageUrl: string) {
    this.coverImage = `url(${newImageUrl})`;
  }
}
