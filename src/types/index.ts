// 导出所有类型

// 现有类型定义文件导出
export * from "./instances";
export * from "./agents";

// 新增共享类型导出
export * from "./api-requests";
export * from "./api-responses";

// 额外导出的类型别名和工具类型

// 会话状态的应用内统一类型别名
type WahaSessionStatus =
	| "STARTING"
	| "RUNNING"
	| "STOPPED"
	| "ERROR"
	| "SCAN_QR_CODE"
	| "WORKING";

// 实例状态的应用内统一类型别名
export type InstanceStatus = "connected" | "disconnected" | "connecting";

// Webhook事件类型
type WebhookEventType =
	| "message"
	| "message.ack"
	| "message.reaction"
	| "message.revoke"
	| "chat.new"
	| "chat.update"
	| "presence.update"
	| "group.join"
	| "group.leave"
	| "group.update"
	| "contact.update"
	| "session.status";
