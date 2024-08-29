import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from '../feature/feature.component';
import {
  MatSidenavContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SideBarItem } from '../../dto/sidebarItem.dto';

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
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
    active: false,
  },
  { icon: 'history', text: 'History', link: '/history' },
  {
    icon: 'thumb_up',
    text: 'Liked Videos',
    link: '/liked-videos'
  },
];
