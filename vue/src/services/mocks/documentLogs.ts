import type { DocumentLog } from '../../types'

export const mockDocumentLogs: DocumentLog[] = [
  {
    id: 'l1',
    date: '2024-03-01',
    fileName: 'medical_card_john.pdf',
    type: 'Medical Card',
    entityName: 'John Doe',
    user: 'henri'
  },
  {
    id: 'l2',
    date: '2024-03-02',
    fileName: 'annual_inspection_101.pdf',
    type: 'Annual Inspection',
    entityName: 'Bus 101',
    user: 'admin'
  },
  {
    id: 'l3',
    date: '2024-03-05',
    fileName: 'mvr_report_alice.pdf',
    type: 'MVR',
    entityName: 'Alice Smith',
    user: 'henri'
  },
  { 
    id: '1', 
    date: new Date().toISOString(), 
    fileName: 'cdl_ribeiro.pdf', 
    type: 'CDL', 
    entityName: 'Ribeiro, Manoel', 
    user: 'Admin' 
  }
]