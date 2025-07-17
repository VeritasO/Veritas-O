import { getTextEmbedding, cosineSimilarity } from './lyraNLP'; // Replace with your actual embedding module

export async function computeDriftScore(book: { title: string; version: string; summary: string }): Promise<number> {
  const titleEmbed = await getTextEmbedding(book.title);
  const versionEmbed = await getTextEmbedding(book.version);
  const summaryEmbed = await getTextEmbedding(book.summary);

  const simTitleSummary = cosineSimilarity(titleEmbed, summaryEmbed);
  const simTitleVersion = cosineSimilarity(titleEmbed, versionEmbed);
  const simSummaryVersion = cosineSimilarity(summaryEmbed, versionEmbed);

  const avgSim = (simTitleSummary + simTitleVersion + simSummaryVersion) / 3;
  return 1 - avgSim; // Drift score: higher means more drift
}