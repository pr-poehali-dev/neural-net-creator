// Локальный движок генерации — работает без API и ключей

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

// ─── ТЕКСТ ────────────────────────────────────────────────────────────────────

const textIntros: Record<string, string[]> = {
  'Статья': [
    'В современном мире {topic} занимает всё более важное место.',
    'Тема {topic} волнует специалистов уже несколько лет.',
    'Разберём подробно, что такое {topic} и почему это важно.',
    '{Topic} — одна из ключевых тем нашего времени.',
  ],
  'Пост для соцсетей': [
    '🔥 Поговорим о {topic}!\n\nЕсли ты ещё не в теме — самое время.',
    '💡 {Topic} — это то, о чём все говорят, но мало кто понимает.',
    '⚡ Хочешь разобраться в {topic}? Держи краткий гайд!',
    '🚀 {Topic} меняет правила игры. Вот почему:',
  ],
  'Email': [
    'Уважаемый коллега,\n\nПишу вам по вопросу {topic}.',
    'Добрый день!\n\nХочу обсудить с вами тему {topic}.',
    'Здравствуйте!\n\nНаша компания занимается {topic} и хотела бы предложить сотрудничество.',
  ],
  'Сценарий': [
    'СЦЕНА 1. INT. ОФИС — ДЕНЬ\n\nПерсонаж А изучает материалы по теме "{topic}".',
    'ФЕЙД ИН:\n\nСЦЕНА 1. INT. ПЕРЕГОВОРНАЯ — УТРО\n\nОбсуждение проекта по {topic}.',
  ],
  'Описание товара': [
    'Представляем уникальный продукт в категории {topic}.',
    '{Topic} — решение, которого вы давно ждали.',
    'Наш продукт для {topic} создан с заботой о каждом клиенте.',
  ],
  'Идеи и брейншторм': [
    'Идеи по теме «{topic}»:\n',
    'Брейншторм: {topic}\n\n',
  ],
};

const articleSections = [
  ['Что это такое', 'Почему это важно', 'Основные принципы', 'Практическое применение', 'Выводы'],
  ['История вопроса', 'Текущее состояние', 'Ключевые тренды', 'Как использовать', 'Заключение'],
  ['Введение', 'Преимущества', 'Недостатки и риски', 'Лучшие практики', 'Итог'],
];

const brainstormTemplates = [
  '1. {adj} платформа для автоматизации {topic}\n2. Мобильное приложение с {topic}\n3. Образовательный курс по {topic}\n4. Сообщество экспертов в {topic}\n5. SaaS-сервис на основе {topic}\n6. Консалтинг по внедрению {topic}\n7. Открытая библиотека ресурсов по {topic}',
  '1. Аналитика данных в {topic}\n2. ИИ-ассистент для {topic}\n3. Маркетплейс специалистов по {topic}\n4. Интеграция {topic} в существующий бизнес\n5. Геймификация обучения {topic}\n6. Подкаст о {topic}\n7. Чат-бот для {topic}',
];

const adjectives = ['умная', 'быстрая', 'современная', 'инновационная', 'масштабируемая', 'гибкая'];
const benefits = ['экономит время', 'увеличивает эффективность', 'снижает затраты', 'улучшает качество', 'ускоряет рост'];
const callsToAction = ['Начни прямо сейчас!', 'Пробуй бесплатно!', 'Узнай больше!', 'Присоединяйся!'];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fillTemplate(tpl: string, topic: string): string {
  return tpl
    .replace(/\{topic\}/g, topic)
    .replace(/\{Topic\}/g, capitalize(topic))
    .replace(/\{adj\}/g, pick(adjectives));
}

export function generateText(prompt: string, style: string): string {
  const topic = prompt.replace(/^(напиши|создай|сделай|придумай|сгенерируй)\s*/i, '').trim() || prompt;

  const intros = textIntros[style] || textIntros['Статья'];
  const intro = fillTemplate(pick(intros), topic);

  if (style === 'Идеи и брейншторм') {
    const header = fillTemplate(pick(intros), topic);
    const ideas = fillTemplate(pick(brainstormTemplates), topic);
    return header + ideas;
  }

  if (style === 'Пост для соцсетей') {
    const pts = pickN(benefits, 3);
    const body = pts.map((b, i) => `${['✅', '🎯', '💪'][i]} ${capitalize(b)}`).join('\n');
    const cta = pick(callsToAction);
    return `${intro}\n\n${body}\n\n${cta}\n\n#${topic.split(' ').join('_')} #тренды #новости`;
  }

  if (style === 'Email') {
    return (
      `${intro}\n\n` +
      `В рамках нашего взаимодействия хотели бы предложить рассмотреть возможность ` +
      `сотрудничества в области ${topic}. Данное направление ${pick(benefits)} ` +
      `и открывает новые возможности для обеих сторон.\n\n` +
      `Будем рады обсудить детали на встрече или звонке.\n\n` +
      `С уважением,\n[Ваше имя]`
    );
  }

  if (style === 'Описание товара') {
    return (
      `${intro}\n\n` +
      `✦ ${capitalize(pick(benefits))} в разы эффективнее конкурентов\n` +
      `✦ Разработан специально для работы с ${topic}\n` +
      `✦ Простой интерфейс — освоишь за 5 минут\n` +
      `✦ Поддержка 24/7 и бесплатные обновления\n\n` +
      `${pick(callsToAction)} Специальная цена действует до конца месяца.`
    );
  }

  if (style === 'Сценарий') {
    return (
      `${intro}\n\n` +
      `ПЕРСОНАЖ А\nНам нужно срочно разобраться с ${topic}.\n\n` +
      `ПЕРСОНАЖ Б\nЯ как раз изучал этот вопрос. ${capitalize(pick(benefits))}.\n\n` +
      `ПЕРСОНАЖ А\nОтлично. Значит, начинаем?\n\n` +
      `ПЕРСОНАЖ Б\n(кивает)\nДа. Времени терять нельзя.\n\nФЕЙД АУТ.`
    );
  }

  // Статья (default)
  const sections = pick(articleSections);
  let article = `# ${capitalize(topic)}\n\n${intro}\n\n`;
  sections.forEach((sec, i) => {
    const body = i === 0
      ? `${capitalize(topic)} — это область, которая ${pick(benefits)}. Всё больше компаний и специалистов обращают на неё внимание.`
      : i === sections.length - 1
      ? `Подводя итог, можно уверенно сказать: ${topic} — перспективное направление, которое ${pick(benefits)}. Не упусти момент!`
      : `Здесь важно понимать, что ${topic} ${pick(benefits)}. Практика показывает высокую эффективность этого подхода.`;
    article += `## ${sec}\n\n${body}\n\n`;
  });
  return article.trim();
}

// ─── КОД ──────────────────────────────────────────────────────────────────────

const codeTemplates: Record<string, (topic: string) => string> = {
  Python: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'process';
    return `# ${topic}
# Автоматически сгенерированный код

from typing import Any
import time


def ${fn}(data: Any) -> dict:
    """
    ${topic}
    
    Args:
        data: входные данные для обработки
    
    Returns:
        dict с результатом
    """
    # Инициализация
    result = {
        "status": "success",
        "data": None,
        "timestamp": time.time(),
    }
    
    # Основная логика
    if data is None:
        result["status"] = "error"
        result["message"] = "Данные не переданы"
        return result
    
    # Обработка данных
    processed = str(data).strip()
    result["data"] = processed
    result["length"] = len(processed)
    
    return result


def main():
    # Пример использования
    sample_data = "Тестовые данные"
    output = ${fn}(sample_data)
    
    print(f"Статус: {output['status']}")
    print(f"Данные: {output['data']}")
    print(f"Длина: {output.get('length', 0)}")


if __name__ == "__main__":
    main()`;
  },

  JavaScript: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'process';
    return `// ${topic}
// Автоматически сгенерированный код

/**
 * ${topic}
 * @param {any} data - входные данные
 * @returns {object} результат обработки
 */
function ${fn}(data) {
  if (!data) {
    return { status: 'error', message: 'Данные не переданы' };
  }

  const result = {
    status: 'success',
    data: null,
    timestamp: Date.now(),
  };

  // Основная обработка
  result.data = Array.isArray(data)
    ? data.map(item => String(item).trim())
    : String(data).trim();

  result.length = Array.isArray(result.data)
    ? result.data.length
    : result.data.length;

  return result;
}

// Пример использования
const input = ['Первый элемент', 'Второй элемент', 'Третий элемент'];
const output = ${fn}(input);

console.log('Статус:', output.status);
console.log('Данные:', output.data);
console.log('Количество:', output.length);`;
  },

  TypeScript: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'process';
    return `// ${topic}

interface InputData {
  value: string | string[];
  options?: Record<string, unknown>;
}

interface Result<T> {
  status: 'success' | 'error';
  data: T | null;
  message?: string;
  timestamp: number;
}

/**
 * ${topic}
 */
function ${fn}<T extends string | string[]>(input: InputData): Result<T> {
  if (!input.value) {
    return {
      status: 'error',
      data: null,
      message: 'Значение не передано',
      timestamp: Date.now(),
    };
  }

  const processed = Array.isArray(input.value)
    ? (input.value.map(v => v.trim()) as T)
    : (input.value.trim() as T);

  return {
    status: 'success',
    data: processed,
    timestamp: Date.now(),
  };
}

// Пример
const result = ${fn}<string>({ value: '  Тест  ' });
console.log(result.status);   // success
console.log(result.data);     // 'Тест'`;
  },

  Go: (topic) => `// ${topic}
package main

import (
\t"fmt"
\t"strings"
\t"time"
)

// Result содержит результат обработки
type Result struct {
\tStatus    string
\tData      string
\tTimestamp int64
}

// Process обрабатывает входные данные
// ${topic}
func Process(data string) Result {
\tif data == "" {
\t\treturn Result{Status: "error", Data: "", Timestamp: time.Now().Unix()}
\t}

\tprocessed := strings.TrimSpace(data)

\treturn Result{
\t\tStatus:    "success",
\t\tData:      processed,
\t\tTimestamp: time.Now().Unix(),
\t}
}

func main() {
\tinput := "Тестовые данные"
\tresult := Process(input)

\tfmt.Printf("Статус: %s\\n", result.Status)
\tfmt.Printf("Данные: %s\\n", result.Data)
}`,

  Rust: (topic) => `// ${topic}

use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug)]
struct Result {
    status: String,
    data: String,
    timestamp: u64,
}

/// ${topic}
fn process(data: &str) -> Result {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    if data.is_empty() {
        return Result {
            status: "error".to_string(),
            data: String::new(),
            timestamp,
        };
    }

    Result {
        status: "success".to_string(),
        data: data.trim().to_string(),
        timestamp,
    }
}

fn main() {
    let input = "Тестовые данные";
    let result = process(input);
    println!("Статус: {}", result.status);
    println!("Данные: {}", result.data);
}`,

  SQL: (topic) => {
    const table = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'items';
    return `-- ${topic}

-- Создание таблицы
CREATE TABLE IF NOT EXISTS ${table} (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  DEFAULT 'active',
    created_at  TIMESTAMP    DEFAULT NOW(),
    updated_at  TIMESTAMP    DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_${table}_status   ON ${table}(status);
CREATE INDEX idx_${table}_created  ON ${table}(created_at);

-- Вставка тестовых данных
INSERT INTO ${table} (name, description, status) VALUES
    ('Первый элемент',  'Описание первого',  'active'),
    ('Второй элемент',  'Описание второго',  'active'),
    ('Третий элемент',  'Описание третьего', 'inactive');

-- Получить все активные записи
SELECT id, name, description, created_at
FROM ${table}
WHERE status = 'active'
ORDER BY created_at DESC;

-- Обновить статус
UPDATE ${table}
SET status = 'inactive', updated_at = NOW()
WHERE id = 1;`;
  },

  Bash: (topic) => [
    '#!/bin/bash',
    `# ${topic}`,
    '',
    'set -euo pipefail',
    '',
    '# Конфигурация',
    'SCRIPT_NAME="$(basename "$0")"',
    'LOG_FILE="/tmp/${SCRIPT_NAME%.sh}.log"',
    "TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')",
    '',
    '# Логирование',
    'log() {',
    '    echo "[${TIMESTAMP}] $1" | tee -a "$LOG_FILE"',
    '}',
    '',
    '# Проверка зависимостей',
    'check_deps() {',
    '    local deps=("curl" "jq" "awk")',
    '    for dep in "${deps[@]}"; do',
    '        if ! command -v "$dep" &>/dev/null; then',
    '            log "ОШИБКА: $dep не установлен"',
    '            exit 1',
    '        fi',
    '    done',
    '    log "Зависимости проверены"',
    '}',
    '',
    '# Основная функция',
    'main() {',
    `    log "Запуск: ${topic}"`,
    '    check_deps',
    '    local input="${1:-}"',
    '    if [[ -z "$input" ]]; then',
    '        log "Использование: $SCRIPT_NAME <аргумент>"',
    '        exit 1',
    '    fi',
    '    log "Обработка: $input"',
    '    echo "$input" | tr \'[:lower:]\' \'[:upper:]\'',
    '    log "Завершено успешно"',
    '}',
    '',
    'main "$@"',
  ].join('\n'),
};

const genericCode = (lang: string, topic: string) => {
  const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'process';
  return `// ${topic}
// ${lang}

// Функция: ${fn}
// Описание: ${topic}

function ${fn}(input) {
    // Валидация входных данных
    if (!input) {
        throw new Error("Входные данные не переданы");
    }
    
    // Основная обработка
    const result = {
        input: input,
        processed: true,
        timestamp: new Date().toISOString()
    };
    
    return result;
}

// Пример использования
const output = ${fn}("Тестовые данные");
console.log(output);`;
};

export function generateCode(prompt: string, language: string): string {
  const topic = prompt.trim() || 'обработка данных';
  const template = codeTemplates[language];
  return template ? template(topic) : genericCode(language, topic);
}

// ─── ГЛАВНАЯ ФУНКЦИЯ ──────────────────────────────────────────────────────────

export interface GenerateResult {
  result: string;
  tokens: number;
  model: string;
}

export async function generate(
  type: 'text' | 'code',
  prompt: string,
  style: string,
  language: string
): Promise<GenerateResult> {
  // Имитируем задержку генерации для реалистичности
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

  const result = type === 'code'
    ? generateCode(prompt, language)
    : generateText(prompt, style);

  return {
    result,
    tokens: result.split(/\s+/).length,
    model: 'NexusGen-Local',
  };
}