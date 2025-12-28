import { GoogleGenAI } from '@google/genai'
import type { Driver } from '@/types'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const getAIClient = () => {
  if (!apiKey) {
    console.warn('API_KEY not found in environment variables.')
    return null
  }
  return new GoogleGenAI({ apiKey })
}

export const askRegulatoryAssistant = async (question: string): Promise<string> => {
  const ai = getAIClient()
  if (!ai) return 'AI Service Unavailable: Missing API Key.'

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert consultant for US DOT (Department of Transportation) and FMCSA regulations for Charter Bus companies.
      Answer the following question accurately, citing specific regulations (e.g., 49 CFR Part 391) where possible. Keep it concise.

      Question: ${question}`,
    })
    return response.text || 'No response generated.'
  } catch (error) {
    console.error('Gemini Error:', error)
    return 'Error connecting to AI regulatory assistant.'
  }
}

export const auditDriverRisk = async (driver: Driver): Promise<string> => {
  const ai = getAIClient()
  if (!ai) return 'AI Service Unavailable: Missing API Key.'

  const currentDate = new Date().toISOString().split('T')[0]
  const driverData = JSON.stringify(driver, null, 2)

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Perform a compliance risk audit for this commercial driver based on FMCSA regulations (49 CFR Part 391).
      Current Date: ${currentDate}

      Driver Data:
      ${driverData}

      Identify:
      1. Expired documents.
      2. Documents expiring within 30 days.
      3. Missing files (if 'file' property is empty/undefined).
      4. Provide a risk assessment (Low/Medium/High) and recommended actions.

      Format as Markdown.`,
    })
    return response.text || 'Audit generation failed.'
  } catch (error) {
    console.error('Gemini Error:', error)
    return 'Error performing AI audit.'
  }
}
