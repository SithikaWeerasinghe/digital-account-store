import { sampleReviews } from '@/data/sampleReviews';
import ReviewTable from '@/components/admin/ReviewTable';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reviews</h1>
        <p className="text-text-secondary mt-1">Manage product reviews and feedback</p>
      </div>
      
      <ReviewTable reviews={sampleReviews} />
    </div>
  );
}
