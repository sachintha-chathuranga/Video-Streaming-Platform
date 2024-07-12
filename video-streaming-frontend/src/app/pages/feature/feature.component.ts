import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { VideoDto } from '../../dto/video.dto';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [VideoCardComponent, CommonModule, FlexLayoutModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent {
  featuredVideos: Array<VideoDto> =[];

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    // this.videoService.getAllVideos().subscribe((response) => {
    //   this.featuredVideos = response;
    // });
    this.videoService.getAllVideos().then((data) => {
      this.featuredVideos = data
    })
  }
}

