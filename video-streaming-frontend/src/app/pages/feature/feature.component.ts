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
  featuredVideos: Array<VideoDto> = videoList;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getAllVideos().subscribe((response) => {
      this.featuredVideos = response;
    });
  }
}

const videoList = [
  {
    id: 2,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 2,
    dislikesCount: 2,
    viewsCount: 0,
  },
  {
    id: 52,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 2,
  },
  {
    id: 53,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 1,
  },
  {
    id: 54,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 0,
  },
  {
    id: 55,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 0,
  },
  {
    id: 56,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 0,
  },
  {
    id: 57,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl: "null",
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 1,
  },
  {
    id: 102,
    description: 'here my first video',
    title: 'How to Become a Software Engeneer',
    userId:  1,
    videoUrl:
      'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Video/d319c7a1-da38-4212-a6e6-860c00cbcbec.mp4',
    videoStatus: 'UNLISTED',
    thumbnailUrl: "https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png",
    tags: ['How to', 'ForuBit', 'It', 'computer science'],
    likesCount: 0,
    dislikesCount: 0,
    viewsCount: 0,
  },
];
