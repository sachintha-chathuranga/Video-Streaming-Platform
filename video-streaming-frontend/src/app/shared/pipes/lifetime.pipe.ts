import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'lifetime',
	standalone: true,
})
export class LifetimePipe implements PipeTransform {
	transform(value: Date | string | number): string {
		const createdDate = new Date(value);
		const now = new Date();
		const duration = now.getTime() - createdDate.getTime();

		const seconds = Math.floor(duration / 1000);
		if (seconds < 60) {
			return `${seconds} second(s) ago`;
		}

		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) {
			return `${minutes} minute(s) ago`;
		}

		const hours = Math.floor(minutes / 60);
		if (hours < 24) {
			return `${hours} hour(s) ago`;
		}

		const days = Math.floor(hours / 24);
		if (days < 30) {
			return `${days} day(s) ago`;
		}

		const months = Math.floor(days / 30);
		if (months < 12) {
			return `${months} month(s) ago`;
		}

		const years = Math.floor(months / 12);
		return `${years} year(s) ago`;
	}
}
