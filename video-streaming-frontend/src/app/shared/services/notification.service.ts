import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../../features/notification/models/notification.dto';
import { PaginatedResponse } from '../models/pagination.dto';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private apiEndpoint: string = environment.apiEndpoint;

	constructor(private httpClient: HttpClient) {}
	markAsRead(notificationId: number) {
		this.httpClient
			.post(`${this.apiEndpoint}/notifications/read/${notificationId}`, null)
			.subscribe();
	}
	markAllAsRead(userId: number) {
		this.httpClient
			.post(`${this.apiEndpoint}/notifications/read-all/${userId}`, null)
			.subscribe();
	}
	getNotifications(page: number, size: number): Observable<PaginatedResponse<Notification>> {
		let params = new HttpParams().set('page', page).set('size', size);

		return this.httpClient
			.get<PaginatedResponse<Notification>>(`${this.apiEndpoint}/notifications`, { params })
			.pipe(catchError((error) => throwError(() => error)));
	}
	getNotificationCount(userId: number): Observable<number> {
	
		return this.httpClient
			.get<number>(`${this.apiEndpoint}/notifications/count/${userId}`)
			.pipe(catchError((error) => throwError(() => error)));
	}

	deleteNotification(notificationId: number) {
		this.httpClient.delete(`${this.apiEndpoint}/notifications/${notificationId}`).subscribe();
	}
	deleteAllNotification(userId: number) {
		this.httpClient.delete(`${this.apiEndpoint}/notifications/user/${userId}`).subscribe();
	}
}
