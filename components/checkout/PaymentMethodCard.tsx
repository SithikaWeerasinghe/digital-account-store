export default function PaymentMethodCard({ 
  id, 
  title, 
  description, 
  icon, 
  selected, 
  onSelect 
}: { 
  id: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  selected: boolean; 
  onSelect: (id: string) => void; 
}) {
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-primary' : 'border-gray-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-primary" />}
        </div>
        
        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
          {icon}
        </div>
        
        <div>
          <h3 className="font-medium text-text-primary">{title}</h3>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
