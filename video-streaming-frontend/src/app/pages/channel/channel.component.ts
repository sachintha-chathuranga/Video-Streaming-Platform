import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-channel',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	templateUrl: './channel.component.html',
	styleUrl: './channel.component.css',
})
export class ChannelComponent {
	coverImage: string =
		'url("https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png")';

	changeBackground(newImageUrl: string) {
		this.coverImage = `url(${newImageUrl})`;
	}
}
