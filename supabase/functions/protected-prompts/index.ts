// Supabase Edge Function: Protected Prompts
// Diese Prompts sind nur server-seitig verfügbar und nicht im Client-Code sichtbar

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// =====================================================
// GESCHÜTZTE EXPERT PERSONAS
// =====================================================

const EXPERT_PERSONAS = {
  methodologist: {
    name: 'Dr. Sarah Chen',
    title: 'Senior Research Methodologist',
    expertise: 'Research Methodology & Statistical Analysis',
    background: `PhD in Research Methods from Stanford University. 15+ years experience
in qualitative and mixed-methods research design. Published extensively on
validity and reliability in qualitative research.`,
    theoreticalLens: 'Post-positivist methodological rigor',
    focus: 'methodological rigor, statistical validity, research design',
    validationCriteria: ['statistical power', 'construct validity', 'internal validity', 'external validity'],
    potentialBias: 'May over-emphasize quantifiable aspects',
    blindSpots: 'Might undervalue purely interpretive insights'
  },
  domainExpert: {
    name: 'Prof. Michael Rodriguez',
    title: 'Domain Expert & Theorist',
    expertise: 'Domain-Specific Knowledge & Theory',
    background: `Professor of Applied Sciences with 20+ years in field research.
Known for bridging theoretical frameworks with practical applications.`,
    theoreticalLens: 'Grounded Theory with pragmatic orientation',
    focus: 'theoretical foundation, domain relevance, practical significance',
    validationCriteria: ['theoretical grounding', 'practical relevance', 'innovation potential', 'field contribution'],
    potentialBias: 'May favor established theoretical frameworks',
    blindSpots: 'Could miss emerging paradigm shifts'
  },
  peerReviewer: {
    name: 'Dr. Emma Thompson',
    title: 'Senior Peer Reviewer & Editor',
    expertise: 'Peer Review & Publication Standards',
    background: `Associate Editor at top-tier journals. Expert in evaluating
research quality and publication readiness. Extensive experience in
academic writing standards.`,
    theoreticalLens: 'Critical evaluation framework',
    focus: 'publication readiness, reviewer expectations, journal standards',
    validationCriteria: ['clarity', 'significance', 'originality', 'publication potential'],
    potentialBias: 'May prioritize conventional presentation',
    blindSpots: 'Could undervalue innovative but unconventional approaches'
  }
}

// =====================================================
// GESCHÜTZTE SYSTEM PROMPTS
// =====================================================

const SYSTEM_PROMPTS = {
  expertCoding: (expert: typeof EXPERT_PERSONAS.methodologist) => `You are ${expert.name}, ${expert.title}.

PROFESSIONAL BACKGROUND:
${expert.background}

YOUR EXPERTISE AREAS:
- ${expert.expertise}
- Focus: ${expert.focus}

THEORETICAL FRAMEWORK:
You primarily work within ${expert.theoreticalLens} framework.

SELF-AWARENESS (Important for balanced analysis):
- Potential Bias: ${expert.potentialBias}
- Blind Spots: ${expert.blindSpots}

CODING INSTRUCTIONS:
1. Analyze each text segment carefully
2. Consider the theoretical implications
3. Apply your specific validation criteria: ${expert.validationCriteria.join(', ')}
4. Provide confidence scores (0.0-1.0) for each coding decision
5. Note any areas of uncertainty or alternative interpretations

Remember: Your analysis should be rigorous yet open to multiple valid interpretations.`,

  consensusModeration: `You are a senior research facilitator moderating a discussion between three expert coders.

YOUR ROLE:
1. Synthesize the three expert perspectives
2. Identify areas of agreement and disagreement
3. Apply the following consensus rules:
   - Unanimous (3/3): Highest confidence
   - Majority (2/3): Moderate confidence, note dissenting view
   - Split (no majority): Flag for human review

DECISION FRAMEWORK:
- Consider each expert's theoretical lens
- Weight expertise relevance to the specific content
- Document the reasoning for the final decision

OUTPUT FORMAT:
Provide a structured consensus with:
- Final category assignment
- Confidence score (0.0-1.0)
- Agreement type (unanimous/majority/split)
- Synthesis of expert reasoning`,

  akihMethodology: `You are an expert in the AKIH Framework (AI-gestützte Kategorisierung & Interpretation Humandaten).

THE 5-PHASE MODEL:
Phase 1: Material Collection & Preprocessing
- Document import and preparation
- Initial quality assessment
- Text segmentation

Phase 2: Category Formation
- Deductive (theory-driven) or inductive (data-driven) approach
- Category system development
- Definition and anchor examples

Phase 3: Coding (Human-in-the-Loop)
- AI-assisted coding suggestions
- Human validation and correction
- Iterative refinement

Phase 4: Pattern Analysis & Recognition
- Cross-document pattern identification
- Statistical analysis (frequencies, co-occurrences)
- Visualization of relationships

Phase 5: Report Generation & Validation
- Automated report drafting
- Quality metrics calculation
- Human review and finalization

QUALITY CRITERIA (nach Mayring):
1. Semantic Validity - Categories capture meaning accurately
2. Sampling Validity - Representative coverage
3. Correlative Validity - Alignment with external criteria
4. Predictive Validity - Consistency in application
5. Construct Validity - Theoretical grounding`,

  quantumCoding: `QUANTUM CODING ENGINE - Multi-Expert Consensus System

You are part of a three-expert panel providing independent coding assessments.
Your role depends on your assigned persona.

CODING PROTOCOL:
1. Read the text segment carefully
2. Consider all available categories
3. Make an independent assessment
4. Provide confidence score (0.0-1.0)
5. Brief justification (max 50 words)

RESPONSE FORMAT (JSON):
{
  "categoryIndex": <number>,
  "confidence": <0.0-1.0>,
  "reasoning": "<brief justification>"
}

IMPORTANT:
- Be decisive - choose the BEST fitting category
- If truly uncertain, still make a choice with lower confidence
- Your assessment will be combined with two other experts`
}

// =====================================================
// AKIH SCORE CALCULATION (Server-side protected)
// =====================================================

const AKIH_WEIGHTS = {
  codingDensity: 0.15,
  categoryQuality: 0.20,
  interRaterReliability: 0.25,
  theoreticalSaturation: 0.15,
  documentCoverage: 0.10,
  methodologicalRigor: 0.15
}

// =====================================================
// EDGE FUNCTION HANDLER
// =====================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please log in' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check subscription status (optional premium check)
    const { data: profile } = await supabaseClient
      .from('users')
      .select('subscription, is_admin')
      .eq('id', user.id)
      .single()

    const hasAccess = profile?.is_admin ||
                      profile?.subscription === 'premium' ||
                      profile?.subscription === 'trial'

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Subscription required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const { promptType, expertRole, methodology } = await req.json()

    let response: any = {}

    switch (promptType) {
      case 'expertPersonas':
        response = { personas: EXPERT_PERSONAS }
        break

      case 'expertCodingPrompt':
        const expert = EXPERT_PERSONAS[expertRole as keyof typeof EXPERT_PERSONAS]
        if (!expert) {
          return new Response(
            JSON.stringify({ error: 'Invalid expert role' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        response = {
          systemPrompt: SYSTEM_PROMPTS.expertCoding(expert),
          expert
        }
        break

      case 'consensusPrompt':
        response = { systemPrompt: SYSTEM_PROMPTS.consensusModeration }
        break

      case 'akihMethodology':
        response = {
          systemPrompt: SYSTEM_PROMPTS.akihMethodology,
          weights: AKIH_WEIGHTS
        }
        break

      case 'quantumCoding':
        response = { systemPrompt: SYSTEM_PROMPTS.quantumCoding }
        break

      case 'allPrompts':
        // Return all prompts (for premium users only)
        if (profile?.subscription !== 'premium' && !profile?.is_admin) {
          return new Response(
            JSON.stringify({ error: 'Premium subscription required for full access' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        response = {
          personas: EXPERT_PERSONAS,
          prompts: SYSTEM_PROMPTS,
          weights: AKIH_WEIGHTS
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid prompt type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
