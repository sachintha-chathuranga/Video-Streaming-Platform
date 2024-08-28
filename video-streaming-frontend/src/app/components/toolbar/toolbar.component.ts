import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoUploadComponent } from '../video-upload/video-upload.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  @Input()
  isMobile!: boolean;

  @Input()
  snav!: any;
  
  isAuthenticated: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }
  login() {
    this.oidcSecurityService.authorize();
  }
  logout() {
    console.log('logout');
    this.isAuthenticated = false;
    this.oidcSecurityService.logoffAndRevokeTokens();
  }
  gotoVideoUpload() {
    this.router.navigateByUrl('/profile/content');
    this.openDialog();
  }
  openDialog() {
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: '80%',
      maxWidth: '900px',
      height: '590px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
