import TicketTable from '@/components/admin/TicketTable';

export default function AdminTicketsPage() {
  const mockTickets = [
    { id: 'TKT-001', userId: 'user-1', subject: 'Product key not working', message: '...', status: 'open' as const, priority: 'high' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TKT-002', userId: 'user-2', subject: 'How to activate?', message: '...', status: 'in_progress' as const, priority: 'medium' as const, createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TKT-003', userId: 'user-3', subject: 'Refund request', message: '...', status: 'resolved' as const, priority: 'urgent' as const, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TKT-004', userId: 'user-4', subject: 'Wrong item received', message: '...', status: 'closed' as const, priority: 'medium' as const, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date().toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Support Tickets</h1>
        <p className="text-text-secondary mt-1">Manage customer support inquiries</p>
      </div>
      
      <TicketTable tickets={mockTickets} />
    </div>
  );
}
