import { Review } from '@/types/review';
import { formatDate } from '@/lib/utils';
import { Star, CheckCircle, Trash2 } from 'lucide-react';

export default function ReviewTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-text-secondary font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 w-1/3">Comment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary">{review.userName}</div>
                  {review.verifiedPurchase && (
                    <div className="text-xs text-success flex items-center gap-1 mt-0.5">
                      <CheckCircle size={12} /> Verified
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-secondary text-secondary" : "text-gray-300"} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary truncate max-w-xs" title={review.comment}>
                  {review.comment}
                </td>
                <td className="px-6 py-4 text-text-secondary">{formatDate(review.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-text-muted hover:text-danger transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
