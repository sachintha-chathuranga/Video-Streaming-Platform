import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  NgModule,
  ViewChild,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoUploadComponent } from '../video-upload/video-upload.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  @ViewChild('searchBox', { static: false })
  searchBox!: ElementRef;
  @ViewChild('inputField', { static: false })
  inputField!: ElementRef;

  @Input()
  isMobile!: boolean;

  @Input()
  snav!: any;
  value = '';

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
  openSearchBox() {
    if (this.searchBox.nativeElement.classList.contains('hide')) {
      this.searchBox.nativeElement.classList.remove('hide');
      this.inputField.nativeElement.focus();
    } else {
      this.searchBox.nativeElement.classList.add('hide');
    }
  }
  login() {
    this.oidcSecurityService.authorize();
  }
  logout() {
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