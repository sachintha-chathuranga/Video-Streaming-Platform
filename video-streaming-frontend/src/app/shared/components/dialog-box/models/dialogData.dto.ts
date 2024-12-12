import { Action } from "./action.dto";

export interface DialogData {
	title: string;
	description: string;
	actions: Action[];
}
