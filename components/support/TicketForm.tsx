"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function TicketForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submission
    alert('Ticket submitted successfully!');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Submit a Request</h2>
      <p className="text-text-secondary mb-6">Need help with your purchase? We typically respond within 24 hours.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of the issue"
            className="w-full bg-white border border-input rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
            Details
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Please provide as much detail as possible. If this is about an order, include your order ID."
            className="w-full bg-white border border-input rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            required
          />
        </div>
        
        <button type="submit" className="mp-button-primary w-full py-3 flex items-center justify-center gap-2">
          <Send size={18} />
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
