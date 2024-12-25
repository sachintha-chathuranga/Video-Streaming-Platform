import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'remainingLifetime',
	standalone: true,
})
export class RemainingLifetimePipe implements PipeTransform {
	transform(value: Date | string | number): string {
		const createdDate = new Date(value);
		const now = new Date();
		const duration = now.getTime() - createdDate.getTime();

		const seconds = Math.floor(duration / 1000);
		if (seconds < 60) {
			return `First ${seconds} seconds`;
		}

		// Calculate the remainder for the hours after days
		const remainingSeconds = seconds % 60;
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) {
			return `First ${minutes} minutes ${remainingSeconds} seconds`;
		}

		// Calculate the remainder for the hours after days
		const remainingMinutes = minutes % 60;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) {
			return `First ${hours} hours ${remainingMinutes} minutes`;
		}

		// Calculate the remainder for the hours after days
		const remainingHours = hours % 24;
		const days = Math.floor(hours / 24);
		if (days < 30) {
			return `First ${days} days ${remainingHours} hours`;
		}
		// Calculate the remainder for the hours after days
		const remainingDays = days % 30;
		const months = Math.floor(days / 30);
		if (months < 12) {
			return `First ${months} months ${remainingDays} days`;
		}

		// Calculate the remainder for the hours after days
		const remainingMonths = months % 12;
		const years = Math.floor(months / 12);
		return `First ${years} years ${remainingMonths} months`;
	}
}
