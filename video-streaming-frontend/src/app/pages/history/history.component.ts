import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, VideoCardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

}
