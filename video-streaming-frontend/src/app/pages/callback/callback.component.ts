import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css',
})
export class CallbackComponent {
  constructor(
  ) {
  
  }
  
}
