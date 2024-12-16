import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ChannelFormComponent } from './components/channel-form/channel-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';

@Component({
	selector: 'app-channel-customization',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatTabsModule, UserFormComponent, ChannelFormComponent],
	templateUrl: './profile-customization.component.html',
	styleUrl: './profile-customization.component.css',
})
export class ChannelCustomizationComponent {
	selected = new FormControl(0);
	@ViewChild(ChannelFormComponent) channelFormComponent!: ChannelFormComponent;

	navigateToChannel() {
		this.channelFormComponent.gotoChannel();
	}
}
