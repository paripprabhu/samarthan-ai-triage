import OpenAI from 'openai'
import { SupportedLanguage } from './i18n/languages'

/**
 * Script-neutral prompt for Whisper ASR.
 * NEVER include Malayalam, Telugu, Hindi, or other vernacular scripts in a global prompt.
 * Whisper conditions its output token probabilities on prompt tokens; including vernacular
 * scripts forces cross-script hallucinations (e.g. transcribing Hindi phonetics into Malayalam characters).
 */
export const NEUTRAL_WHISPER_PROMPT =
  'Cybercrime incident report in India. National Cyber Crime Reporting Portal 1930, bank fraud, UPI transaction, UTR number, OTP scam, unauthorized debit, cyber helpline.'

export interface NormalizedSpeechResult {
  detectedLanguage: SupportedLanguage
  cleanedTranscript: string
  confidence: number
}

/**
 * Validates and normalizes Indian speech transcripts from Whisper ASR.
 * Handles Perso-Arabic Hindustani transcription, Dravidian phonetic overlap,
 * and recovers clean native scripts for Hindi, Malayalam, Telugu, etc.
 */
export async function normalizeSpeechTranscript(
  rawTranscript: string,
  openai: OpenAI
): Promise<NormalizedSpeechResult> {
  const trimmed = rawTranscript.trim()
  if (!trimmed) {
    return { detectedLanguage: 'en', cleanedTranscript: '', confidence: 1.0 }
  }

  // Quick check: if pure English ASCII without Indic/Perso-Arabic characters, return immediately
  const hasNonAscii = /[\u0600-\u06FF\u0900-\u0D7F]/.test(trimmed)
  if (!hasNonAscii && /^[a-zA-Z0-9\s.,!?'"()#@%&*\-_/:\\]+$/.test(trimmed)) {
    return { detectedLanguage: 'en', cleanedTranscript: trimmed, confidence: 0.99 }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are an expert AI Indian speech transcript normalizer for cybercrime triage.
ASR models (like Whisper) frequently transcribe Indian speech with script mismatch:
- Spoken Hindi/Hindustani is often transcribed in Perso-Arabic/Urdu script (e.g., 'میرا نام', 'روپے', 'بینک') or mixed Devanagari. If the spoken language is Hindi, return detectedLanguage 'hi' and write the cleanedTranscript in pure Devanagari Hindi.
- Spoken Malayalam is sometimes transcribed into Tamil glyphs or broken Malayalam. If spoken in Malayalam, return detectedLanguage 'ml' and write cleanedTranscript in clean Malayalam script.
- Spoken Telugu is sometimes transcribed into Tamil glyphs. If spoken in Telugu, return detectedLanguage 'te' and write cleanedTranscript in clean Telugu script.
- Spoken Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi, Odia, or English should be cleaned into their native script.

Return strict JSON:
{
  "detectedLanguage": "hi" | "en" | "ml" | "te" | "ta" | "kn" | "mr" | "bn" | "gu" | "pa" | "ur" | "or",
  "cleanedTranscript": "cleaned sentence in native script",
  "confidence": number
}`
        },
        { role: 'user', content: trimmed }
      ],
      response_format: { type: 'json_object' }
    })

    const parsed = JSON.parse(response.choices[0].message.content || '{}')
    if (parsed.cleanedTranscript && typeof parsed.confidence === 'number' && parsed.confidence >= 0.6) {
      return {
        detectedLanguage: (parsed.detectedLanguage as SupportedLanguage) || 'hi',
        cleanedTranscript: String(parsed.cleanedTranscript).trim(),
        confidence: parsed.confidence
      }
    }
  } catch (err: any) {
    console.warn('[speech-normalizer] Error normalizing transcript:', err?.message)
  }

  // Fallback: if text has Devanagari or Perso-Arabic, treat as Hindi
  if (/[\u0600-\u06FF\u0900-\u097F]/.test(trimmed)) {
    return { detectedLanguage: 'hi', cleanedTranscript: trimmed, confidence: 0.7 }
  }
  if (/[\u0D00-\u0D7F]/.test(trimmed)) {
    return { detectedLanguage: 'ml', cleanedTranscript: trimmed, confidence: 0.7 }
  }
  if (/[\u0C00-\u0C7F]/.test(trimmed)) {
    return { detectedLanguage: 'te', cleanedTranscript: trimmed, confidence: 0.7 }
  }

  return { detectedLanguage: 'en', cleanedTranscript: trimmed, confidence: 0.5 }
}
