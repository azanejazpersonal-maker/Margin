import React from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Navigation } from './components/Navigation';
import { ExplainerModal } from './components/ExplainerModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { SuggestionsPage } from './pages/SuggestionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import { BusinessCasePage } from './pages/BusinessCasePage';
import { ArrowRight } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useBusiness();

  // Landing page has dedicated header meeting top-bar contract
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans">
        {/* Top Bar Contract (Zone 1: Brand — Zone 2: 4-5 Links — Zone 3: 1 CTA) */}
        <header className="sticky top-0 z-40 bg-[#090909]/90 backdrop-blur-md border-b border-neutral-800">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
            {/* Zone 1: Single text element wordmark */}
            <button
              onClick={() => setActiveTab('landing')}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded bg-white text-black font-extrabold flex items-center justify-center text-xs">
                M
              </div>
              <span>MARGIN</span>
            </button>

            {/* Zone 2: 4-5 clean single-line text links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('whatif')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Simulator
              </button>
              <button 
                onClick={() => setActiveTab('howitworks')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                How It Works
              </button>
              <button 
                onClick={() => setActiveTab('businesscase')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Blueprint Case
              </button>
              <button 
                onClick={() => setActiveTab('about')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                About
              </button>
            </nav>

            {/* Zone 3: 1 primary action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Explore Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          <LandingPage />
        </main>
        <ExplainerModal />
      </div>
    );
  }

  // Map active tab to page component
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <ProductsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'whatif':
        return <WhatIfPage />;
      case 'suggestions':
        return <SuggestionsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'howitworks':
        return <HowItWorksPage />;
      case 'businesscase':
        return <BusinessCasePage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Products & Unit Costs';
      case 'expenses': return 'Running Bills & Expenses';
      case 'whatif': return 'What If Simulator';
      case 'suggestions': return 'Smart Suggestions';
      case 'reports': return 'Reports & Data Exports';
      case 'howitworks': return 'How It Works';
      case 'businesscase': return 'Hackathon Business Case';
      case 'about': return 'About Creator';
      case 'settings': return 'Business Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Navigation />

      {/* Main Content Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Workspace Breadcrumb Contract */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-[#101010]/80 border-b border-neutral-800 backdrop-blur-xs sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-mono">MARGIN</span>
            <span className="text-neutral-600">/</span>
            <span className="text-white font-semibold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-white font-medium">{settings.businessName}</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-neutral-400 hover:text-white transition-colors text-[11px]"
            >
              Settings
            </button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>

        {/* Global Explainer Modal */}
        <ExplainerModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BusinessProvider>
      <MainLayout />
    </BusinessProvider>
  );
}
