import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-spline-chart',
	standalone: true,
	imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule],
	templateUrl: './spline-chart.component.html',
	styleUrl: './spline-chart.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplineChartComponent implements OnDestroy {
	constructor(private http: HttpClient) {}

	dataPoints: any[] = [];
	timeout: any = null;
	xValue: number = 1;
	yValue: number = 10;
	newDataCount: number = 5;
	chart: any;
	fetchDataSubscription!:Subscription;

	chartOptions = {
		theme: 'light2',
		data: [
			{
				type: 'spline',
				dataPoints: this.dataPoints,
			},
		],
	};

	getChartInstance(chart: object) {
		this.chart = chart;
		this.updateData();
	}

	ngOnDestroy() {
		clearTimeout(this.timeout);
		this.fetchDataSubscription.unsubscribe;
	}

	updateData = () => {
		 this.fetchDataSubscription = this.http
		  .get(
		    'https://canvasjs.com/services/data/datapoints.php?xstart=' +
		      this.xValue +
		      '&ystart=' +
		      this.yValue +
		      '&length=' +
		      this.newDataCount +
		      'type=json',
		    { responseType: 'json' }
		  )
		  .subscribe(this.addData);
	};

	addData = (data: any) => {
		console.log(data)
		if (this.newDataCount != 1) {
			data.forEach((val: any[]) => {
				this.dataPoints.push({ x: val[0], y: parseInt(val[1]) });
				this.xValue++;
				this.yValue = parseInt(val[1]);
			});
		} else {
			this.dataPoints.shift();
			this.dataPoints.push({ x: data[0][0], y: parseInt(data[0][1]) });
			this.xValue++;
			this.yValue = parseInt(data[0][1]);
		}
		this.newDataCount = 1;
		this.chart.render();
		this.timeout = setTimeout(this.updateData, 1000);
	};
}
