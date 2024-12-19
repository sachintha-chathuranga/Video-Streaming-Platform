import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { FeatureComponent } from '../../../features/feature/feature.component';
import { SideBarItem } from '../../sidebar/models/sidebarItem.dto';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		CommonModule,
		MatSidenavContainer,
		RouterModule,
		FlexLayoutModule,
		MatSidenavModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		FeatureComponent,
		SidebarComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	items: SideBarItem[] = itemList;
	constructor(private router: Router) {
		// this.router.navigateByUrl('/profile/p');
		// this.router.navigateByUrl('/feature');
	}
}
const itemList = [
	{ icon: 'home', text: 'Home', link: '/' },
	{
		icon: 'subscriptions',
		text: 'Subscriptions',
		link: '/subscriptions',
	},
	{ icon: 'history', text: 'History', link: '/history' },
	{
		icon: 'save',
		text: 'Saved Videos',
		link: '/saved-videos',
	},
];
