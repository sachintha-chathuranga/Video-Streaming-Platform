import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [VideoCardComponent, FlexLayoutModule, CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {

}
