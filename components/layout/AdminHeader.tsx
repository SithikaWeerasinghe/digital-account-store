import { Bell, Menu, Search, User } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-text-secondary hover:text-text-primary">
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex relative w-64 lg:w-96">
          <input
            type="text"
            placeholder="Search admin..."
            className="w-full bg-gray-100 text-gray-800 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white border border-transparent focus:border-primary/30 transition-all"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-text-muted" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 relative text-text-secondary hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-danger text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Admin User</p>
            <p className="text-xs text-text-muted">Superadmin</p>
          </div>
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
