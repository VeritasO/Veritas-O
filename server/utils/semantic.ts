import use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-node';

export async function computeDriftScore(title: string, summary: string, version: string) {
  const model = await use.load();
  const embeddings = await model.embed([title, summary, version]);
  const simTitleSummary = tf.losses.cosineDistance(
    embeddings.slice([0, 0], [1, -1]),
    embeddings.slice([1, 0], [1, -1]),
    1
  ).dataSync()[0];
  return 1 - simTitleSummary; // similarity score
}