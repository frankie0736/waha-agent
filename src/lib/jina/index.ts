import { processResult } from "./ai-processor";
import { JinaCrawlerService } from "./crawler";
import type { CrawlOptions, JinaCrawlResult } from "./types";

// Export types
export * from "./types";
// Export the crawler class

// Create singleton instance
export const jinaCrawler = new JinaCrawlerService();

// Export convenience functions
async function crawlWebpage(
	url: string,
	options?: CrawlOptions,
	userId?: string,
): Promise<JinaCrawlResult> {
	return jinaCrawler.crawlUrlImmediately(url, options, userId);
}

async function queueWebpage(
	url: string,
	options?: CrawlOptions,
	userId?: string,
): Promise<string> {
	return jinaCrawler.queueUrl(url, options, userId);
}

async function processResultWithAI(
	result: JinaCrawlResult,
): Promise<JinaCrawlResult> {
	return processResult(result);
}
