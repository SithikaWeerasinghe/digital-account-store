import { Ticket } from '@/types/ticket';
import { formatDate } from '@/lib/utils';
import { MessageSquare, MoreVertical } from 'lucide-react';

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-text-secondary font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Ticket</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary mb-1">{ticket.subject}</div>
                  <div className="text-xs text-text-muted">ID: {ticket.id} • User: {ticket.userId.substring(0, 5)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{formatDate(ticket.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-text-muted hover:text-primary transition-colors"><MessageSquare size={16} /></button>
                    <button className="p-1.5 text-text-muted hover:text-text-primary transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
