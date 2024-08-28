import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SplineChartComponent } from '../../components/spline-chart/spline-chart.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

@Component({
  selector: 'app-analytic',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    FlexLayoutModule,
    MatButtonModule,
    SplineChartComponent,
    LineChartComponent
  ],
  templateUrl: './analytic.component.html',
  styleUrl: './analytic.component.css',
})
export class AnalyticComponent {
  selected = '2';
 
}
