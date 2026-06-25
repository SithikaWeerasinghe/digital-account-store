import { useState, Fragment, useEffect } from 'react';
import { Ticket } from '@/types/ticket';
import { formatDate } from '@/lib/utils';
import { MessageSquare, MoreVertical, Eye } from 'lucide-react';
import { replyToTicket } from '@/lib/api';

export default function TicketTable({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [replies, setReplies] = useState<Record<string, string>>({});
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, 'open' | 'in_progress' | 'resolved' | 'closed'>>({});
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>({});
  const [errorMsgs, setErrorMsgs] = useState<Record<string, string>>({});
  const [successMsgs, setSuccessMsgs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const handleSubmitReply = async (ticketId: string) => {
    const replyText = replies[ticketId]?.trim() || '';
    if (!replyText) {
      setErrorMsgs(prev => ({ ...prev, [ticketId]: 'Reply message is required.' }));
      return;
    }
    setErrorMsgs(prev => ({ ...prev, [ticketId]: '' }));
    setSuccessMsgs(prev => ({ ...prev, [ticketId]: false }));
    setSubmittingIds(prev => ({ ...prev, [ticketId]: true }));

    try {
      const status = selectedStatuses[ticketId] || 'resolved'; // defaults to Answered (resolved)
      const updated = await replyToTicket(ticketId, replyText, status);
      
      // Update local state list
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      
      // Reset input form and set success state
      setReplies(prev => ({ ...prev, [ticketId]: '' }));
      setSuccessMsgs(prev => ({ ...prev, [ticketId]: true }));
      setTimeout(() => {
        setSuccessMsgs(prev => ({ ...prev, [ticketId]: false }));
      }, 3500);
    } catch (err: any) {
      setErrorMsgs(prev => ({ ...prev, [ticketId]: err.message || 'Failed to submit reply.' }));
    } finally {
      setSubmittingIds(prev => ({ ...prev, [ticketId]: false }));
    }
  };

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
            {tickets.map((ticket) => {
              const isExpanded = expandedId === ticket.id;

              // Parse message text and optional embedded base64 screenshot data
              let messageText = ticket.message;
              let screenshotData: string | null = null;
              if (ticket.message && ticket.message.includes('\n\n---SCREENSHOT---\n')) {
                const parts = ticket.message.split('\n\n---SCREENSHOT---\n');
                messageText = parts[0] || '';
                screenshotData = parts[1] || null;
              }

              return (
                <Fragment key={ticket.id}>
                  <tr 
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0 ${isExpanded ? 'bg-slate-550/5 hover:bg-slate-50/70' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm mb-1">{ticket.subject}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        ID: tkt_{ticket.id.substring(0, 6)} • User: {ticket.userId}
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
                          ticket.status === 'open' ? 'bg-sky-500 animate-pulse' :
                          ticket.status === 'in_progress' ? 'bg-amber-500 animate-pulse' :
                          ticket.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-450'
                        }`} />
                        {ticket.status === 'resolved' ? 'Answered' : ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{formatDate(ticket.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : ticket.id); }}
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-[#009ee3] transition-all duration-200 cursor-pointer"
                          title="View Message"
                        >
                          <Eye size={14} className={isExpanded ? 'text-primary' : ''} />
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
                  {isExpanded && (
                    <tr className="bg-slate-50/30">
                      <td colSpan={5} className="px-8 py-6 border-b border-slate-200/50">
                        <div className="space-y-4 max-w-4xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">Customer Details</span>
                              <div className="text-slate-700 text-sm">
                                <span className="font-semibold text-slate-550">Name:</span> {ticket.name || 'Anonymous'} <br />
                                <span className="font-semibold text-slate-550">Email:</span> {ticket.userId}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">Issue Category</span>
                              <div className="text-slate-700 text-sm font-semibold uppercase tracking-wide">
                                {ticket.issueType || 'General Inquiry'}
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">Ticket Message</span>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm whitespace-pre-wrap leading-relaxed shadow-sm font-medium">
                              {messageText}
                            </div>
                          </div>

                          {screenshotData && (
                            <div>
                              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">Screenshot Proof</span>
                              <div className="mt-2">
                                <a 
                                  href={screenshotData} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()} // Prevent closing row when clicking link
                                  className="inline-block group relative rounded-xl overflow-hidden border border-slate-200 max-w-[350px] shadow-sm hover:shadow-md transition-all bg-white p-1 hover:border-primary/50"
                                >
                                  <img src={screenshotData} alt="Support proof" className="max-h-[220px] w-auto object-contain hover:scale-[1.01] transition-transform duration-300 rounded-lg" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black tracking-widest uppercase transition-opacity">
                                    View Full Size
                                  </div>
                                </a>
                              </div>
                            </div>
                          )}

                          {ticket.messages && ticket.messages.length > 0 && (
                            <div className="border-t border-slate-200/60 pt-4">
                              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                                Conversation ({ticket.messages.length} {ticket.messages.length === 1 ? 'reply' : 'replies'})
                              </span>
                              <div className="space-y-2">
                                {ticket.messages.map((m, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-xl border text-slate-800 text-sm whitespace-pre-wrap leading-relaxed shadow-sm font-medium ${
                                      m.sender === 'admin' ? 'bg-sky-550/5 border-sky-100' : 'bg-white border-slate-200'
                                    }`}
                                  >
                                    <div
                                      className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-1.5 ${
                                        m.sender === 'admin' ? 'text-sky-600' : 'text-slate-400'
                                      }`}
                                    >
                                      {m.sender === 'admin' ? 'Support' : ticket.name || 'Customer'}
                                      {m.at ? ` · ${formatDate(m.at)}` : ''}
                                    </div>
                                    {m.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-slate-200/60 pt-6 space-y-4">
                            <h4 className="text-xs font-black font-heading tracking-widest uppercase text-text-primary flex items-center gap-1.5">
                              <MessageSquare size={14} className="text-primary" /> Reply to Ticket
                            </h4>
                            
                            {errorMsgs[ticket.id] && (
                              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                                {errorMsgs[ticket.id]}
                              </div>
                            )}

                            {successMsgs[ticket.id] && (
                              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                                Reply submitted successfully and customer notified by email!
                              </div>
                            )}

                            <div className="space-y-3.5">
                              <div>
                                <label className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1.5">Reply Message</label>
                                <textarea
                                  rows={4}
                                  value={replies[ticket.id] || ''}
                                  onChange={(e) => setReplies(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                  placeholder="Type your response to the customer here..."
                                  className="w-full px-4 py-3 rounded-xl border border-slate-250 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-350"
                                />
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <label className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Update Status:</label>
                                  <select
                                    value={selectedStatuses[ticket.id] || ticket.status}
                                    onChange={(e) => setSelectedStatuses(prev => ({ ...prev, [ticket.id]: e.target.value as any }))}
                                    className="px-3.5 py-2 rounded-xl border border-slate-250 bg-white text-slate-800 text-xs font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer select-none"
                                  >
                                    <option value="open">Open</option>
                                    <option value="resolved">Answered</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSubmitReply(ticket.id)}
                                  disabled={submittingIds[ticket.id]}
                                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-black font-heading tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center min-w-[140px]"
                                >
                                  {submittingIds[ticket.id] ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : 'Send Reply'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
