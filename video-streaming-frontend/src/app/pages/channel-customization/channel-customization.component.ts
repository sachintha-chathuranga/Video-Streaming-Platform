import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BrandingComponent } from '../../components/branding/branding.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
	selector: 'app-channel-customization',
	standalone: true,
	imports: [CommonModule, UserFormComponent, BrandingComponent, MatButtonModule],
	templateUrl: './channel-customization.component.html',
	styleUrl: './channel-customization.component.css',
})
export class ChannelCustomizationComponent {}
