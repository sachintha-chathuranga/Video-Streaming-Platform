import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { UserDto } from '../../core/models/user.dto';
import { UserService } from '../../core/services/user.service';
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
	activeTab: string = 'account';
	@ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;
	user!: UserDto;

	constructor(private router: Router, private userService: UserService) {}
	ngOnInit() {
		this.user = this.userService.getUser();
	}
	selectTab(tabName: string) {
		this.activeTab = tabName;
	}
	resetUserdForm(): void {
		if (this.userFormComponent) {
			this.userFormComponent.resetForm();
		}
	}
	publishUser() {
		if (this.userFormComponent) {
			this.userFormComponent.publishChanges();
		}
	}
	gotoChannel() {
		const url = this.router.createUrlTree([`/channel/${this.user.id}`]).toString();
		window.open(url, '_blank');
		// this.router.navigate(['/channel', this.user.id]);
	}
}
