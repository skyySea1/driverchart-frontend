// src/Composables/useComplianceReport.ts
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import type { Driver, DocumentLog } from '@/types'
import dayjs from 'dayjs'

export function useComplianceReport() {
  // Ensure VFS is registered only when needed or once
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (pdfFonts && (pdfFonts as any).pdfMake) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs
  }
  function calculateAuditScore(complianceItems: { date?: string }[]): string {
    if (!complianceItems.length) return 'N/A'

    const validItems = complianceItems.filter(item => getStatus(item.date) === 'valid').length
    const totalItems = complianceItems.length
    const score = Math.round((validItems / totalItems) * 100)

    return `${score}%`
  }

  function getStatus(expiryDate?: string): string {
    if (!expiryDate) return 'missing'
    const today = dayjs()
    const exp = dayjs(expiryDate)
    const diff = exp.diff(today, 'day')

    if (diff < 0) return 'expired'
    if (diff <= 30) return 'warning'
    return 'valid'
  }

  function formatDate(date?: string): string {
    if (!date) return 'N/A'
    return dayjs(date).format('MM/DD/YYYY')
  }

  function generateComplianceReport(driver: Driver, documents: DocumentLog[]) {
    const complianceItems = [
      {
        label: 'License',
        date: driver.license?.expiryDate,
        doc: driver.license?.documentNumber,
      },
      {
        label: 'Medical Card',
        date: driver.medical?.expiryDate,
        doc: 'Registry: ' + (driver.medical?.registry || 'N/A'),
      },
      { label: 'MVR Check', date: driver.mvr?.expiryDate, doc: 'Annual Review' },
      { label: 'Drug & Alcohol', date: driver.drugAlcohol?.expiryDate, doc: 'Clearinghouse' },
    ]

    const auditScore = calculateAuditScore(complianceItems)

    // Prepare document content
    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Driver Compliance Report',
        style: 'header',
        alignment: 'center',
        margin: [0, 20, 0, 10],
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `Generated on ${dayjs().format('MM/DD/YYYY')} - Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          fontSize: 8,
          margin: [0, 10, 0, 0],
        }
      },
      content: [
        // Driver Information Section
        {
          text: 'Driver Information',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'Full Name:', bold: true },
                `${driver.firstName} ${driver.middleName || ''} ${driver.lastName}`.trim(),
              ],
              [
                { text: 'Hire Date:', bold: true },
                formatDate(driver.hireDate),
              ],
              [
                { text: 'Status:', bold: true },
                driver.hireStatus || 'N/A',
              ],
              [
                { text: 'Contact:', bold: true },
                `${driver.phone || 'N/A'} | ${driver.email || 'N/A'}`,
              ],
              [
                { text: 'Address:', bold: true },
                `${driver.address || ''} ${driver.city || ''} ${driver.state || ''} ${driver.zip || ''}`.trim() || 'N/A',
              ],
            ],
          },
          margin: [0, 0, 0, 20],
        },

        // Compliance Status Section
        {
          text: 'Compliance Status',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Document Type', style: 'tableHeader' },
                { text: 'Expiry Date', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'Reference', style: 'tableHeader' },
              ],
              ...complianceItems.map(item => [
                item.label,
                formatDate(item.date),
                {
                  text: getStatus(item.date).toUpperCase(),
                  color: getStatus(item.date) === 'valid' ? 'green' :
                         getStatus(item.date) === 'warning' ? 'orange' : 'red',
                  bold: true,
                },
                item.doc || 'N/A',
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },

        // Audit Score
        {
          text: `Overall Audit Score: ${auditScore}`,
          style: 'scoreText',
          margin: [0, 0, 0, 20],
        },

        // Document History Section
        {
          text: 'Document History',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Date', style: 'tableHeader' },
                { text: 'Action', style: 'tableHeader' },
                { text: 'User', style: 'tableHeader' },
              ],
              ...documents.slice(0, 10).map(doc => [
                formatDate(doc.date),
                `Uploaded ${doc.type} (${doc.fileName ? doc.fileName.split('/').pop() : 'Unknown File'})`,
                doc.user,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1f2937',
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#374151',
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: '#6b7280',
          fillColor: '#f9fafb',
        },
        scoreText: {
          fontSize: 12,
          bold: true,
          color: '#059669',
        },
      },
    }

    // Generate and download PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any).createPdf(docDefinition as any).download(`Compliance_Report_${driver.lastName}_${dayjs().format('YYYYMMDD')}.pdf`)
  }

  return {
    generateComplianceReport,
  }
}