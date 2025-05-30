// WhatsApp API共通响应类型

// 会话相关响应
export interface SessionDTO {
	id: string;
	name: string;
	status: SessionStatus;
	config?: Record<string, unknown>;
	qrCode?: string;
	error?: string;
	updatedAt?: string;
	createdAt?: string;
	apiKey?: string;
}

export interface SessionInfo {
	id: string;
	name: string;
	me?: MyProfile;
	assignedWorker?: string;
	status: SessionStatus;
	config: Record<string, unknown>;
	qrCode?: string;
	error?: string;
	updatedAt?: string;
	createdAt: string;
}

export type SessionStatus =
	| "STARTING"
	| "RUNNING"
	| "STOPPED"
	| "ERROR"
	| "SCAN_QR_CODE"
	| "WORKING";

// 通用响应结构
interface Result {
	success: boolean;
	message?: string;
}

// 用户信息相关响应
export interface MyProfile {
	id: string;
	name?: string;
	pushName?: string;
	phoneNumber?: string;
	status?: string;
	pictureUrl?: string;
}

// QR码相关
export interface QRCodeResponse {
	data?: string;
	mimetype?: string;
	code?: string;
}

// 消息响应
export interface WAMessage {
	id: string;
	timestamp: number;
	fromMe: boolean;
	author?: string;
	chatId?: string;
	type?: string;
	body: string;
	from?: string;
	to?: string;
	source?: string;
	hasMedia?: boolean;
	media?: {
		mimetype: string;
		data?: string;
		filename?: string;
	} | null;
	caption?: string;
	quotedMsg?: WAMessage;
	mentionedIds?: string[];
	ack?: number;
	ackName?: string;
	vCards?: string[];
	_data?: Record<string, unknown>;
	location?: {
		latitude: number;
		longitude: number;
		name?: string;
		address?: string;
	};
	buttons?: {
		id: string;
		text: string;
	}[];
	list?: {
		title: string;
		description: string;
		buttonText: string;
		sections: {
			title: string;
			rows: {
				id: string;
				title: string;
				description?: string;
			}[];
		}[];
	};
	poll?: {
		name: string;
		options: string[];
	};
	vcard?: {
		name: string;
		number: string;
	};
}

// 聊天记录相关响应
interface Chat {
	id: string;
	name: string;
	timestamp: number;
	unreadCount: number;
	isGroup: boolean;
	isArchived: boolean;
	isMuted: boolean;
	muteExpiration?: number;
	pinned: boolean;
	lastMessage?: WAMessage;
	participants?: ChatParticipant[];
}

interface ChatParticipant {
	id: string;
	name?: string;
	isAdmin?: boolean;
	isSuperAdmin?: boolean;
}

// 联系人相关响应
interface Contact {
	id: string;
	name?: string;
	pushname?: string;
	shortName?: string;
	isMe?: boolean;
	isMyContact?: boolean;
	isWAContact?: boolean;
	isGroup?: boolean;
	isBlocked?: boolean;
}

// 群组相关响应
interface Group {
	id: string;
	name: string;
	description?: string;
	participants: GroupParticipant[];
	owner?: string;
	isAnnouncement?: boolean;
	isSupport?: boolean;
	isAdmin?: boolean;
}

interface GroupParticipant {
	id: string;
	isAdmin?: boolean;
	isSuperAdmin?: boolean;
}

// Webhook响应
export interface WebhookNotification {
	id: string;
	event: string;
	session: string;
	timestamp: number;
	metadata?: Record<string, string>;
	me?: {
		id: string;
		pushName: string;
	};
	payload: WAMessage | { status: SessionStatus } | Record<string, unknown>;
	engine?: string;
	environment?: {
		version: string;
		engine: string;
		tier: string;
		browser: string;
	};
}

type WebhookData =
	| { status: SessionStatus }
	| WAMessage
	| Chat
	| Contact
	| Group
	| {
			chatId: string;
			messageId: string;
			reactions: { emoji: string; userId: string }[];
	  };
