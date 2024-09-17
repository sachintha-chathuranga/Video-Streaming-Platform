import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { link } from 'fs';
import { SideBarItem } from '../../interfaces/sidebarItem.dto';
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
export class SidebarComponent implements OnDestroy, OnInit, OnChanges {
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
    this.activeButton = this.sidebarMode ? this.router.url : "";
  }
  
  navigate(link: string) {
    this.activeButton = link;
    this.router.navigate([link]);
  }
  
  ngOnChanges() {
    
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
