"""Генерация текста и кода через OpenAI GPT-4o-mini."""
import json
import os
from openai import OpenAI


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
        gen_type = body.get('type', 'text')
        prompt = body.get('prompt', '').strip()
        style = body.get('style', '')
        language = body.get('language', 'Python')

        if not prompt:
            return {
                'statusCode': 400,
                'headers': cors,
                'body': json.dumps({'error': 'Prompt is required'})
            }

        client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

        if gen_type == 'code':
            system = (
                f"Ты — эксперт-программист. Пиши только чистый код на {language} без объяснений. "
                f"Код должен быть рабочим, с комментариями на русском языке. "
                f"Не используй markdown-блоки (```), только сам код."
            )
            user_msg = f"Напиши код на {language}: {prompt}"
            max_tokens = 1200

        else:  # text
            style_map = {
                'Статья': 'экспертная статья с заголовками и подзаголовками',
                'Пост для соцсетей': 'яркий цепляющий пост для соцсетей с эмодзи',
                'Email': 'профессиональное деловое письмо',
                'Сценарий': 'сценарий с диалогами и ремарками',
                'Описание товара': 'продающее описание товара с преимуществами',
                'Идеи и брейншторм': 'список из 7-10 конкретных идей с кратким описанием каждой',
            }
            style_desc = style_map.get(style, 'качественный текст')
            system = (
                f"Ты — профессиональный копирайтер. Пиши на русском языке. "
                f"Формат: {style_desc}. Текст должен быть живым, читабельным и ценным."
            )
            user_msg = prompt
            max_tokens = 1000

        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': user_msg},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )

        result = response.choices[0].message.content or ''
        tokens_used = response.usage.total_tokens if response.usage else 0

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({
                'result': result,
                'tokens': tokens_used,
                'model': 'gpt-4o-mini',
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors,
            'body': json.dumps({'error': str(e)})
        }
