import * as tf from '@tensorflow/tfjs';
import { useEffect, useState, useCallback } from 'react';

interface CategoryMapEntry {
  index: number;
  id: string;
  descript: string;
}

interface VocabMap {
  [key: string]: number;
}

export function useCategoryPredictor() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const [categories, setCategories] = useState<CategoryMapEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive origin from base API URL
  const backendUrl = process.env.NEXT_PUBLIC_REACT_APP_API_FINANCE_URL
    ? new URL(process.env.NEXT_PUBLIC_REACT_APP_API_FINANCE_URL).origin
    : 'http://localhost:5171';

  useEffect(() => {
    async function loadModelAndMetadata() {
      try {
        // Load the model, vocabulary, and category labels from the backend models route
        const [loadedModel, vocabRes, categoriesRes] = await Promise.all([
          tf.loadLayersModel(`${backendUrl}/models/nlp/model.json`),
          fetch(`${backendUrl}/models/nlp/vocab.json`).then(r => r.json()),
          fetch(`${backendUrl}/models/nlp/categories.json`).then(r => r.json())
        ]);

        setModel(loadedModel);
        setVocab(vocabRes);
        setCategories(categoriesRes);
      } catch (err) {
        console.error("Failed to load TensorFlow.js model from backend:", err);
      } finally {
        setLoading(false);
      }
    }

    loadModelAndMetadata();
  }, [backendUrl]);

  const predictCategory = useCallback((description: string): { categoryId: string; confidence: number } | null => {
    if (!model || !vocab || !categories || !description) return null;

    // 1. Tokenize text
    const cleanText = description
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u00FF-]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);

    // 2. Map tokens to vocab indices
    const maxLen = 10;
    const sequence = cleanText.map(token => vocab[token] || vocab['<OOV>'] || 1);

    // 3. Pad/truncate
    const padded = new Array(maxLen).fill(0);
    for (let i = 0; i < Math.min(maxLen, sequence.length); i++) {
      padded[i] = sequence[i];
    }

    // 4. Run prediction
    try {
      const inputTensor = tf.tensor2d([padded], [1, maxLen]);
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const scores = prediction.dataSync();

      // Clean up tensors to prevent GPU/CPU memory leak
      inputTensor.dispose();
      prediction.dispose();

      // Find index with highest confidence
      let maxIdx = -1;
      let maxScore = -1;
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > maxScore) {
          maxScore = scores[i];
          maxIdx = i;
        }
      }

      if (maxIdx !== -1) {
        const matchingCategory = categories.find(c => c.index === maxIdx);
        if (matchingCategory) {
          return {
            categoryId: matchingCategory.id,
            confidence: maxScore
          };
        }
      }
    } catch (err) {
      console.error("Prediction error:", err);
    }

    return null;
  }, [model, vocab, categories]);

  return { predictCategory, loading };
}
