import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/components/base/base.component';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { UserDto } from '../../shared/models/user.dto';
import { LifetimePipe } from '../../shared/pipes/lifetime.pipe';
import { NotificationService } from '../../shared/services/notification.service';
import { UserService } from '../../shared/services/user.service';
import { Notification } from './models/notification.dto';

@Component({
	selector: 'app-notification',
	standalone: true,
	imports: [
		CommonModule,
		MatIcon,
		MatButtonModule,
		MatProgressSpinner,
		MatMenuModule,
		MatCardModule,
		LifetimePipe,
	],
	templateUrl: './notification.component.html',
	styleUrl: './notification.component.css',
})
export class NotificationComponent extends BaseComponent {
	@Input()
	logginUser: UserDto | null = null;
	@Output()
	onMarkAsRead: EventEmitter<string> = new EventEmitter();
	notifications: Notification[] = [];
	isLoading = false;
	page: number = 0;
	size: number = 10;
	isLastPageFetched: boolean = false;
	isDataFetching: boolean = false;

	constructor(
		private router: Router,
		private notificationService: NotificationService,
		private userService: UserService
	) {
		super();
	}
	ngOnInit() {
		this.fetchNotifications(false);
	}
	deleteNotification(notificationId: number) {
		this.notificationService.deleteNotification(notificationId);
		this.notifications = this.notifications.filter(
			(notification) => {
				if (notification.id==notificationId && !notification.isRead) {
					this.onMarkAsRead.emit('one');
				}
				return notification.id != notificationId
			}
		);
	}

	deleteAllNotification() {
			this.onMarkAsRead.emit('all');
		if (this.logginUser) {
			this.notificationService.deleteAllNotification(this.logginUser.id);
		}
		this.notifications = [];
	}
	openVideo(videoId: number, notificationId: number) {
		this.markAsRead(notificationId);
		this.userService
			.updateVideoHistory(videoId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: boolean) => {
					console.log(response);
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse);
				},
			});
		this.router.navigate(['/watch'], { queryParams: { v: videoId } });
	}
	fetchNotifications(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isDataFetching) return;
		console.log('fetch notifications');
		this.isDataFetching = isScrolling;
		this.notificationService
			.getNotifications(this.page, this.size)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: PaginatedResponse<Notification>) => {
					this.page++;
					this.notifications = [...this.notifications, ...response.content];
					this.isLastPageFetched = response.last;
					this.isDataFetching = false;
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse.error);
				},
			});
	}
	markAsRead(notificationId: number) {
		this.notifications.forEach((notification: Notification) => {
			if (notificationId == notification.id && !notification.isRead) {
				notification.isRead = true;
				this.onMarkAsRead.emit('one');
				this.notificationService.markAsRead(notificationId);
			}
		});
	}
	markAllAsRead() {
		this.onMarkAsRead.emit('all');
		this.notifications.forEach((notification: Notification) => {
			if (!notification.isRead) {
				notification.isRead = true;
			}
		});
		if (this.logginUser) {
			this.notificationService.markAllAsRead(this.logginUser.id);
		}
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.fetchNotifications(true);
		}
	}
	onMenuItemClick(event: MouseEvent) {
		event.stopPropagation(); // Prevent menu closing
		console.log('Menu item clicked');
	}
}
