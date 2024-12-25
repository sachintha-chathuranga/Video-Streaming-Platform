import { Component, Input } from '@angular/core';
import { DotAnimationComponent } from '../../../../shared/animations/dot-animation/dot-animation.component';
import { SplineChartComponent } from '../spline-chart/spline-chart.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-realtime-statistics',
  standalone: true,
  imports: [MatButtonModule, DotAnimationComponent, SplineChartComponent],
  templateUrl: './realtime-statistics.component.html',
  styleUrl: './realtime-statistics.component.css'
})
export class RealtimeStatisticsComponent {
  @Input()
  totalSubscribers!: number;
  @Input()
  totalViews!: number;

  
}
