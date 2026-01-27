// src/Composables/useDriverListReport.ts
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import type { DriverRow } from '@/types'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import dayjs from 'dayjs'
import { capitalizeName } from '@/utils/utils'

export function useDriverListReport() {
  // Safe VFS initialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (pdfFonts && (pdfFonts as any).pdfMake) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs
  }
  function formatDate(date?: string): string {
    if (!date) return '-'
    return dayjs(date).format('MM/DD/YYYY')
  }

  function generateDriverListReport(drivers: DriverRow[]) {
    // Prepare document content
    const docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Driver List Report',
        style: 'header',
        alignment: 'center',
        margin: [0, 20, 0, 10],
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Generated on ${dayjs().format('MM/DD/YYYY')} - Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          fontSize: 8,
          margin: [0, 10, 0, 0],
        }
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              // Header Row
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'License No.', style: 'tableHeader' },
                { text: 'License Exp', style: 'tableHeader' },
                { text: 'Medical Exp', style: 'tableHeader' },
                { text: 'MVR Date', style: 'tableHeader' },
                { text: 'Phone', style: 'tableHeader' },
              ],
              // Data Rows
              ...drivers.map((driver) => [
                {
                  text: `${capitalizeName(driver.firstName)} ${capitalizeName(driver.lastName)}`,
                  style: 'tableCell',
                },
                { text: driver.hireStatus || 'N/A', style: 'tableCell' },
                {
                  text: `${driver.license?.documentNumber || '-'} ${driver.license?.state ? `(${driver.license?.state})` : ''}`,
                  style: 'tableCell',
                },
                { text: formatDate(driver.license?.expiryDate), style: 'tableCell' },
                { text: formatDate(driver.medical?.expiryDate), style: 'tableCell' },
                { text: formatDate(driver.mvr?.expiryDate), style: 'tableCell' },
                { text: driver.phone || '-', style: 'tableCell' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          text: `Total Drivers: ${drivers.length}`,
          style: 'footerText',
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1f2937',
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: '#ffffff',
          fillColor: '#4f46e5', // Indigo-600
          margin: [0, 5, 0, 5],
        },
        tableCell: {
          fontSize: 9,
          color: '#374151',
          margin: [0, 5, 0, 5],
        },
        footerText: {
          fontSize: 10,
          bold: true,
          color: '#6b7280',
        },
      },
    }

    // Generate and download PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any)
      .createPdf(docDefinition as unknown as TDocumentDefinitions)
      .download(`Driver_List_Report_${dayjs().format('YYYYMMDD')}.pdf`)
  }

  return {
    generateDriverListReport,
  }
}
