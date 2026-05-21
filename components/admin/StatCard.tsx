export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: { value: number; isPositive: boolean } 
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
          
          {trend && (
            <p className="flex items-center gap-1 text-xs font-medium mt-2">
              <span className={trend.isPositive ? 'text-success' : 'text-danger'}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-text-muted">vs last month</span>
            </p>
          )}
        </div>
        
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
