export interface Channel {
	id: number;
	name: string;
	description: string;
	bannerImage: string;
	channelImage: string;
	subscribersCount?: number;
	isUserSubscribe?: boolean;
}
