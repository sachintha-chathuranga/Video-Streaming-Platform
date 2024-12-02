import { Component } from '@angular/core';
import { SidebarComponent } from '../../../../layout/sidebar/components/sidebar/sidebar.component';
import { SideBarItem } from '../../../../layout/sidebar/models/sidebarItem.dto';

@Component({
	selector: 'app-watch',
	standalone: true,
	imports: [SidebarComponent],
	templateUrl: './watch.component.html',
	styleUrl: './watch.component.css',
})
export class WatchComponent {
	items: SideBarItem[] = itemList;
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
		icon: 'thumb_up',
		text: 'Liked Videos',
		link: '/liked-videos',
	},
];
