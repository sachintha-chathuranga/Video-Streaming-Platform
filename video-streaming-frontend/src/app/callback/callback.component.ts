import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent {
  constructor(private userService: UserService) {
    this.userService.registerUser();
 }
}
