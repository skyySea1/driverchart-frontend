import { PDFDocument, PDFForm, PDFTextField } from 'pdf-lib'
import type { Driver } from '@/types'

export function useW9PdfFiller() {
  /**
   * Fill W-9 PDF with driver data
   */
  async function fillW9Pdf(driver: Driver): Promise<Blob> {
    try {
      // Load the PDF template
      const pdfUrl = '/W-9.pdf'
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer())
      
      // Load PDF document
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const form = pdfDoc.getForm()
      
      // Get all form fields to inspect their names
      const fields = form.getFields()
      console.log('Available PDF form fields:', fields.map(f => f.getName()))
      
      // Fill form fields (adjust field names based on actual PDF)
      // Common W-9 field names - these may need adjustment based on actual PDF
      try {
        fillTextField(form, 'topmostSubform[0].Page1[0].f1_1[0]', getFullName(driver))
        fillTextField(form, 'topmostSubform[0].Page1[0].f1_2[0]', driver.businessName || '')
        fillTextField(form, 'topmostSubform[0].Page1[0].Address[0]', driver.address || '')
        fillTextField(form, 'topmostSubform[0].Page1[0].City[0]', `${driver.city || ''}, ${driver.state || ''} ${driver.zip || ''}`)
        
        // Tax classification checkboxes
        if (driver.taxClassification) {
          const classification = driver.taxClassification.toLowerCase()
          if (classification.includes('individual')) {
            form.getCheckBox('topmostSubform[0].Page1[0].c1_1[0]')?.check()
          } else if (classification.includes('c corp')) {
            form.getCheckBox('topmostSubform[0].Page1[0].c1_1[1]')?.check()
          } else if (classification.includes('s corp')) {
            form.getCheckBox('topmostSubform[0].Page1[0].c1_1[2]')?.check()
          } else if (classification.includes('partnership')) {
            form.getCheckBox('topmostSubform[0].Page1[0].c1_1[3]')?.check()
          } else if (classification.includes('llc')) {
            form.getCheckBox('topmostSubform[0].Page1[0].c1_1[5]')?.check()
          }
        }
        
        // SSN/EIN (format: XXX-XX-XXXX)
        if (driver.ssnNumber) {
          const formatted = formatSSN(driver.ssnNumber)
          fillTextField(form, 'topmostSubform[0].Page1[0].social[0]', formatted)
        }
        
      } catch (fieldError) {
        console.warn('Some fields could not be filled:', fieldError)
        // Continue even if some fields fail
      }
      
      // Flatten form to make it read-only
      form.flatten()
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      return new Blob([pdfBytes], { type: 'application/pdf' })
      
    } catch (error) {
      console.error('Error filling W-9 PDF:', error)
      throw new Error('Failed to generate W-9 PDF')
    }
  }
  
  /**
   * Helper to safely fill text field
   */
  function fillTextField(form: PDFForm, fieldName: string, value: string) {
    try {
      const field = form.getTextField(fieldName)
      field.setText(value)
    } catch (e) {
      console.warn(`Field "${fieldName}" not found or not a text field`)
    }
  }
  
  /**
   * Get full name from driver
   */
  function getFullName(driver: Driver): string {
    const parts = [
      driver.firstName,
      driver.middleName,
      driver.lastName
    ].filter(Boolean)
    return parts.join(' ').toUpperCase()
  }
  
  /**
   * Format SSN as XXX-XX-XXXX
   */
  function formatSSN(ssn: string): string {
    const digits = ssn.replace(/\D/g, '')
    if (digits.length === 9) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
    }
    return ssn
  }
  
  /**
   * Download PDF blob
   */
  function downloadPdf(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }
  
  /**
   * Create object URL from blob for display
   */
  function createPdfUrl(blob: Blob): string {
    return URL.createObjectURL(blob)
  }
  
  return {
    fillW9Pdf,
    downloadPdf,
    createPdfUrl
  }
}
