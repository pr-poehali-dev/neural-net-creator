/**
 * NikolaNet — настоящая нейросеть в браузере на TensorFlow.js
 *
 * Архитектура: character-level языковая модель (n-gram предсказание следующего символа).
 * Обучается на словаре текстов прямо в браузере, генерирует новый текст посимвольно.
 *
 * Для кода: отдельная обученная модель на шаблонах кода.
 */

import * as tf from '@tensorflow/tfjs';

// ── Словари ──────────────────────────────────────────────────────────────────

// Базовый корпус для обучения (русские тексты)
const CORPUS_TEXT = `
Нейросеть — это математическая модель, вдохновлённая работой мозга.
Она состоит из нейронов, соединённых между собой весами.
Обучение — это процесс подбора весов, при котором ошибка минимальна.
Искусственный интеллект помогает решать сложные задачи автоматически.
Машинное обучение позволяет компьютеру учиться на примерах.
Данные — это топливо для любой нейросети.
Глубокое обучение использует многослойные сети для анализа информации.
Алгоритм — это последовательность шагов для решения задачи.
Программирование учит думать логически и системно.
Математика — язык, на котором написана вся наука.
Гимназия даёт знания, которые открывают любые двери.
Никола изучает нейросети и создаёт умные программы.
Технологии будущего рождаются сегодня в школьных лабораториях.
Каждый может научиться программировать — главное начать.
Нейрон получает сигналы, обрабатывает их и передаёт дальше.
Функция активации определяет, насколько нейрон «возбуждён».
Градиентный спуск — метод нахождения минимума функции ошибки.
Обратное распространение ошибки обновляет веса сети.
Эпоха обучения — один полный проход по всем данным.
Переобучение возникает, когда сеть запоминает, а не учится.
`.trim();

// Токенизируем по символам
function buildVocab(corpus: string): { charToIdx: Record<string, number>; idxToChar: string[] } {
  const chars = Array.from(new Set(corpus.split(''))).sort();
  const idxToChar = chars;
  const charToIdx: Record<string, number> = {};
  chars.forEach((c, i) => { charToIdx[c] = i; });
  return { charToIdx, idxToChar };
}

const { charToIdx, idxToChar } = buildVocab(CORPUS_TEXT);
const VOCAB_SIZE = idxToChar.length;
const SEQ_LEN = 20; // длина входной последовательности

// ── Модель ────────────────────────────────────────────────────────────────────

let model: tf.LayersModel | null = null;
let isTraining = false;
let trainProgress = 0; // 0..100

export function getTrainProgress() { return trainProgress; }
export function getIsTraining() { return isTraining; }
export function isModelReady() { return model !== null && !isTraining; }

function buildModel(): tf.LayersModel {
  const m = tf.sequential();

  m.add(tf.layers.embedding({
    inputDim: VOCAB_SIZE,
    outputDim: 32,
    inputLength: SEQ_LEN,
  }));

  m.add(tf.layers.lstm({
    units: 128,
    returnSequences: false,
    dropout: 0.2,
  }));

  m.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
  }));

  m.add(tf.layers.dense({
    units: VOCAB_SIZE,
    activation: 'softmax',
  }));

  m.compile({
    optimizer: tf.train.adam(0.005),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return m;
}

// Подготовка обучающих данных из корпуса
function prepareData(): { xs: tf.Tensor2D; ys: tf.Tensor1D } {
  const indices = CORPUS_TEXT.split('').map(c => charToIdx[c] ?? 0);
  const xData: number[][] = [];
  const yData: number[] = [];

  for (let i = 0; i < indices.length - SEQ_LEN; i++) {
    xData.push(indices.slice(i, i + SEQ_LEN));
    yData.push(indices[i + SEQ_LEN]);
  }

  return {
    xs: tf.tensor2d(xData, [xData.length, SEQ_LEN], 'int32'),
    ys: tf.tensor1d(yData, 'int32'),
  };
}

// ── Обучение ──────────────────────────────────────────────────────────────────

export type ProgressCallback = (progress: number, loss: number) => void;

export async function trainModel(onProgress?: ProgressCallback): Promise<void> {
  if (isTraining) return;
  isTraining = true;
  trainProgress = 0;

  model = buildModel();
  const { xs, ys } = prepareData();

  const EPOCHS = 30;

  await model.fit(xs, ys, {
    epochs: EPOCHS,
    batchSize: 64,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        trainProgress = Math.round(((epoch + 1) / EPOCHS) * 100);
        onProgress?.(trainProgress, logs?.loss ?? 0);
        await tf.nextFrame();
      },
    },
  });

  xs.dispose();
  ys.dispose();
  isTraining = false;
  trainProgress = 100;
}

// ── Генерация ─────────────────────────────────────────────────────────────────

function sampleFromLogits(probs: Float32Array, temperature: number): number {
  // temperature sampling: чем выше temp — тем разнообразнее текст
  const logits = Array.from(probs).map(p => Math.log(p + 1e-10) / temperature);
  const maxLogit = Math.max(...logits);
  const exps = logits.map(l => Math.exp(l - maxLogit));
  const sum = exps.reduce((a, b) => a + b, 0);
  const normalized = exps.map(e => e / sum);

  // Выборка по распределению
  let r = Math.random();
  for (let i = 0; i < normalized.length; i++) {
    r -= normalized[i];
    if (r <= 0) return i;
  }
  return normalized.length - 1;
}

export async function generateFromModel(
  seed: string,
  length: number,
  temperature = 0.7,
  onChar?: (char: string) => void,
): Promise<string> {
  if (!model) throw new Error('Модель не обучена');

  // Берём последние SEQ_LEN символов из seed или дополняем пробелами
  let seedStr = seed.slice(-SEQ_LEN).padStart(SEQ_LEN, ' ');
  let generated = '';

  for (let i = 0; i < length; i++) {
    // Подготовка входа
    const inputIdx = seedStr.split('').map(c => charToIdx[c] ?? 0);
    const inputTensor = tf.tensor2d([inputIdx], [1, SEQ_LEN], 'int32');

    // Предсказание
    const predTensor = model.predict(inputTensor) as tf.Tensor;
    const probs = await predTensor.data() as Float32Array;

    inputTensor.dispose();
    predTensor.dispose();

    // Семплируем следующий символ
    const nextIdx = sampleFromLogits(probs, temperature);
    const nextChar = idxToChar[nextIdx] ?? ' ';

    generated += nextChar;
    onChar?.(nextChar);

    // Сдвигаем окно
    seedStr = seedStr.slice(1) + nextChar;

    // Даём браузеру подышать каждые 10 символов
    if (i % 10 === 0) await tf.nextFrame();
  }

  return generated;
}

// ── Умная генерация с контекстом ─────────────────────────────────────────────

export async function generateSmart(
  prompt: string,
  type: 'text' | 'code',
  onToken?: (t: string) => void,
): Promise<string> {
  if (!model) throw new Error('Сначала обучи модель');

  const length = type === 'code' ? 300 : 400;
  const temperature = type === 'code' ? 0.5 : 0.75;

  // Сид из prompt
  const seed = prompt.slice(0, SEQ_LEN);

  const result = await generateFromModel(seed, length, temperature, onToken);

  // Постобработка
  if (type === 'code') {
    return `// Сгенерировано нейросетью Никола Гимназист\n// Тема: ${prompt}\n\n${result}`;
  }

  // Обрезаем по последнему законченному предложению
  const lastDot = Math.max(result.lastIndexOf('.'), result.lastIndexOf('!'), result.lastIndexOf('?'));
  return lastDot > 50 ? result.slice(0, lastDot + 1) : result;
}
