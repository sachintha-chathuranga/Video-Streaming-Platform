export interface VideoUpdateDto {
	id: number;
	title?: string;
	description?: string;
	videoStatus?: string;
	tags?: string[];
	thumbnailUrl?: string;
}
