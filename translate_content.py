import requests
import json
import re
from bs4 import BeautifulSoup
from googletrans import Translator

def main():
    # Fetch programs
    res = requests.get('https://panafstrag-backend-app-v3.onrender.com/program')
    programs = res.json()
    
    # We will collect unique descriptions and contents
    texts_to_translate = set()
    for p in programs:
        desc = p.get('description', '')
        content = p.get('content', '')
        if desc and len(desc) > 5:
            texts_to_translate.add(desc)
        if content and len(content) > 5:
            texts_to_translate.add(content)
            
    translator = Translator()
    
    # Target languages: fr, es, pt
    translations = {
        'fr': {},
        'es': {},
        'pt': {}
    }
    
    print(f"Translating {len(texts_to_translate)} items...")
    
    for text in texts_to_translate:
        for lang in ['fr', 'es', 'pt']:
            try:
                # We can translate HTML directly using googletrans
                t_res = translator.translate(text, dest=lang, src='en')
                translations[lang][text] = t_res.text
            except Exception as e:
                print(f"Failed to translate: {e}")
                translations[lang][text] = text

    # Now inject into useI18n.ts
    filepath = '/Users/marquis/panafstrag/user/composables/useI18n.ts'
    with open(filepath, 'r', encoding='utf-8') as f:
        content_ts = f.read()
        
    for lang in ['fr', 'es', 'pt']:
        # Find the block for the language
        # It looks like: 'fr': { ... }
        lang_pattern = f"'{lang}': {{"
        if lang_pattern in content_ts:
            insertion_idx = content_ts.find(lang_pattern) + len(lang_pattern)
            
            # Build string to insert
            insert_str = "\n"
            for k, v in translations[lang].items():
                # Escape quotes
                safe_k = json.dumps(k)
                safe_v = json.dumps(v)
                insert_str += f"      {safe_k}: {safe_v},\n"
                
            content_ts = content_ts[:insertion_idx] + insert_str + content_ts[insertion_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content_ts)

    print("Successfully injected translations into useI18n.ts")

if __name__ == "__main__":
    main()
