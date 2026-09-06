/**
 * Shared AI assistant utility functions (safe for both Client & Server components)
 */

/**
 * Robust universal parser for suggested prompts.
 * Handles:
 * - Arrays of strings
 * - JSON string arrays like '["Who are Nizam Nawabs?","Show me the roster"]'
 * - Semicolon-delimited strings like "Who are Nizam Nawabs?;Show me the roster"
 * - Newline-delimited strings
 */
export function parseSuggestedPrompts(raw: unknown): string[] {
  if (!raw) return [];

  // If already an array
  if (Array.isArray(raw)) {
    return raw
      .map((item) => String(item).trim().replace(/^["']|["']$/g, ''))
      .filter((item) => item.length > 0 && !item.startsWith('[') && !item.startsWith('{'));
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // Check if it's a JSON array string
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => String(item).trim().replace(/^["']|["']$/g, ''))
            .filter((item) => item.length > 0 && !item.startsWith('[') && !item.startsWith('{'));
        }
      } catch {
        // Fall back to delimiter splitting below
      }
    }

    // Check for semicolon delimiter
    if (trimmed.includes(';')) {
      return trimmed
        .split(';')
        .map((p) => p.trim().replace(/^["'\[]+|["'\]]+$/g, ''))
        .filter((p) => p.length > 0 && !p.startsWith('[') && !p.startsWith('{'));
    }

    // Check for newline delimiter
    if (trimmed.includes('\n')) {
      return trimmed
        .split('\n')
        .map((p) => p.trim().replace(/^["'\[]+|["'\]]+$/g, ''))
        .filter((p) => p.length > 0 && !p.startsWith('[') && !p.startsWith('{'));
    }

    // Single prompt string
    const cleanPrompt = trimmed.replace(/^["'\[]+|["'\]]+$/g, '').trim();
    return cleanPrompt && !cleanPrompt.startsWith('[') && !cleanPrompt.startsWith('{')
      ? [cleanPrompt]
      : [];
  }

  return [];
}
