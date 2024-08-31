import { ChangeDetectorRef, Component, inject, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { link } from 'fs';
import { SideBarItem } from '../../dto/sidebarItem.dto';
import { MatButtonModule } from '@angular/material/button';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToolbarComponent } from '../toolbar/toolbar.component';

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
    ToolbarComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnDestroy {
  @Input()
  items!: SideBarItem[];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  activeButtonIndex: number = 0;

  constructor(private router: Router) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  navigate(link: string, index: number) {
    this.activeButtonIndex = index;
    this.router.navigate([link]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
