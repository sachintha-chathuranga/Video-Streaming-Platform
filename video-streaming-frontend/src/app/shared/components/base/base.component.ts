import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-base',
	standalone: true,
	imports: [],
	template: ''
})
export abstract class BaseComponent implements OnDestroy {
	protected destroy$ = new Subject<void>();

	ngOnDestroy(): void {
		console.log("Destroy subscription")
		this.destroy$.next();
		this.destroy$.complete();
	}
}