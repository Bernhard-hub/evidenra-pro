#!/usr/bin/env python3
"""Add BASIC-compatible model names to APIService.ts"""

import re

# Read the file
with open('src/services/APIService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old pattern and new replacement
old_pattern = r"    const knownModels = \[\s+\{\s+id: 'claude-3-5-sonnet-20241022',"

new_text = """    // ⚠️ BASIC-kompatible Model-Namen ZUERST (diese funktionieren mit Standard API-Keys!)
    const knownModels = [
      {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5 - RECOMMENDED (BASIC Compatible)',
        maxTokens: 8192,
        cost: 0.003
      },
      {
        id: 'claude-haiku-4-5',
        name: 'Claude Haiku 4.5 - Fast & Cheap (BASIC Compatible)',
        maxTokens: 8192,
        cost: 0.001
      },
      {
        id: 'claude-3-5-sonnet-20241022',"""

# Replace
content = re.sub(old_pattern, new_text, content, count=1)

# Write back
with open('src/services/APIService.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ BASIC model names added successfully!")
