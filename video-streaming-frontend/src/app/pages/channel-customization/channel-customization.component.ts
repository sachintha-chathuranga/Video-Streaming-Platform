import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BrandingComponent } from '../../components/branding/branding.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { Route, Router } from '@angular/router';
import { ChannelFormComponent } from '../../components/channel-form/channel-form.component';

@Component({
	selector: 'app-channel-customization',
	standalone: true,
	imports: [CommonModule, UserFormComponent, ChannelFormComponent, MatButtonModule],
	templateUrl: './channel-customization.component.html',
	styleUrl: './channel-customization.component.css',
})
export class ChannelCustomizationComponent {
	activeTab: string = 'account';
	@ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

	constructor(private router: Router) {}
	selectTab(tabName: string) {
		this.activeTab = tabName;
	}
	resetUserdForm(): void {
		if (this.userFormComponent) {
			this.userFormComponent.resetForm();
		}
	}
	publishUser(){
		if (this.userFormComponent) {
			this.userFormComponent.publishChanges();
		}
	}
	navigate(link: string) {
		console.log('click');
		this.router.navigate([link]);
	}
}
