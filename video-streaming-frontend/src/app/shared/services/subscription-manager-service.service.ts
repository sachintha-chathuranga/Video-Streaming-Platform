import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SubscriptionManagerService implements OnDestroy {
	private subscriptions = new Subscription();

	add(subscription: Subscription): void {
		this.subscriptions.add(subscription);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}