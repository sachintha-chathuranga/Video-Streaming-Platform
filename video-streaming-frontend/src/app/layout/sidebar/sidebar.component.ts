import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../header/navbar.component';
import { SideBarItem } from './models/sidebarItem.dto';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatToolbarModule,
		MatIconModule,
		RouterModule,
		MatButtonModule,
		NavbarComponent,
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnDestroy, OnInit {
	@Input()
	items!: SideBarItem[];
	@Input()
	sidebarMode!: boolean;
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;
	activeButton!: string;
	activatedPath!: string;

	constructor(private router: Router, private activeRoute: ActivatedRoute) {
		const changeDetectorRef = inject(ChangeDetectorRef);
		const media = inject(MediaMatcher);
		this.mobileQuery = media.matchMedia('(max-width: 900px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addEventListener('change', this._mobileQueryListener);
	}
	ngOnInit(): void {
		this.activeButton = this.sidebarMode ? this.router.url : '';
	}

	navigate(link: string) {
		this.activeButton = link;
		this.router.navigate([link]);
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
	}
}
