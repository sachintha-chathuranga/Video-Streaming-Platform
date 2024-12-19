import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { ChannelService } from '../../../../shared/services/channel.service';
import { AnalyticDto } from '../../models/analytic.dto';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'app-line-chart',
	standalone: true,
	imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule],
	templateUrl: './line-chart.component.html',
	styleUrl: './line-chart.component.css',
})
export class LineChartComponent extends BaseComponent {
	@Input()
	startDate!: string;
	@Input()
	endDate!: string;
	@Output()
	onTotalViewChange: EventEmitter<number> = new EventEmitter<number>();

	dataPoints: any[] = [];
	chart: any;
	chartOptions: any = {
		animationEnabled: true,
		zoomEnabled: true,
		theme: 'light2',
		axisX: {
			valueFormatString: 'D MMM, YYYY',
		},
		toolTip: {
			shared: true,
		},
		legend: {
			cursor: 'pointer',
			itemclick: function (e: any) {
				if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else {
					e.dataSeries.visible = true;
				}
				e.chart.render();
			},
		},
		data: [
			{
				type: 'line',
				xValueFormatString: 'MMM DD, YYYY',
				dataPoints: this.dataPoints,
			},
		],
	};
	constructor(private channelService: ChannelService) {
		super();
	}
	ngOnInit() {}
	getChartInstance(chart: object) {
		this.chart = chart;
		this.updateData(this.startDate, this.endDate);
	}
	updateData = (startDate: string, endDate: string) => {
		console.log('startTime: ' + startDate);
		console.log('endTime: ' + endDate);
		this.channelService.getChannelViewsAnalytics(startDate, endDate).pipe(takeUntil(this.destroy$)).subscribe({
			next: (data: AnalyticDto[]) => {
				console.log(data);
				let totalViews = 0;
				data.forEach((analytic: AnalyticDto) => {
					totalViews += analytic.count;
					this.dataPoints.push({ x: new Date(analytic.date), y: analytic.count });
				});
				this.onTotalViewChange.emit(totalViews);
				this.chart.render();
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse.error);
			},
		});
	};
}
