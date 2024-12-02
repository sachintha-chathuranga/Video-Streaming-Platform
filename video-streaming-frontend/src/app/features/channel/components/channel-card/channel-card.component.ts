import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'channel-card',
	standalone: true,
	imports: [MatButton, NgClass, NgIf],
	templateUrl: './channel-card.component.html',
	styleUrl: './channel-card.component.css',
})
export class ChannelCardComponent {
	@Input()
	isWindowView!: boolean;
}
