"""Генерация текста и кода через бесплатный Hugging Face Inference API (без ключа)."""
import json
import urllib.request
import urllib.error


HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"


def hf_generate(prompt: str, max_tokens: int = 800) -> str:
    payload = json.dumps({
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": 0.7,
            "do_sample": True,
            "return_full_text": False,
        }
    }).encode("utf-8")

    req = urllib.request.Request(
        HF_API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    if isinstance(data, list) and data:
        return data[0].get("generated_text", "").strip()
    raise ValueError(f"Unexpected response: {data}")


def handler(event: dict, context) -> dict:
    """Генерация текста и кода через Mistral-7B (бесплатно, без ключа)."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        gen_type = body.get("type", "text")
        prompt = body.get("prompt", "").strip()
        style = body.get("style", "")
        language = body.get("language", "Python")

        if not prompt:
            return {
                "statusCode": 400,
                "headers": cors,
                "body": json.dumps({"error": "Prompt is required"}),
            }

        if gen_type == "code":
            full_prompt = (
                f"<s>[INST] Ты эксперт-программист. Напиши только чистый рабочий код на {language} "
                f"без объяснений и без markdown-блоков. Комментарии пиши на русском.\n\n"
                f"Задача: {prompt} [/INST]"
            )
            max_tokens = 900

        else:
            style_map = {
                "Статья": "экспертная статья с заголовками и подзаголовками",
                "Пост для соцсетей": "яркий цепляющий пост с эмодзи",
                "Email": "профессиональное деловое письмо",
                "Сценарий": "сценарий с диалогами и ремарками",
                "Описание товара": "продающее описание товара с преимуществами",
                "Идеи и брейншторм": "список из 7-10 идей с кратким описанием каждой",
            }
            style_desc = style_map.get(style, "качественный текст")
            full_prompt = (
                f"<s>[INST] Ты профессиональный копирайтер. Пиши на русском языке. "
                f"Формат: {style_desc}.\n\n{prompt} [/INST]"
            )
            max_tokens = 700

        result = hf_generate(full_prompt, max_tokens)

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "result": result,
                "tokens": len(result.split()),
                "model": "Mistral-7B-Instruct",
            }),
        }

    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        # Model loading — cold start
        if e.code == 503:
            return {
                "statusCode": 503,
                "headers": cors,
                "body": json.dumps({"error": "Модель загружается, попробуй через 20 секунд"}),
            }
        return {
            "statusCode": 500,
            "headers": cors,
            "body": json.dumps({"error": f"HF error {e.code}: {err_body[:200]}"}),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors,
            "body": json.dumps({"error": str(e)}),
        }
