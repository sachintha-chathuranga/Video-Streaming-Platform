import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
	selector: 'app-line-chart',
	standalone: true,
	imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule],
	templateUrl: './line-chart.component.html',
	styleUrl: './line-chart.component.css',
})
export class LineChartComponent {
	chart: any;
	chartOptions = {
		animationEnabled: true,
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
				dataPoints: [
					{ x: new Date(2021, 8, 1), y: 63 },
					{ x: new Date(2021, 8, 2), y: 69 },
					{ x: new Date(2021, 8, 3), y: 65 },
					{ x: new Date(2021, 8, 4), y: 70 },
					{ x: new Date(2021, 8, 5), y: 71 },
					{ x: new Date(2021, 8, 6), y: 65 },
					{ x: new Date(2021, 8, 7), y: 73 },
				],
			},
		],
	};
}
