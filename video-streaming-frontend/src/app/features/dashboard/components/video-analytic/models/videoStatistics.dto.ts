export interface VideoStaticData {
	id: number;
	title: string;
	thumbnailUrl?: string;
	likesCount?: number;
	dislikesCount?: number;
	viewsCount?: number;
	commentsCount?: number;
	createdTime: Date;
}