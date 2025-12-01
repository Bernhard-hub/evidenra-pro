// Fix Dynamic Coding text size by adding truncation
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/services/DynamicCodingPersonas.ts', 'utf8');

// Find and replace to add text truncation - simpler approach using sed-like replace
content = content.replace(
  'prompt += `**Text**:\\n"${segment.text}"\\n\\n`;',
  `// ⚠️ IMPORTANT: Truncate text to prevent API overflow (max 16MB total)
    const MAX_SEGMENT_LENGTH = 5000; // Max 5000 chars per segment
    const truncatedText = segment.text.length > MAX_SEGMENT_LENGTH
      ? segment.text.substring(0, MAX_SEGMENT_LENGTH) + '... [TRUNCATED for API size limit]'
      : segment.text;

    prompt += \`**Text** (\${segment.text.length} chars, showing \${truncatedText.length}):\\n"\${truncatedText}"\\n\\n\`;`
);

// Truncate category descriptions
content = content.replace(
  'prompt += `   - ${cat.description}\\n`;',
  `const MAX_CAT_DESC = 200;
      const truncatedDesc = cat.description.length > MAX_CAT_DESC
        ? cat.description.substring(0, MAX_CAT_DESC) + '...'
        : cat.description;
      prompt += \`   - \${truncatedDesc}\\n\`;`
);

// Limit examples
content = content.replace(
  'prompt += `   - Examples: ${cat.examples.join(\'; \')}\\n`;',
  `// Limit to first 2 examples, max 100 chars each
        const limitedExamples = cat.examples.slice(0, 2).map(ex =>
          ex.length > 100 ? ex.substring(0, 100) + '...' : ex
        );
        prompt += \`   - Examples: \${limitedExamples.join('; ')}\\n\`;`
);

// Write back
fs.writeFileSync('src/services/DynamicCodingPersonas.ts', content, 'utf8');

console.log('✅ Text size limits added to Dynamic Coding!');
