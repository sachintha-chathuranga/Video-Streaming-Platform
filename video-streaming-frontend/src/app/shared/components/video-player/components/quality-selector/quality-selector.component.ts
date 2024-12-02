import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuItem } from '@angular/material/menu';
import { BitrateOptions, VgApiService } from '@videogular/ngx-videogular/core';
import { SpeedOptions } from '../../models/speeds.dto';

@Component({
	selector: 'app-quality-selector',
	standalone: true,
	imports: [CommonModule, MatMenuItem, MatIconModule, MatDivider],
	templateUrl: './quality-selector.component.html',
	styleUrl: './quality-selector.component.css',
})
export class QualitySelectorComponent implements OnChanges {
	@Input()
	bitrates!: BitrateOptions[];

	@Output()
	onBitrateChange: EventEmitter<BitrateOptions> = new EventEmitter<BitrateOptions>();

	selectedBitrate!: BitrateOptions;
	activeMenuIndex: number;
	playbackSpeeds: SpeedOptions[];
	selectedSpeed: SpeedOptions;

	constructor(private vgApi: VgApiService) {
		this.activeMenuIndex = -1;
		this.playbackSpeeds = speeds;
		this.selectedSpeed = speeds[3];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['bitrates']) {
			if (!this.selectedBitrate) {
				this.selectedBitrate = changes['bitrates'].currentValue[0];
			}
		}
	}

	changeQuality(bitrate: BitrateOptions) {
		this.selectedBitrate = bitrate;
		this.activeMenuIndex = -1;
		this.onBitrateChange.emit(bitrate);
	}

	changePlaybackSpeed(speedObject: SpeedOptions) {
		this.selectedSpeed = speedObject;
		this.activeMenuIndex = 1;
		const videoElement = this.vgApi.getDefaultMedia().elem as HTMLVideoElement;
		videoElement.playbackRate = speedObject.speed;
	}

	activeMenu(index: number) {
		this.activeMenuIndex = index;
	}
	toggleMenu() {
		this.activeMenuIndex != -1 ? (this.activeMenuIndex = -1) : (this.activeMenuIndex = 1);
	}
}

const speeds: SpeedOptions[] = [
	{
		label: '0.25',
		speed: 0.25,
	},
	{
		label: '0.5',
		speed: 0.5,
	},
	{
		label: '0.75',
		speed: 0.75,
	},
	{
		label: 'Normal',
		speed: 1,
	},
	{
		label: '1.25',
		speed: 1.25,
	},
	{
		label: '1.5',
		speed: 1.5,
	},
	{
		label: '2',
		speed: 2,
	},
];
