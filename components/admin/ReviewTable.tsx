import { Review } from '@/types/review';
import { formatDate } from '@/lib/utils';
import { Star, CheckCircle, Trash2 } from 'lucide-react';

export default function ReviewTable({ reviews }: { reviews: Review[] }) {
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
                  "{review.comment}"
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{formatDate(review.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-rose-500/30 text-slate-400 hover:text-rose-600 transition-all duration-200 cursor-pointer"
                    title="Delete Review Log"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
