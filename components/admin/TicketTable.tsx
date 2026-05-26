import { Ticket } from '@/types/ticket';
import { formatDate } from '@/lib/utils';
import { MessageSquare, MoreVertical } from 'lucide-react';

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'closed': return 'bg-slate-100/70 text-slate-500 border border-slate-200';
      default: return 'bg-slate-100/70 text-slate-500 border border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-rose-700 bg-rose-50 border border-rose-200';
      case 'high': return 'text-orange-700 bg-orange-50 border border-orange-200';
      case 'medium': return 'text-sky-700 bg-sky-50 border border-sky-200';
      case 'low': return 'text-slate-500 bg-slate-100/80 border border-slate-200';
      default: return 'text-slate-500 bg-slate-100/80 border border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] tracking-widest uppercase border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4.5">Ticket Subject & details</th>
              <th className="px-6 py-4.5">Priority</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5">Created Date</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm mb-1">{ticket.subject}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    ID: tkt_{ticket.id.substring(0, 6)} • User: usr_{ticket.userId.substring(0, 6)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ticket.status === 'open' ? 'bg-sky-550 animate-pulse' :
                      ticket.status === 'in_progress' ? 'bg-amber-500 animate-pulse' :
                      ticket.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-450'
                    }`} />
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{formatDate(ticket.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-[#009ee3] transition-all duration-200 cursor-pointer"
                      title="Open chat"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button 
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-slate-700 transition-all duration-200 cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical size={14} />
                    </button>
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
