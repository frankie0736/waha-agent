import type { InstanceStatus } from "./index";

interface Instance {
	id: string;
	name: string;
	phoneNumber?: string;
	agent?: {
		id: string;
		name: string;
	};
	status: InstanceStatus;
	qrCode?: string;
	sessionData?: Record<string, unknown>;
}

export interface InstanceCreateInput {
	name: string;
	phoneNumber?: string;
	agentId?: string;
	userWebhooks?: string[];
}

export interface InstanceUpdateInput {
	id: string;
	name?: string;
	phoneNumber?: string;
	agentId?: string;
	status?: InstanceStatus;
	qrCode?: string;
	sessionData?: Record<string, unknown>;
	userWebhooks?: string[];
}
