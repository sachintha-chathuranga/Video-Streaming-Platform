import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { link } from 'fs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatListItem,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  items: Item[] = itemList;

  selectItem(item: Item) {
    this.items.map((i) => {
      if (i.icon == item.icon) {
        i.active = true
        console.log("select item: "+i.text)
      } else {
        i.active = false;
      }
      return i;
    });
  }
}

const itemList = [
  { icon: 'home', text: 'Home', link: '/feature', active: true },
  {
    icon: 'subscriptions',
    text: 'Subscriptions',
    link: '/subscriptions',
    active: false,
  },
  { icon: 'history', text: 'History', link: '/history', active: false },
  {
    icon: 'thumb_up',
    text: 'Liked Videos',
    link: '/liked-videos',
    active: false,
  },
];

type Item = {
  icon: string;
  text: string;
  link: string;
  active: boolean;
};
