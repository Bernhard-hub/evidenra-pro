# Supabase Edge Functions - EVIDENRA

## Geschützte Prompts Deployment

Die kritischen AI-Prompts sind in Supabase Edge Functions ausgelagert und nicht mehr im Client-Code sichtbar.

### Voraussetzungen

1. **Supabase CLI installieren:**
   ```bash
   npm install -g supabase
   ```

2. **Login:**
   ```bash
   supabase login
   ```

3. **Projekt verknüpfen:**
   ```bash
   supabase link --project-ref zvkoulhziksfxnxkkrmb
   ```

### Deployment

```bash
# Edge Function deployen
supabase functions deploy protected-prompts

# Secrets setzen (falls nötig)
supabase secrets set MY_SECRET=value
```

### Testen

```bash
# Lokal testen
supabase functions serve protected-prompts --env-file .env.local

# Curl Test
curl -X POST 'https://zvkoulhziksfxnxkkrmb.supabase.co/functions/v1/protected-prompts' \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"promptType": "expertPersonas"}'
```

### Verfügbare Prompt-Typen

| promptType | Beschreibung |
|------------|--------------|
| `expertPersonas` | Alle 3 Expert Personas |
| `expertCodingPrompt` | Prompt für spezifischen Expert (+ expertRole) |
| `consensusPrompt` | Moderator-Prompt für Consensus |
| `akihMethodology` | AKIH Framework Prompt + Weights |
| `quantumCoding` | Quantum Coding System Prompt |
| `allPrompts` | Alle Prompts (nur Premium) |

### Sicherheit

- Prompts sind nur für authentifizierte User zugänglich
- Trial und Premium User haben Zugriff
- `allPrompts` nur für Premium/Admin
- Prompts werden 5 Minuten gecached

### Struktur

```
supabase/
├── functions/
│   └── protected-prompts/
│       └── index.ts       # Edge Function mit geschützten Prompts
└── README.md              # Diese Datei
```
