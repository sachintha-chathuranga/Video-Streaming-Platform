import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/components/sidebar/sidebar.component';
import { SideBarItem } from '../../../layout/sidebar/models/sidebarItem.dto';
import { FeatureComponent } from '../../feature/feature.component';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [
		SidebarComponent,
		MatSidenavContainer,
		FeatureComponent,
		RouterModule,
		CommonModule,
		FlexLayoutModule,
		MatSidenavModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.css',
})
export class ProfileComponent {
	items: SideBarItem[] = itemList;

	constructor(private router: Router, private location: Location) {}
}

const itemList = [
	{
		icon: 'account_circle',
		text: 'Profile',
		link: '/profile',
	},
	{
		icon: 'dashboard',
		text: 'Dashboard',
		link: '/profile/dashboard',
	},
	{
		icon: 'video_library',
		text: 'Content',
		link: '/profile/content',
	},
	{
		icon: 'insert_chart',
		text: 'Analytics',
		link: '/profile/analytics',
	},
];
