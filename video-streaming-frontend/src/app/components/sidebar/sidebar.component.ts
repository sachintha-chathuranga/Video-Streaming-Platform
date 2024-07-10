import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { link } from 'fs';
import { SideBarItem } from '../../dto/sidebarItem.dto';

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
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input()
  items!: SideBarItem[];
  isSidebarOpen = true; // Initially open sidebar
  isMenuOpen = false; // Initially closed menu
  
  selectItem(item: SideBarItem) {
    this.items.map((i) => {
      if (i.icon == item.icon) {
        i.active = true;
        console.log('select item: ' + i.text);
      } else {
        i.active = false;
      }
      return i;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isMenuOpen = !this.isMenuOpen;
  }
}
