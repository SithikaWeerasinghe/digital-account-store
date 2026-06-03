import { useState } from 'react';
import { Review } from '@/types/review';
import { formatDate } from '@/lib/utils';
import { Star, CheckCircle, Trash2, Check } from 'lucide-react';
import { approveAdminReview, deleteAdminReview } from '@/lib/api';

export default function ReviewTable({ 
  reviews, 
  onReviewApproved, 
  onReviewDeleted 
}: { 
  reviews: Review[]; 
  onReviewApproved?: (id: string) => void;
  onReviewDeleted?: (id: string) => void;
}) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approveAdminReview(id);
      if (onReviewApproved) onReviewApproved(id);
    } catch (err) {
      console.error('Failed to approve review:', err);
      alert('Failed to approve review. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      setProcessingId(id);
      await deleteAdminReview(id);
      if (onReviewDeleted) onReviewDeleted(id);
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] tracking-widest uppercase border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4.5">Reviewer</th>
              <th className="px-6 py-4.5">Rating</th>
              <th className="px-6 py-4.5 w-1/3">Comment Log</th>
              <th className="px-6 py-4.5">Submitted Date</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">{review.userName}</div>
                  {review.verifiedPurchase && (
                    <div className="text-[9px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-1">
                      <CheckCircle size={10} /> Verified Buyer
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-0.5 bg-slate-50 border border-slate-150 p-1.5 rounded-lg w-max shadow-inner">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={11} 
                        className={i < review.rating ? "fill-[#fff159] text-amber-500 drop-shadow-[0_0_1px_rgba(255,241,89,0.3)]" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 italic truncate max-w-xs" title={review.comment}>
                  &ldquo;{review.comment}&rdquo;
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{formatDate(review.createdAt)}</td>
                <td className="px-6 py-4">
                  {review.isApproved ? (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Approved
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border-amber-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!review.isApproved && (
                      <button 
                        onClick={() => handleApprove(review.id)}
                        disabled={processingId !== null}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Approve Review"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(review.id)}
                      disabled={processingId !== null}
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-rose-500/30 text-slate-400 hover:text-rose-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Review Log"
                    >
                      <Trash2 size={14} />
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
