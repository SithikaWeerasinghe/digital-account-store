import TicketTable from '@/components/admin/TicketTable';

const mockTickets = [
  { id: 'TKT-001', userId: 'user-1', subject: 'Product key not working', message: '...', status: 'open' as const, priority: 'high' as const, createdAt: '2026-05-22T08:00:00.000Z', updatedAt: '2026-05-22T08:00:00.000Z' },
  { id: 'TKT-002', userId: 'user-2', subject: 'How to activate?', message: '...', status: 'in_progress' as const, priority: 'medium' as const, createdAt: '2026-05-22T07:00:00.000Z', updatedAt: '2026-05-22T07:00:00.000Z' },
  { id: 'TKT-003', userId: 'user-3', subject: 'Refund request', message: '...', status: 'resolved' as const, priority: 'urgent' as const, createdAt: '2026-05-22T06:00:00.000Z', updatedAt: '2026-05-22T06:00:00.000Z' },
  { id: 'TKT-004', userId: 'user-4', subject: 'Wrong item received', message: '...', status: 'closed' as const, priority: 'medium' as const, createdAt: '2026-05-21T08:00:00.000Z', updatedAt: '2026-05-22T08:00:00.000Z' },
];

export default function AdminTicketsPage() {
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
