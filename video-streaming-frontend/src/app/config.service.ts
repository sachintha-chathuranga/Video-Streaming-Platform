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
	readonly SUPPORTED_IMAGE_FORMATS = [
		'jpeg',
		'jpg',
		'png',
	];
	public convertToExtentions(array:string[]){
		return array.map( ext =>{
			return '.'+ext;
		}).toString();
	}
	public isArraysEqual(arr1:string[], arr2:string[]) {
    // Check if lengths are the same
    if (arr1.length !== arr2.length) {
        return false;
    }
    
    // Check if every element is equal
    return arr1.every((value, index) => value === arr2[index]);
}
}
