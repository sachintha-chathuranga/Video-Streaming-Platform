import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from '../feature/feature.component';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';


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
  isSidebarOpen = true; // Initially open sidebar
  isMenuOpen = false; // Initially closed menu
  
  constructor(private router: Router) {
    this.router.navigateByUrl('/feature');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isMenuOpen = !this.isMenuOpen;
  }
}
