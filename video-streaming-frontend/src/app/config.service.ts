import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	readonly API_BASE_URL = environment.apiEndpoint;
	readonly SUPPORTED_VIDEO_FORMATS = [
		'mp4',
		'webm',
		'avi',
		'mov',
		'mkv',
		'flv',
		'3gp',
		'mpeg4',
		'wmv',
	];
}
