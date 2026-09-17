import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Buffer } from 'node:buffer'
import { isSupportedLanguage } from '@/lib/i18n/languages'
import { getSafeWhisperLanguageHint, NEUTRAL_WHISPER_PROMPT, normalizeSpeechTranscript } from '@/lib/speech-normalizer'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_CHUNK_BYTES = 8 * 1024 * 1024

function emptyCaption(selectedLanguage = 'en', languageMode: 'auto' | 'manual' = 'auto') {
  return {
    text: '',
    detectedLanguage: languageMode === 'manual' && isSupportedLanguage(selectedLanguage) ? selectedLanguage : null,
    recognizedLanguage: null,
    languageConfidence: 0,
    languageDecision: 'uncertain' as const,
    languageSource: 'selection' as const,
    isMixedLanguage: false,
  }
}

// Transcribes a short (~4s) audio chunk for live captioning during recording.
// It returns a stable language decision alongside text. The full recording is
// transcribed only once later by /api/triage; these preview calls never replace it.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null
    const selectedLanguageValue = String(formData.get('language') || 'en').toLowerCase()
    const selectedLanguage = isSupportedLanguage(selectedLanguageValue) ? selectedLanguageValue : 'en'
    // Existing integrations that send a language but no mode retain their
    // historical explicit-selection behavior. The recorder opts into auto.
    const languageMode = formData.get('languageMode') === 'auto' ? 'auto' : 'manual'
    const detectedHintValue = String(formData.get('detectedLanguage') || '').toLowerCase()
    const detectedHint = isSupportedLanguage(detectedHintValue) ? detectedHintValue : null

    if (!audioFile || audioFile.size === 0 || audioFile.size > MAX_CHUNK_BYTES) {
      return NextResponse.json(emptyCaption(selectedLanguage, languageMode))
    }
    if (audioFile.type && !audioFile.type.startsWith('audio/')) {
      return NextResponse.json(emptyCaption(selectedLanguage, languageMode))
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(emptyCaption(selectedLanguage, languageMode))
    }

    const openai = new OpenAI({ apiKey })
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    const fileObj = new File([buffer], audioFile.name || 'chunk.webm', { type: audioFile.type || 'audio/webm' })

    // Never force an ASR language for first-pass automatic detection. After a
    // confirmed result, the recorder may send it back as a latency/accuracy hint.
    const whisperLanguage = getSafeWhisperLanguageHint(
      languageMode === 'manual' ? selectedLanguage : detectedHint
    )

    const transcription = await openai.audio.transcriptions.create({
      file: fileObj,
      model: 'whisper-1',
      response_format: 'verbose_json',
      ...(whisperLanguage ? { language: whisperLanguage } : {}),
      prompt: NEUTRAL_WHISPER_PROMPT,
    })
    const rawText = transcription.text?.trim() || ''
    const normalized = await normalizeSpeechTranscript(rawText, openai, {
      asrLanguage: transcription.language,
      selectedLanguage,
      languageMode,
      allowModelNormalization: false,
    })

    return NextResponse.json({
      text: normalized.cleanedTranscript,
      detectedLanguage: normalized.decision === 'confirmed' || normalized.decision === 'manual'
        ? normalized.detectedLanguage
        : null,
      recognizedLanguage: normalized.recognizedLanguage,
      languageConfidence: normalized.confidence,
      languageDecision: normalized.decision,
      languageSource: normalized.source,
      isMixedLanguage: normalized.isMixed,
    })
  } catch (err: any) {
    console.warn('[transcribe-chunk] failed:', err?.message)
    return NextResponse.json(emptyCaption())
  }
}
