// src/Composables/useApplicationReport.ts
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import type { DriverApplicationForm, Applications } from '@/types'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import dayjs from 'dayjs'
import { capitalizeName } from '@/utils/utils'

export function useApplicationReport() {
  // Safe VFS initialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (pdfFonts && (pdfFonts as any).pdfMake) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs
  }

  function formatDate(date?: string): string {
    if (!date) return 'N/A'
    return dayjs(date).format('MM/DD/YYYY')
  }

  function formatBool(val: boolean): string {
    return val ? 'YES' : 'NO'
  }

  function generateApplicationReport(applicant: Applications & DriverApplicationForm) {
    const fullName = `${capitalizeName(applicant.personalInfo.firstName)} ${capitalizeName(
      applicant.personalInfo.lastName,
    )}`

    // Define styles
    const styles = {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 5], color: '#334155' },
      subHeader: { fontSize: 11, bold: true, margin: [0, 10, 0, 2], color: '#475569' },
      label: { fontSize: 9, bold: true, color: '#64748b' },
      value: { fontSize: 10, margin: [0, 0, 0, 5] },
      tableHeader: { fontSize: 9, bold: true, color: '#FFFFFF', fillColor: '#475569' },
      tableCell: { fontSize: 9, margin: [0, 2, 0, 2] },
      signature: { fontSize: 8, italics: true, color: '#059669', margin: [0, 2, 0, 0] },
    }

    // Prepare content

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] = []

    // Title
    content.push({
      text: 'Driver Application for Employment',
      style: 'header',
      alignment: 'center',
    })
    content.push({
      text: `Generated on ${dayjs().format('MM/DD/YYYY HH:mm')}`,
      alignment: 'center',
      fontSize: 8,
      margin: [0, 0, 0, 20],
      color: '#94a3b8',
    })

    // Personal Info Section
    content.push({ text: 'SECTION 1: PERSONAL INFORMATION', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
    })
    content.push({
      columns: [
        {
          width: '*',
          stack: [
            { text: 'Full Name', style: 'label' },
            { text: fullName, style: 'value' },
            { text: 'Phone', style: 'label' },
            { text: applicant.personalInfo.phone, style: 'value' },
          ],
        },
        {
          width: '*',
          stack: [
            { text: 'Date of Birth', style: 'label' },
            { text: formatDate(applicant.personalInfo.dob), style: 'value' },
            { text: 'Email', style: 'label' },
            { text: applicant.personalInfo.email, style: 'value' },
          ],
        },
        {
          width: '*',
          stack: [
            { text: 'SSN', style: 'label' },
            { text: applicant.personalInfo.ssnNumber || 'N/A', style: 'value' },
            { text: 'Date Applied', style: 'label' },
            { text: formatDate(applicant.appliedDate), style: 'value' },
          ],
        },
      ],
      columnGap: 10,
      margin: [0, 10, 0, 0],
    })

    // Address History
    content.push({ text: 'SECTION 2: ADDRESS HISTORY', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
      margin: [0, 0, 0, 10],
    })

    if (applicant.addresses && applicant.addresses.length > 0) {
      const addressBody = applicant.addresses.map((addr) => [
        { text: addr.street, style: 'tableCell' },
        { text: `${addr.city}, ${addr.state} ${addr.zip}`, style: 'tableCell' },
        { text: formatDate(addr.fromDate), style: 'tableCell' },
        { text: addr.present ? 'Present' : formatDate(addr.toDate), style: 'tableCell' },
      ])

      content.push({
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto'],
          body: [
            [
              { text: 'Street', style: 'tableHeader' },
              { text: 'City/State/Zip', style: 'tableHeader' },
              { text: 'From', style: 'tableHeader' },
              { text: 'To', style: 'tableHeader' },
            ],
            ...addressBody,
          ],
        },
        layout: 'lightHorizontalLines',
      })
    } else {
      content.push({
        text: 'No address history provided.',
        fontSize: 10,
        italics: true,
        color: '#94a3b8',
      })
    }

    // Employment History
    content.push({ text: 'SECTION 3: EMPLOYMENT HISTORY', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
      margin: [0, 0, 0, 10],
    })

    if (applicant.employmentHistory && applicant.employmentHistory.length > 0) {
      applicant.employmentHistory.forEach((emp) => {
        content.push({
          stack: [
            {
              columns: [
                { text: emp.companyName, bold: true, fontSize: 11 },
                {
                  text: `${formatDate(emp.fromDate)} - ${emp.present ? 'Present' : formatDate(emp.toDate)}`,
                  alignment: 'right',
                  fontSize: 10,
                  color: '#475569',
                },
              ],
            },
            {
              columns: [
                { text: `${emp.city}, ${emp.state}`, fontSize: 9, color: '#64748b' },
                {
                  text: `Position: ${emp.position}`,
                  alignment: 'right',
                  fontSize: 9,
                  color: '#64748b',
                },
              ],
            },
            {
              text: [
                { text: 'Reason for leaving: ', bold: true, fontSize: 9 },
                { text: emp.reasonForLeaving, fontSize: 9 },
              ],
              margin: [0, 2, 0, 0],
            },
            {
              text: [
                { text: 'Subject to FMCSRs? ', bold: true, fontSize: 9 },
                { text: 'Yes ', fontSize: 9 }, // Assuming yes for commercial driving per form context usually
                { text: '| CDL Required? ', bold: true, fontSize: 9 },
                { text: emp.wasCdl ? 'Yes' : 'No', fontSize: 9 },
              ],
              margin: [0, 2, 0, 10],
            },
          ],
          margin: [0, 0, 0, 5],
        })
      })
    } else {
      content.push({
        text: 'No employment history provided.',
        fontSize: 10,
        italics: true,
        color: '#94a3b8',
      })
    }

    // Driving Experience
    content.push({ text: 'SECTION 4: DRIVING EXPERIENCE', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
      margin: [0, 0, 0, 10],
    })

    // Licenses
    content.push({ text: 'Driver Licenses', style: 'subHeader' })
    if (applicant.licenses && applicant.licenses.length > 0) {
      const licBody = applicant.licenses.map((lic) => [
        { text: lic.state, style: 'tableCell' },
        { text: lic.number, style: 'tableCell' },
        { text: lic.class, style: 'tableCell' },
        { text: formatDate(lic.expirationDate), style: 'tableCell' },
      ])
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            [
              { text: 'State', style: 'tableHeader' },
              { text: 'License Number', style: 'tableHeader' },
              { text: 'Class', style: 'tableHeader' },
              { text: 'Expiration', style: 'tableHeader' },
            ],
            ...licBody,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      })
    } else {
      content.push({
        text: 'No licenses provided.',
        fontSize: 10,
        italics: true,
        color: '#94a3b8',
        margin: [0, 0, 0, 10],
      })
    }

    // Accidents
    content.push({ text: 'Accident Record (Last 3 Years)', style: 'subHeader' })
    if (applicant.accidents && applicant.accidents.length > 0) {
      const accBody = applicant.accidents.map((acc) => [
        { text: formatDate(acc.date), style: 'tableCell' },
        { text: acc.description, style: 'tableCell' },
        { text: acc.fatalities ? 'Yes' : 'No', style: 'tableCell' },
        { text: acc.injuries ? 'Yes' : 'No', style: 'tableCell' },
      ])
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            [
              { text: 'Date', style: 'tableHeader' },
              { text: 'Description', style: 'tableHeader' },
              { text: 'Fatalities', style: 'tableHeader' },
              { text: 'Injuries', style: 'tableHeader' },
            ],
            ...accBody,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      })
    } else {
      content.push({
        text: 'No accidents reported.',
        fontSize: 10,
        italics: true,
        color: '#94a3b8',
        margin: [0, 0, 0, 10],
      })
    }

    // Violations
    content.push({ text: 'Traffic Convictions (Last 3 Years)', style: 'subHeader' })
    if (applicant.violations && applicant.violations.length > 0) {
      const vioBody = applicant.violations.map((vio) => [
        { text: formatDate(vio.date), style: 'tableCell' },
        { text: vio.violation, style: 'tableCell' },
        { text: vio.location, style: 'tableCell' },
        { text: vio.penalty, style: 'tableCell' },
      ])
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            [
              { text: 'Date', style: 'tableHeader' },
              { text: 'Violation', style: 'tableHeader' },
              { text: 'Location', style: 'tableHeader' },
              { text: 'Penalty', style: 'tableHeader' },
            ],
            ...vioBody,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      })
    } else {
      content.push({
        text: 'No convictions reported.',
        fontSize: 10,
        italics: true,
        color: '#94a3b8',
        margin: [0, 0, 0, 10],
      })
    }

    // Legal
    content.push({ text: 'SECTION 5: LEGAL & BACKGROUND', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
      margin: [0, 0, 0, 10],
    })
    content.push({
      columns: [
        {
          width: '*',
          text: [
            { text: 'Have you ever been denied a license? ', bold: true, fontSize: 10 },
            {
              text: formatBool(applicant.deniedLicense),
              fontSize: 10,
              color: applicant.deniedLicense ? 'red' : 'green',
            },
          ],
        },
        {
          width: '*',
          text: [
            { text: 'Has your license ever been suspended? ', bold: true, fontSize: 10 },
            {
              text: formatBool(applicant.suspendedLicense),
              fontSize: 10,
              color: applicant.suspendedLicense ? 'red' : 'green',
            },
          ],
        },
      ],
    })
    if (applicant.denialSuspensionExplanation) {
      content.push({
        text: [
          { text: 'Explanation: ', bold: true },
          { text: applicant.denialSuspensionExplanation },
        ],
        fontSize: 10,
        margin: [0, 5, 0, 0],
        color: '#b91c1c',
      })
    }

    // Signatures
    content.push({ text: 'SECTION 6: SIGNATURES & CONSENTS', style: 'sectionHeader' })
    content.push({
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' }],
      margin: [0, 0, 0, 10],
    })

    const signatures = [
      {
        label: 'Drug & Alcohol Test Consent',
        sig: applicant.drugTestSignature,
        date: applicant.drugTestDate,
      },
      {
        label: 'PSP Disclosure',
        sig: applicant.pspDisclosureSignature,
        date: applicant.pspDisclosureDate,
      },
      {
        label: 'FMCSA Clearinghouse Consent',
        sig: applicant.fmcsaConsentSignature,
        date: applicant.fmcsaConsentDate,
      },
      {
        label: 'Authorization & Release',
        sig: applicant.authReleaseSignature,
        date: applicant.authReleaseDate,
      },
      {
        label: 'General Work Policy',
        sig: applicant.generalWorkPolicySignature,
        date: applicant.generalWorkPolicyDate,
      },
      {
        label: 'Fair Credit Reporting Act',
        sig: applicant.fairCreditReportingSignature,
        date: applicant.fairCreditReportingDate,
      },
    ]

    signatures.forEach((item) => {
      content.push({
        columns: [
          { width: '40%', text: item.label, fontSize: 10, bold: true },
          {
            width: '*',
            text: item.sig ? `Signed by: ${item.sig}` : 'Not Signed',
            style: 'signature',
            color: item.sig ? '#059669' : '#f97316',
          },
          {
            width: 'auto',
            text: item.sig ? formatDate(item.date) : '',
            fontSize: 9,
            alignment: 'right',
          },
        ],
        margin: [0, 5, 0, 0],
      })
    })

    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      content: content,
      styles: styles,
      defaultStyle: {
        font: 'Roboto',
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfMake as any)
      .createPdf(docDefinition as unknown as TDocumentDefinitions)
      .download(`Application_${fullName.replace(/\s+/g, '_')}.pdf`)
  }

  return {
    generateApplicationReport,
  }
}
