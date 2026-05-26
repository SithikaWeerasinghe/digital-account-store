'use client';

import { useState, useEffect } from 'react';
import TicketTable from '@/components/admin/TicketTable';
import { fetchAdminTickets } from '@/lib/api';
import { Ticket } from '@/types/ticket';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdminTickets();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Support Tickets</h1>
        <p className="text-text-secondary mt-1">Manage customer support inquiries</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <h3 className="font-bold text-lg mb-1">Error Loading Tickets</h3>
          <p>{error}</p>
        </div>
      ) : tickets.length > 0 ? (
        <TicketTable tickets={tickets} />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary">No tickets yet.</p>
        </div>
      )}
    </div>
  );
}
