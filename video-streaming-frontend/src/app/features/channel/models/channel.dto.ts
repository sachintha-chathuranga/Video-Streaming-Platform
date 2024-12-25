export interface Channel {
	id: number;
	name: string;
	description: string;
	email: string;
	bannerImage: string;
	channelImage: string;
	subscribersCount?: number;
	isUserSubscribe?: boolean;
	videoCount: number;
}
