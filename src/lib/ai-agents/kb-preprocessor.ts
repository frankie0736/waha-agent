import { type OpenAIProvider, createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const CHUNK_SIZE = 20000;

/**
 * Builds the prompt for the LLM with instructions and content
 */
function buildPrompt(content: string): string {
	return `
# 角色：知识库内容工程师

# 最终目标：
将输入的原始 Markdown 网页内容，转化为高度浓缩、事实密集、结构化、且针对向量化和知识库检索优化的信息单元（Markdown 格式）。

# 核心原则：
信息保真前提下的最大化精炼与结构化。为知识检索服务，去除一切非核心事实信息。

# 工作流程与规则：

## 第一阶段：基础格式清理与元素移除
1.  **移除渲染与导航元素：** 彻底删除所有图片标记 (\`![]()\`)、视频嵌入、脚注引用 (\`[^...]\`)、HTML 标签 (\`<...>\`)。
2.  **移除链接与引用：** **删除所有超链接 (\`[]()\`)**，除非链接 URL 本身是作为关键技术标识符或数据点被明确讨论。**删除所有文献引用、来源标注、推荐阅读列表。**
3.  **保留基础结构标记：** 仅保留必要的 Markdown 结构标记，如标题 (\`#\`) 用于表示主题层次，代码块 (\`\`\`) 用于代码，列表 (\`-\`, \`*\`, \`1.\`) 用于枚举，表格用于结构化数据。

## 第二阶段：内容深度精炼与去噪
1.  **过滤非知识性内容：** 识别并**彻底删除**：
    *   营销推广语、广告宣传。
    *   重复或高度冗余的信息。
    *   **常规网页填充内容：** 如问候语、通用引言/结语、文档结构说明（"本章将介绍..."）、导航性提示、无具体信息的过渡句、普遍常识性描述等。
    *   与核心主题关联度低的旁支信息或推荐。
2.  **语言极致精简：**
    *   大幅削减冗余修饰词、副词、连接词，使用最直接、最客观的陈述。
    *   **保留关键限定词：** 必须保留对技术概念、事实定义至关重要的词语（例如："**加密**"于"加密协议"，"**实时**"于"实时数据"）。
3.  **聚焦核心事实：** 严格保留并突出技术参数、性能数据、统计指标、操作步骤、定义、原理、关键结论。

## 第三阶段：知识结构化重组
1.  **信息原子化与聚合：**
    *   将长段落或复杂叙述**拆解**为独立的、具有明确主题的**事实陈述或知识点**。
    *   将逻辑上紧密关联的**核心事实**重新组织、聚合在一起，即使它们在原文中分散。
2.  **优先列表化呈现：**
    *   **大量使用项目符号 (\`-\`) 或数字列表 (\`1.\`)** 来组织信息，尤其适用于步骤、要素、属性、优缺点、关键发现等。每个列表项应尽可能简洁且包含一个独立信息点。
3.  **保留术语与定义：** 保留专业术语。若原文提供了缩写与全称的对应（如 "AI (Artificial Intelligence)"），保留此首次出现的定义。不自行添加解释。

# 输出要求：
1.  **格式：** 输出有效的、基础的 Markdown 语法。
2.  **结构：** 以逻辑块（可通过标题或列表组织）为单位，内容高度浓缩。**优先使用列表形式。**
3.  **风格：** 极其简洁、客观、信息密度高的书面语。**严格禁用** Markdown 强调语法 (\`*\`, \`_\`, \`**\`, \`__\`)，除非是代码或专有名词固有部分。
4.  **改动原则：** **以服务知识库检索为目的进行彻底的重组、精炼和改写，但必须严格忠于原文的核心事实、数据和技术逻辑。**
5.  **输出纯净性：** **重要！最终输出的内容就是处理后的 Markdown 文本本身，绝对不要将整个输出包裹在任何代码块标记中（例如 \`\`\`markdown ... \`\`\` 或 \`\`\` ... \`\`\`）。直接输出文本内容。**

# 特别注意（高优先级）：
*   **技术细节与步骤：** 必须完整、准确地保留。
*   **数据与参数：** 必须完整、准确地保留。
*   **数据可视化描述：** 如原文对图表有关键性描述（"图表显示XX呈上升趋势"），保留该描述性结论。
*   **关键实体信息：** 时间、地点、人物、组织等若为事实的关键部分，需保留。
*   **彻底移除来源/链接：** 再次强调，除作为技术标识符外，所有外部链接和引用信息均需删除。

# 请处理以下网页内容：
${content}
`;
}

/**
 * Processes a chunk of content through the LLM
 */
async function processChunk(
	openai: OpenAIProvider,
	chunk: string,
): Promise<string> {
	const { text } = await generateText({
		model: openai("gemini-2.0-flash"),
		prompt: buildPrompt(chunk),
	});
	return text;
}

/**
 * Splits text into chunks while preserving markdown structure as much as possible
 */
function splitIntoChunks(text: string, chunkSize: number): string[] {
	const chunks: string[] = [];
	let currentChunk = "";

	// Split by paragraphs to avoid cutting in the middle of sentences
	const paragraphs = text.split(/\n\n+/);

	for (const paragraph of paragraphs) {
		// If adding this paragraph exceeds the chunk size and we already have content
		if (
			currentChunk.length + paragraph.length > chunkSize &&
			currentChunk.length > 0
		) {
			chunks.push(currentChunk);
			currentChunk = paragraph;
		} else {
			currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
		}
	}

	// Add the last chunk if it has content
	if (currentChunk) {
		chunks.push(currentChunk);
	}

	return chunks;
}

/**
 * Preprocesses knowledge base content by condensing and restructuring it
 * Handles large documents by splitting into chunks if needed
 */
export const kbPreprocessor = async (apiKey: string, content: string) => {
	const openai = createOpenAI({
		apiKey,
		baseURL: "https://aihubmix.com/v1",
	});

	// If content is under chunk size, process it directly
	if (content.length <= CHUNK_SIZE) {
		return processChunk(openai, content);
	}

	// For large content, split into chunks and process in parallel
	const chunks = splitIntoChunks(content, CHUNK_SIZE);

	// Process all chunks in parallel
	const processedChunks = await Promise.all(
		chunks.map((chunk) => processChunk(openai, chunk)),
	);

	// Combine all processed chunks
	return processedChunks.join("\n\n");
};
