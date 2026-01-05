import type { HireStatusType } from '../types';

export function getHireStatusColor(status: HireStatusType) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 border-green-500 text-green-800'
    case 'Terminated':
      return 'bg-red-100 border-red-500 text-red-700'
    case 'Rehired':
      return 'bg-blue-50 border-blue-500 text-blue-700'
    case 'On Leave':
      return 'bg-purple-50 border-purple-500 text-purple-700'
    default:
      return 'bg-slate-50 border-slate-300 text-slate-700'
  }
}
