import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Printer,
  Sparkles,
  QrCode,
  Radio,
  Scale,
  FlaskConical,
  Menu,
  X,
  Home,
  Layers,
  Smartphone
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
  onScanClick: () => void;
  onCertificateClick: () => void;
  onMobileClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onScanClick,
  onCertificateClick,
  onMobileClick,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const navLinks = [
    { id: 'website', label: 'Home', icon: Home },
    { id: 'consumer', label: 'Verify Honey', icon: QrCode },
    { id: 'beekeeper', label: 'Beekeeper Log', icon: Radio },
    { id: 'collection', label: 'Mandi Scale', icon: Scale },
    { id: 'processing', label: 'Processing & Lab', icon: FlaskConical },
    { id: 'admin', label: 'Regulatory DAG', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      {/* Top Institutional Ribbon */}
      <div className="bg-[#122A1C] text-amber-100 text-xs px-4 py-1.5 flex items-center justify-between border-b border-emerald-900/60">
        <div className="container mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="tracking-wide text-white">Khadi & Village Industries Commission (KVIC)</span>
            </span>
            <span className="text-emerald-500 hidden md:inline">|</span>
            <span className="text-emerald-200/80 hidden md:inline">
              National Honey Mission • FSSAI Food Safety Standards Gazette No. 2020/2.8.2
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isBackendConnected ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-300 font-mono text-[11px] bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>PostgreSQL DB Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 text-amber-300 font-mono text-[11px] bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Local Cache Mode</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div 
            onClick={() => setActiveTab('website')}
            className="flex items-center space-x-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-xs text-white font-serif font-black text-lg border border-amber-500">
              HC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-serif text-stone-900 tracking-tight">HoneyChain</h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 hidden sm:inline-block">
                  National Protocol
                </span>
              </div>
              <p className="text-xs text-stone-600 hidden sm:block">AI-Verified Blockchain Traceability Platform for Indian Honey</p>
            </div>
          </div>

          {/* Center Navigation Links (Real Website Navigation) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isCurrent = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-stone-900 text-amber-400 shadow-xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Fast Actions & Officer Profile */}
          <div className="flex items-center space-x-2">
            {onMobileClick && (
              <button
                type="button"
                onClick={onMobileClick}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-emerald-700 hover:border-amber-400"
                title="Open HoneyChain on your phone and scan QR codes"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">📱 Mobile / QR Hub</span>
                <span className="sm:hidden">📱 Phone</span>
              </button>
            )}

            <button
              type="button"
              onClick={onScanClick}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan Jar QR</span>
              <span className="sm:hidden">Scan</span>
            </button>

            <button
              type="button"
              onClick={onCertificateClick}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hidden md:flex"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print NABL Cert</span>
            </button>

            {/* Mobile Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 lg:hidden cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileDrawerOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {onMobileClick && (
            <button
              type="button"
              onClick={() => {
                onMobileClick();
                setMobileDrawerOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left bg-emerald-800 text-amber-200 border border-emerald-700"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-300" />
                <span>📱 Open Mobile Access & QR Hub</span>
              </div>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                Tap Here
              </span>
            </button>
          )}
          <div className="text-[10px] uppercase font-mono font-bold text-stone-500 px-2">
            Navigation
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isCurrent = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs px-2 text-stone-600">
            <span>Active Batch: PKG-MAHA-042</span>
            <button
              type="button"
              onClick={() => {
                onCertificateClick();
                setMobileDrawerOpen(false);
              }}
              className="text-amber-700 font-bold underline"
            >
              Print Cert
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
