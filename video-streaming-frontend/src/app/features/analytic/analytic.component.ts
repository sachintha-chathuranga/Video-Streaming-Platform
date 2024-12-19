import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { SplineChartComponent } from './components/spline-chart/spline-chart.component';
import { DotAnimationComponent } from '../../shared/animations/dot-animation/dot-animation.component';
import { ChannelService } from '../../shared/services/channel.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChannelStatisticsDto } from './models/channelStatistics.dto';
import { RealtimeStatisticsComponent } from './components/realtime-statistics/realtime-statistics.component';
import { BaseComponent } from '../../shared/components/base/base.component';
import { takeUntil } from 'rxjs';


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
		LineChartComponent,
		RealtimeStatisticsComponent
	],
	templateUrl: './analytic.component.html',
	styleUrl: './analytic.component.css',
})
export class AnalyticComponent extends BaseComponent {
	startDate!: string;
	currentDate!: string;
	selectedDateRange = '7';
	totalViews!: number;
	statistics!: ChannelStatisticsDto
	@ViewChild(LineChartComponent) lineChart!: LineChartComponent;

	constructor(private channelService: ChannelService) {
		super()
		this.setDateRange();
		let now = new Date();
		this.currentDate = now.toISOString();
		this.fetchChannelStatistics();
	}

	handleSelection(days: string) {
		this.setDateRange();
		this.lineChart.updateData(this.startDate, this.currentDate);
	}
	setTotalViews(totViews: number){
		this.totalViews = totViews;
	};
	setDateRange() {
		let startDay = new Date();
		let now = new Date();
		startDay.setDate(now.getDate() - parseInt(this.selectedDateRange));
		this.startDate = startDay.toISOString();
	}
	fetchChannelStatistics() {
		this.channelService
			.getChannelStatistics()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: ChannelStatisticsDto) => {
					this.statistics = data;
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse.error);
				},
			});
	}
}
