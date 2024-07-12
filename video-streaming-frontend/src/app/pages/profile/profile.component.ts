import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FeatureComponent } from '../feature/feature.component';
import { SideBarItem } from '../../dto/sidebarItem.dto';

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

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit() {
    const path = this.location.path();
    this.items.map(i => {
      if (i.link == path) {
        i.active = true;
     
      } else {
        i.active = false;
      }
    })
  }
}

const itemList = [
  {
    icon: 'home',
    text: 'Profile',
    link: '/profile/personal-info',
    active: true,
  },
  {
    icon: 'subscriptions',
    text: 'Dashboard',
    link: '/profile/dashboard',
    active: false,
  },
  { icon: 'history', text: 'Content', link: '/profile/content', active: false },
  {
    icon: 'thumb_up',
    text: 'Analytics',
    link: '/profile/analytics',
    active: false,
  },
];