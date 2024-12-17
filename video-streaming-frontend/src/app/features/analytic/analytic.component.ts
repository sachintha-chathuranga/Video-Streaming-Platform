import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { SplineChartComponent } from './components/spline-chart/spline-chart.component';

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
		LineChartComponent,
	],
	templateUrl: './analytic.component.html',
	styleUrl: './analytic.component.css',
})
export class AnalyticComponent {
	startDate!: string;
	currentDate!: number;
	selectedDateRange = '7';

	constructor() {
		this.changeStartDate();
		this.currentDate = Date.now();
	}

	handleSelection(days: string) {
		this.changeStartDate();
	}
	changeStartDate() {
		let startDay = new Date();
		let now = new Date();
		startDay.setDate(now.getDate() - parseInt(this.selectedDateRange));
		this.startDate = startDay.toDateString();
	}
}
