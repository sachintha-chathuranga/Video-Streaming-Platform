
export interface UserDto {
	id: number;
	firstName: string;
	lastName: string;
	email?: string;
	pictureUrl?: string;
	about?: string;
	subscribersCount?: number;
	sub?: string;
	isRecordHistory: boolean;
}

