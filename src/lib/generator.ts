// Локальный движок генерации — без API

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── ТЕКСТ ────────────────────────────────────────────────────────────────────

export function generateText(prompt: string, style: string): string {
  // Очищаем от служебных слов
  const topic = prompt
    .replace(/^(напиши|создай|сделай|придумай|сгенерируй|напишите|сделайте)\s+/i, '')
    .trim() || prompt.trim();

  if (style === 'Статья') return makeArticle(topic);
  if (style === 'Пост для соцсетей') return makePost(topic);
  if (style === 'Email') return makeEmail(topic);
  if (style === 'Сценарий') return makeScript(topic);
  if (style === 'Описание товара') return makeProduct(topic);
  if (style === 'Идеи и брейншторм') return makeBrainstorm(topic);
  return makeArticle(topic);
}

// ── Статья ──
function makeArticle(topic: string): string {
  const t = topic;
  const T = cap(t);

  const hooks = [
    `${T} — тема, которая в последние годы привлекает всё больше внимания. И неспроста.`,
    `Если вы хотите разобраться в теме «${t}», эта статья даст вам чёткое понимание с нуля.`,
    `Что такое ${t} и почему это важно знать каждому? Разберём подробно.`,
    `${T} активно развивается, и знание этой темы открывает новые возможности.`,
  ];

  const whyBlocks = [
    `${T} решает конкретные задачи: экономит время, снижает ошибки и помогает принимать более взвешенные решения. Именно поэтому интерес к этой теме растёт год от года.`,
    `Понимание ${t} даёт конкурентное преимущество. Те, кто разобрался в этом раньше других, уже получают результаты — и это подтверждают многочисленные примеры.`,
    `Без знания основ ${t} сложно двигаться вперёд в современном мире. Эта тема лежит в основе многих успешных решений и проектов.`,
  ];

  const howBlocks = [
    `**Шаг 1.** Изучите базовые понятия и термины в области «${t}».\n**Шаг 2.** Найдите несколько реальных примеров применения.\n**Шаг 3.** Попробуйте применить знания на практике — даже небольшой эксперимент даст больше, чем теория.\n**Шаг 4.** Найдите сообщество практиков и задавайте вопросы.`,
    `Начать стоит с чёткого определения цели: зачем именно вам нужна тема «${t}»? После этого выстраивайте знания от простого к сложному, фиксируйте результаты и анализируйте ошибки.`,
  ];

  const mistakeBlocks = [
    `— Игнорировать практику и застревать только в теории\n— Ожидать быстрых результатов без системной работы\n— Не обновлять знания: ${t} — динамичная область\n— Действовать в одиночку, не используя опыт других`,
    `— Браться за всё сразу вместо последовательного изучения\n— Недооценивать сложность темы ${t}\n— Не документировать свои наработки и выводы`,
  ];

  const conclusions = [
    `${T} — это не просто модное слово. Это инструмент, который при правильном использовании реально меняет результаты. Начните с малого, будьте последовательны, и успех не заставит себя ждать.`,
    `Подводя итог: ${t} стоит изучать и применять. Это вложение в себя, которое окупится. Главное — не откладывать и начать прямо сейчас.`,
    `Теперь у вас есть понимание темы «${t}». Следующий шаг — за вами. Действуйте осознанно, опирайтесь на факты и не бойтесь экспериментировать.`,
  ];

  return [
    `# ${T}`,
    '',
    pick(hooks),
    '',
    `## Почему это важно`,
    '',
    pick(whyBlocks),
    '',
    `## Как разобраться в теме`,
    '',
    pick(howBlocks),
    '',
    `## Типичные ошибки`,
    '',
    pick(mistakeBlocks),
    '',
    `## Заключение`,
    '',
    pick(conclusions),
  ].join('\n');
}

// ── Пост ──
function makePost(topic: string): string {
  const t = topic;
  const T = cap(t);

  const opens = [
    `🔥 ${T} — это то, о чём стоит знать каждому.\n\nОбъясняю на пальцах 👇`,
    `💡 Если бы мне раньше объяснили про ${t} так, как я объясню сейчас — сэкономил бы кучу времени.\n\nЧитай до конца 👇`,
    `⚡ ${T} меняет правила игры.\n\nВот что нужно знать прямо сейчас:`,
    `🚀 Поговорим о ${t}.\n\nВсе слышали, но мало кто понимает суть. Разбираем:`,
  ];

  const points = [
    [`✅ Это реально работает — есть конкретные результаты`, `✅ Порог входа ниже, чем кажется`, `✅ Начать можно уже сегодня`],
    [`👉 Главное — не теория, а практика`, `👉 Первые результаты видны быстро`, `👉 Сообщество поможет не застрять`],
    [`💎 Это экономит время`, `💎 Это снижает количество ошибок`, `💎 Это открывает новые возможности`],
  ];

  const closes = [
    `Сохрани пост, чтобы не потерять 🔖\n\n#${t.split(' ')[0]} #саморазвитие #полезное`,
    `Напиши в комментариях — уже пробовал?\n\n#${t.split(' ')[0]} #знания #опыт`,
    `Ставь ❤️ если было полезно!\n\n#${t.split(' ')[0]} #тренды #практика`,
  ];

  const pts = pick(points);
  return [open, pick(opens), '', ...pts, '', pick(closes)].filter(x => x !== open).join('\n');
}

// ── Email ──
function makeEmail(topic: string): string {
  const t = topic;
  const greetings = ['Добрый день!', 'Здравствуйте!', 'Уважаемый коллега,'];
  const purposes = [
    `пишу вам в связи с вопросом по теме «${t}»`,
    `хотел бы обсудить с вами возможное сотрудничество в области «${t}»`,
    `направляю вам информацию по интересующей нас теме «${t}»`,
  ];
  const bodies = [
    `Уверен, что совместная работа над этим направлением принесёт ощутимые результаты для обеих сторон. Мы уже имеем успешный опыт в данной области и готовы поделиться наработками.`,
    `Данная тема становится всё более актуальной, и мы хотели бы обсудить, как можно эффективно её применить в рамках вашего проекта. Готов предоставить дополнительные материалы по запросу.`,
    `Мы изучили вопрос и готовы предложить конкретное решение. Думаю, это будет интересно вашей команде и поможет достичь поставленных целей.`,
  ];
  const calls = [
    `Прошу рассмотреть предложение и дать обратную связь в удобное для вас время.`,
    `Буду рад обсудить детали на звонке или встрече — напишите, когда вам удобно.`,
    `Жду вашего ответа. Готов предоставить любую дополнительную информацию.`,
  ];

  return [
    pick(greetings),
    '',
    `Меня зовут [Имя], ${pick(purposes)}.`,
    '',
    pick(bodies),
    '',
    pick(calls),
    '',
    'С уважением,\n[Ваше имя]\n[Должность / Компания]',
  ].join('\n');
}

// ── Сценарий ──
function makeScript(topic: string): string {
  const t = topic;
  const settings = [
    `INT. ОФИС — ДЕНЬ`,
    `INT. ПЕРЕГОВОРНАЯ — УТРО`,
    `EXT. КОФЕЙНЯ — ВЕЧЕР`,
    `INT. КОВОРКИНГ — ДЕНЬ`,
  ];
  const setting = pick(settings);

  return [
    `ФЕЙД ИН:`,
    ``,
    `СЦЕНА 1. ${setting}`,
    ``,
    `За столом сидят двое — АЛЕКСЕЙ (30) и МАРИНА (28). Между ними ноутбук.`,
    ``,
    `АЛЕКСЕЙ`,
    `Слушай, нам надо разобраться с этим до конца недели. Тема «${t}» — ключевая.`,
    ``,
    `МАРИНА`,
    `(листает заметки)`,
    `Я изучила вопрос. Если сделать всё правильно — выигрыш будет очевидным.`,
    ``,
    `АЛЕКСЕЙ`,
    `Отлично. Значит, ты берёшь на себя первый блок?`,
    ``,
    `МАРИНА`,
    `Да. Но мне нужно ещё два дня. Это серьёзнее, чем кажется.`,
    ``,
    `Алексей кивает. Долгая пауза.`,
    ``,
    `АЛЕКСЕЙ`,
    `Хорошо. Два дня. Потом — финальное решение.`,
    ``,
    `МАРИНА`,
    `(тихо, уходя)`,
    `Надеюсь, мы делаем правильный выбор.`,
    ``,
    `МОНТАЖ. ФЕЙД АУТ.`,
    ``,
    `КОНЕЦ СЦЕНЫ`,
  ].join('\n');
}

// ── Описание товара ──
function makeProduct(topic: string): string {
  const t = topic;
  const T = cap(t);

  const taglines = [
    `${T} — продукт, который решает задачу раз и навсегда.`,
    `Мы создали ${t} специально для тех, кто ценит результат, а не процесс.`,
    `${T}: просто, быстро, эффективно.`,
  ];

  const features = pickN([
    `⚡ Работает с первой минуты — без долгой настройки`,
    `🎯 Решает конкретную задачу без лишних функций`,
    `🔒 Надёжно и безопасно — проверено тысячами пользователей`,
    `📱 Работает на всех устройствах`,
    `🚀 Регулярные обновления — бесплатно`,
    `💬 Поддержка 24/7 на русском языке`,
    `✅ Гарантия возврата 30 дней`,
    `📊 Подробная аналитика и отчёты`,
  ], 4);

  const socials = [
    `Более 5 000 клиентов уже используют ${t} и довольны результатом.`,
    `«Лучшее решение в своём классе» — так говорят наши клиенты.`,
    `Рейтинг 4.9/5 по отзывам реальных пользователей.`,
  ];

  const ctas = [
    `👉 Попробуй бесплатно 14 дней — кредитная карта не нужна.`,
    `👉 Закажи сегодня и получи скидку 20% по промокоду NEXUS.`,
    `👉 Начни прямо сейчас — первые результаты уже завтра.`,
  ];

  return [
    pick(taglines),
    '',
    ...features,
    '',
    pick(socials),
    '',
    pick(ctas),
  ].join('\n');
}

// ── Брейншторм ──
function makeBrainstorm(topic: string): string {
  const t = topic;

  const ideaTemplates = [
    `Мобильное приложение для ${t} с геймификацией`,
    `Telegram-бот, который помогает разобраться в ${t}`,
    `Онлайн-курс по ${t} за 7 дней`,
    `Подкаст с экспертами в области ${t}`,
    `Маркетплейс специалистов по ${t}`,
    `ИИ-ассистент для задач, связанных с ${t}`,
    `Сообщество практиков ${t} в формате клуба`,
    `SaaS-сервис автоматизации процессов в ${t}`,
    `YouTube-канал с разборами кейсов по ${t}`,
    `Чек-лист и шаблоны документов для ${t}`,
    `Агрегатор новостей и трендов по ${t}`,
    `Корпоративный тренинг по внедрению ${t}`,
  ];

  const ideas = pickN(ideaTemplates, 8);

  return [
    `💡 Брейншторм по теме: «${cap(t)}»`,
    ``,
    ...ideas.map((idea, i) => `${i + 1}. ${idea}`),
    ``,
    `🎯 Выбери 1-2 идеи для проработки и переходи к следующему шагу.`,
  ].join('\n');
}

// ─── КОД ──────────────────────────────────────────────────────────────────────

const codeTemplates: Record<string, (topic: string) => string> = {
  Python: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'process_data';
    return `# ${topic}

from typing import Any
import time


def ${fn}(data: Any) -> dict:
    """
    ${topic}

    Args:
        data: входные данные

    Returns:
        Словарь с результатом обработки
    """
    start = time.time()

    if data is None:
        return {"status": "error", "message": "Данные не переданы", "data": None}

    # Преобразование к строке для универсальности
    processed = str(data).strip()

    # Основная логика обработки
    words = processed.split()
    result = {
        "status": "success",
        "data": processed,
        "word_count": len(words),
        "char_count": len(processed),
        "elapsed_ms": round((time.time() - start) * 1000, 2),
    }

    return result


def main():
    # Примеры использования
    samples = ["Привет, мир!", "  Пробелы  ", None, "Python — лучший язык"]

    for sample in samples:
        output = ${fn}(sample)
        status = output["status"]
        if status == "success":
            print(f"✓ '{output['data']}' | слов: {output['word_count']}")
        else:
            print(f"✗ Ошибка: {output['message']}")


if __name__ == "__main__":
    main()`;
  },

  JavaScript: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 24) || 'processData';
    return `// ${topic}

/**
 * ${topic}
 * @param {string|string[]|object} data — входные данные
 * @returns {{ status: string, data: any, meta: object }}
 */
function ${fn}(data) {
  const startTime = performance.now();

  if (data === null || data === undefined) {
    return { status: 'error', message: 'Данные не переданы', data: null };
  }

  // Обработка массивов
  if (Array.isArray(data)) {
    const processed = data.map(item => String(item).trim()).filter(Boolean);
    return {
      status: 'success',
      data: processed,
      meta: {
        count: processed.length,
        elapsedMs: (performance.now() - startTime).toFixed(2),
      },
    };
  }

  // Обработка строки
  const text = String(data).trim();
  return {
    status: 'success',
    data: text,
    meta: {
      words: text.split(/\\s+/).length,
      chars: text.length,
      elapsedMs: (performance.now() - startTime).toFixed(2),
    },
  };
}

// Примеры использования
const tests = [
  'Привет, мир!',
  ['яблоко', 'банан', 'вишня'],
  null,
];

tests.forEach(input => {
  const result = ${fn}(input);
  if (result.status === 'success') {
    console.log('✓', JSON.stringify(result.data), '|', JSON.stringify(result.meta));
  } else {
    console.log('✗', result.message);
  }
});`;
  },

  TypeScript: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 24) || 'processData';
    return `// ${topic}

interface ProcessResult<T> {
  status: 'success' | 'error';
  data: T | null;
  message?: string;
  meta?: {
    elapsedMs: number;
    [key: string]: unknown;
  };
}

type InputData = string | string[] | Record<string, unknown> | null;

/**
 * ${topic}
 */
function ${fn}<T extends InputData>(input: T): ProcessResult<T extends string[] ? string[] : string> {
  const start = performance.now();

  if (input === null || input === undefined) {
    return { status: 'error', data: null, message: 'Данные не переданы' };
  }

  if (Array.isArray(input)) {
    const processed = input.map((v) => String(v).trim()).filter(Boolean);
    return {
      status: 'success',
      data: processed as never,
      meta: { elapsedMs: performance.now() - start, count: processed.length },
    };
  }

  const text = String(input).trim();
  return {
    status: 'success',
    data: text as never,
    meta: {
      elapsedMs: performance.now() - start,
      words: text.split(/\\s+/).length,
      chars: text.length,
    },
  };
}

// Примеры
console.log(${fn}('Hello, TypeScript!'));
console.log(${fn}(['один', 'два', 'три']));
console.log(${fn}(null));`;
  },

  Go: (topic) => {
    const fn = cap(topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'Process');
    return `// ${topic}
package main

import (
\t"fmt"
\t"strings"
\t"time"
)

// Result — результат обработки данных
type Result struct {
\tStatus    string
\tData      string
\tWordCount int
\tElapsedMs float64
}

// ${fn} обрабатывает входные данные
// ${topic}
func ${fn}(data string) Result {
\tstart := time.Now()

\tif data == "" {
\t\treturn Result{Status: "error"}
\t}

\tprocessed := strings.TrimSpace(data)
\twords := strings.Fields(processed)

\treturn Result{
\t\tStatus:    "success",
\t\tData:      processed,
\t\tWordCount: len(words),
\t\tElapsedMs: float64(time.Since(start).Microseconds()) / 1000,
\t}
}

func main() {
\tsamples := []string{"Привет, мир!", "  Go — быстрый язык  ", ""}

\tfor _, s := range samples {
\t\tr := ${fn}(s)
\t\tif r.Status == "success" {
\t\t\tfmt.Printf("✓ '%s' | слов: %d | %.2f мс\\n", r.Data, r.WordCount, r.ElapsedMs)
\t\t} else {
\t\t\tfmt.Println("✗ Пустые данные")
\t\t}
\t}
}`;
  },

  Rust: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'process';
    return `// ${topic}

#[derive(Debug)]
struct ProcessResult {
    status: String,
    data: String,
    word_count: usize,
}

/// ${topic}
fn ${fn}(input: &str) -> ProcessResult {
    let trimmed = input.trim();

    if trimmed.is_empty() {
        return ProcessResult {
            status: "error".to_string(),
            data: String::new(),
            word_count: 0,
        };
    }

    let word_count = trimmed.split_whitespace().count();

    ProcessResult {
        status: "success".to_string(),
        data: trimmed.to_string(),
        word_count,
    }
}

fn main() {
    let samples = vec![
        "Привет, мир!",
        "  Rust — безопасный язык  ",
        "",
    ];

    for sample in samples {
        let result = ${fn}(sample);
        if result.status == "success" {
            println!("✓ '{}' | слов: {}", result.data, result.word_count);
        } else {
            println!("✗ Пустые данные");
        }
    }
}`;
  },

  SQL: (topic) => {
    const table = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'records';
    return `-- ${topic}

-- ──────────────────────────────────────────
-- Создание таблицы
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ${table} (
    id          SERIAL       PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active', 'inactive', 'archived')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_${table}_status
    ON ${table}(status);

CREATE INDEX IF NOT EXISTS idx_${table}_created
    ON ${table}(created_at DESC);

-- ──────────────────────────────────────────
-- Тестовые данные
-- ──────────────────────────────────────────
INSERT INTO ${table} (title, description, status) VALUES
    ('Первая запись',  'Описание первой записи',  'active'),
    ('Вторая запись',  'Описание второй записи',  'active'),
    ('Архивная запись','Старая запись для архива', 'archived');

-- ──────────────────────────────────────────
-- Запросы
-- ──────────────────────────────────────────

-- Все активные записи
SELECT id, title, description, created_at
FROM ${table}
WHERE status = 'active'
ORDER BY created_at DESC;

-- Поиск по названию
SELECT * FROM ${table}
WHERE title ILIKE '%поиск%';

-- Обновить статус
UPDATE ${table}
SET status = 'inactive', updated_at = NOW()
WHERE id = 1
RETURNING *;

-- Удалить архивные
DELETE FROM ${table} WHERE status = 'archived';`;
  },

  'C++': (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'process';
    return `// ${topic}
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>

struct ProcessResult {
    bool success;
    std::string data;
    int wordCount;
};

// ${topic}
ProcessResult ${fn}(const std::string& input) {
    std::string trimmed = input;

    // Убираем пробелы по краям
    trimmed.erase(0, trimmed.find_first_not_of(" \\t\\n"));
    trimmed.erase(trimmed.find_last_not_of(" \\t\\n") + 1);

    if (trimmed.empty()) {
        return {false, "", 0};
    }

    // Считаем слова
    std::istringstream iss(trimmed);
    int count = 0;
    std::string word;
    while (iss >> word) ++count;

    return {true, trimmed, count};
}

int main() {
    std::vector<std::string> samples = {
        "Привет, мир!",
        "  C++ — мощный язык  ",
        ""
    };

    for (const auto& s : samples) {
        auto r = ${fn}(s);
        if (r.success) {
            std::cout << "✓ '" << r.data << "' | слов: " << r.wordCount << std::endl;
        } else {
            std::cout << "✗ Пустые данные" << std::endl;
        }
    }
    return 0;
}`;
  },

  Java: (topic) => {
    const cls = cap(topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'Processor');
    return `// ${topic}
import java.util.Arrays;
import java.util.List;

public class ${cls} {

    record ProcessResult(boolean success, String data, int wordCount) {}

    /**
     * ${topic}
     * @param input входные данные
     * @return результат обработки
     */
    public static ProcessResult process(String input) {
        if (input == null || input.isBlank()) {
            return new ProcessResult(false, null, 0);
        }

        String trimmed = input.trim();
        int wordCount = trimmed.split("\\\\s+").length;

        return new ProcessResult(true, trimmed, wordCount);
    }

    public static void main(String[] args) {
        List<String> samples = Arrays.asList(
            "Привет, мир!",
            "  Java — популярный язык  ",
            ""
        );

        for (String sample : samples) {
            ProcessResult result = process(sample);
            if (result.success()) {
                System.out.printf("✓ '%s' | слов: %d%n", result.data(), result.wordCount());
            } else {
                System.out.println("✗ Пустые данные");
            }
        }
    }
}`;
  },

  Swift: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'process';
    return `// ${topic}
import Foundation

struct ProcessResult {
    let success: Bool
    let data: String?
    let wordCount: Int
}

/// ${topic}
func ${fn}(_ input: String) -> ProcessResult {
    let trimmed = input.trimmingCharacters(in: .whitespacesAndNewlines)

    guard !trimmed.isEmpty else {
        return ProcessResult(success: false, data: nil, wordCount: 0)
    }

    let words = trimmed.components(separatedBy: .whitespaces).filter { !$0.isEmpty }
    return ProcessResult(success: true, data: trimmed, wordCount: words.count)
}

// Примеры
let samples = ["Привет, мир!", "  Swift — элегантный язык  ", ""]

for sample in samples {
    let result = ${fn}(sample)
    if result.success, let data = result.data {
        print("✓ '\\(data)' | слов: \\(result.wordCount)")
    } else {
        print("✗ Пустые данные")
    }
}`;
  },

  PHP: (topic) => {
    const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'process_data';
    return `<?php
// ${topic}

declare(strict_types=1);

/**
 * ${topic}
 *
 * @param mixed $data входные данные
 * @return array результат обработки
 */
function ${fn}(mixed $data): array {
    if ($data === null) {
        return ['status' => 'error', 'message' => 'Данные не переданы'];
    }

    $text = trim((string) $data);

    if ($text === '') {
        return ['status' => 'error', 'message' => 'Пустая строка'];
    }

    $words = preg_split('/\\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);

    return [
        'status'     => 'success',
        'data'       => $text,
        'word_count' => count($words ?? []),
        'char_count' => mb_strlen($text),
    ];
}

// Примеры использования
$samples = ['Привет, мир!', '  PHP — серверный язык  ', null, ''];

foreach ($samples as $sample) {
    $result = ${fn}($sample);
    if ($result['status'] === 'success') {
        echo "✓ '{$result['data']}' | слов: {$result['word_count']}\\n";
    } else {
        echo "✗ Ошибка: {$result['message']}\\n";
    }
}`;
  },

  Bash: (_topic) => [
    '#!/bin/bash',
    '# Обработка данных',
    '',
    'set -euo pipefail',
    '',
    'process() {',
    '  local input="$1"',
    '  if [[ -z "$input" ]]; then',
    '    echo "✗ Пустые данные" >&2',
    '    return 1',
    '  fi',
    '  local trimmed',
    '  trimmed=$(echo "$input" | xargs)',
    '  local words',
    '  words=$(echo "$trimmed" | wc -w)',
    '  echo "✓ ${trimmed} | слов: ${words}"',
    '}',
    '',
    'samples=("Привет, мир!" "  Bash — системный язык  " "")',
    '',
    'for s in "${samples[@]}"; do',
    '  process "$s" || true',
    'done',
  ].join('\n'),
};

export function generateCode(prompt: string, language: string): string {
  const topic = prompt.trim() || 'обработка данных';
  const template = codeTemplates[language];
  if (template) return template(topic);

  // Generic fallback
  const fn = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'process';
  return `// ${topic}\n// ${language}\n\nfunction ${fn}(data) {\n  // TODO: реализация\n  return data;\n}\n\nconsole.log(${fn}("test"));`;
}

// ─── ГЛАВНЫЙ ЭКСПОРТ ──────────────────────────────────────────────────────────

export interface GenerateResult {
  result: string;
  tokens: number;
  model: string;
}

export async function generate(
  type: 'text' | 'code',
  prompt: string,
  style: string,
  language: string,
): Promise<GenerateResult> {
  // Реалистичная задержка
  await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

  const result = type === 'code'
    ? generateCode(prompt, language)
    : generateText(prompt, style);

  return {
    result,
    tokens: result.split(/\s+/).length,
    model: 'NexusGen-Local',
  };
}
