import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoUploadComponent } from '../video-upload/video-upload.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) { }

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
  };
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
