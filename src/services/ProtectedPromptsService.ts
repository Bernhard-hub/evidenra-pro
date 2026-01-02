/**
 * PROTECTED PROMPTS SERVICE
 * =========================
 * Ruft geschützte Prompts vom Supabase Edge Function Server ab.
 * Die Prompts sind NICHT im Client-Code sichtbar!
 */

import { supabase } from '../renderer/services/supabase';

// Types
export interface ExpertPersona {
  name: string;
  title: string;
  expertise: string;
  background: string;
  theoreticalLens: string;
  focus: string;
  validationCriteria: string[];
  potentialBias: string;
  blindSpots: string;
}

export interface ExpertPersonas {
  methodologist: ExpertPersona;
  domainExpert: ExpertPersona;
  peerReviewer: ExpertPersona;
}

export interface ProtectedPromptResponse {
  systemPrompt?: string;
  expert?: ExpertPersona;
  personas?: ExpertPersonas;
  weights?: Record<string, number>;
  error?: string;
}

// Cache for prompts (to avoid repeated API calls)
const promptCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Service zum Abrufen geschützter Prompts vom Server
 */
export class ProtectedPromptsService {
  private static supabaseUrl = 'https://zvkoulhziksfxnxkkrmb.supabase.co';
  private static functionName = 'protected-prompts';

  /**
   * Ruft die Edge Function auf
   */
  private static async callEdgeFunction(
    promptType: string,
    options: Record<string, string> = {}
  ): Promise<ProtectedPromptResponse> {
    const cacheKey = `${promptType}_${JSON.stringify(options)}`;

    // Check cache
    const cached = promptCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[ProtectedPrompts] Using cached prompt:', promptType);
      return cached.data;
    }

    try {
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn('[ProtectedPrompts] No session - user not logged in');
        return { error: 'Not authenticated' };
      }

      const response = await fetch(
        `${this.supabaseUrl}/functions/v1/${this.functionName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': session.access_token
          },
          body: JSON.stringify({
            promptType,
            ...options
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[ProtectedPrompts] Error:', errorData);
        return { error: errorData.error || 'Request failed' };
      }

      const data = await response.json();

      // Cache the result
      promptCache.set(cacheKey, { data, timestamp: Date.now() });

      console.log('[ProtectedPrompts] Fetched:', promptType);
      return data;

    } catch (error: any) {
      console.error('[ProtectedPrompts] Fetch error:', error);
      return { error: error.message || 'Network error' };
    }
  }

  /**
   * Holt alle Expert Personas
   */
  static async getExpertPersonas(): Promise<ExpertPersonas | null> {
    const response = await this.callEdgeFunction('expertPersonas');
    if (response.error || !response.personas) {
      console.error('[ProtectedPrompts] Failed to get personas:', response.error);
      return null;
    }
    return response.personas;
  }

  /**
   * Holt den Coding-Prompt für einen spezifischen Experten
   */
  static async getExpertCodingPrompt(
    expertRole: 'methodologist' | 'domainExpert' | 'peerReviewer'
  ): Promise<{ systemPrompt: string; expert: ExpertPersona } | null> {
    const response = await this.callEdgeFunction('expertCodingPrompt', { expertRole });
    if (response.error || !response.systemPrompt) {
      console.error('[ProtectedPrompts] Failed to get expert prompt:', response.error);
      return null;
    }
    return {
      systemPrompt: response.systemPrompt,
      expert: response.expert!
    };
  }

  /**
   * Holt den Consensus-Moderator Prompt
   */
  static async getConsensusPrompt(): Promise<string | null> {
    const response = await this.callEdgeFunction('consensusPrompt');
    if (response.error || !response.systemPrompt) {
      console.error('[ProtectedPrompts] Failed to get consensus prompt:', response.error);
      return null;
    }
    return response.systemPrompt;
  }

  /**
   * Holt den AKIH Methodologie Prompt und Weights
   */
  static async getAKIHMethodology(): Promise<{
    systemPrompt: string;
    weights: Record<string, number>;
  } | null> {
    const response = await this.callEdgeFunction('akihMethodology');
    if (response.error || !response.systemPrompt) {
      console.error('[ProtectedPrompts] Failed to get AKIH prompt:', response.error);
      return null;
    }
    return {
      systemPrompt: response.systemPrompt,
      weights: response.weights || {}
    };
  }

  /**
   * Holt den Quantum Coding Prompt
   */
  static async getQuantumCodingPrompt(): Promise<string | null> {
    const response = await this.callEdgeFunction('quantumCoding');
    if (response.error || !response.systemPrompt) {
      console.error('[ProtectedPrompts] Failed to get quantum prompt:', response.error);
      return null;
    }
    return response.systemPrompt;
  }

  /**
   * Prüft ob der User Zugriff auf geschützte Prompts hat
   */
  static async checkAccess(): Promise<boolean> {
    const response = await this.callEdgeFunction('expertPersonas');
    return !response.error;
  }

  /**
   * Leert den Prompt-Cache
   */
  static clearCache(): void {
    promptCache.clear();
    console.log('[ProtectedPrompts] Cache cleared');
  }
}

// Singleton export
export const protectedPrompts = ProtectedPromptsService;
export default ProtectedPromptsService;
