import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  LayoutDashboard, 
  Coffee, 
  Receipt, 
  Sparkles, 
  Sliders, 
  FileText, 
  HelpCircle, 
  User, 
  Settings, 
  Briefcase, 
  Home, 
  Menu, 
  X,
  Plus
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useBusiness();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Money Tracker' },
    { id: 'products', label: 'What You Sell', icon: Coffee, category: 'Money Tracker' },
    { id: 'expenses', label: 'Where Money Goes', icon: Receipt, category: 'Money Tracker' },
    { id: 'whatif', label: 'What If Simulator', icon: Sliders, category: 'Tools' },
    { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles, category: 'Tools' },
    { id: 'reports', label: 'Reports & Export', icon: FileText, category: 'Tools' },
    { id: 'howitworks', label: 'How It Works', icon: HelpCircle, category: 'About & Setup' },
    { id: 'businesscase', label: 'Blueprint Case', icon: Briefcase, category: 'About & Setup' },
    { id: 'about', label: 'About Creator', icon: User, category: 'About & Setup' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'About & Setup' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#101010] border-b border-neutral-800 sticky top-0 z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-7 h-7 rounded bg-white text-black font-bold flex items-center justify-center text-xs tracking-tighter">
            M
          </div>
          <span className="font-bold tracking-tight text-white text-base">MARGIN</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className="p-1.5 text-neutral-300 hover:text-white rounded border border-neutral-800 flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-neutral-300 hover:text-white rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[49px] z-50 bg-[#090909]/95 backdrop-blur-md p-4 overflow-y-auto border-t border-neutral-800">
          <div className="space-y-1 mb-6">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'landing' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Overview Page</span>
            </button>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500 space-y-1">
            <p className="font-mono text-neutral-400">{settings.businessName}</p>
            <p>Created by Azan Ejaz · Vibe-coded with AI</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed width 260px) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#101010] border-r border-neutral-800 shrink-0 h-screen sticky top-0">
        {/* Brand Area */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-8 h-8 rounded bg-white text-black font-extrabold flex items-center justify-center text-sm tracking-tighter group-hover:bg-neutral-200 transition-colors">
              M
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-white text-lg leading-none">MARGIN</div>
              <div className="text-[10px] text-neutral-400 tracking-wide mt-1">Find the leak. Fix the business.</div>
            </div>
          </button>
        </div>

        {/* Business Selector Pill */}
        <div className="px-4 py-3 border-b border-neutral-800/80 bg-[#0c0c0c] flex items-center justify-between">
          <div>
            <span className="text-white font-medium text-xs truncate max-w-[150px] block">
              {settings.businessName}
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              {settings.periodLabel}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="text-[10px] text-neutral-400 hover:text-white underline underline-offset-2"
          >
            Edit
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Money Tracker
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.category === 'Money Tracker').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Tools & Insights
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.category === 'Tools').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Blueprint & Setup
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.category === 'About & Setup').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Credit Area */}
        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-1 bg-[#0c0c0c]">
          <div className="text-neutral-300 font-medium">Created by Azan Ejaz</div>
          <div className="text-[11px] text-neutral-400">Vibe-coded with AI</div>
          <div className="pt-1">
            <a 
              href="https://www.instagram.com/azaneejaz_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-neutral-400 hover:text-white transition-colors underline underline-offset-2"
            >
              @azaneejaz_
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
