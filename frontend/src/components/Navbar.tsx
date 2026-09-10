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
  Smartphone,
  User
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
  onScanClick: () => void;
  onCertificateClick: () => void;
  onMobileClick?: () => void;
  onGenerateQrClick?: () => void;
  onLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onScanClick,
  onCertificateClick,
  onMobileClick,
  onGenerateQrClick,
  onLoginClick,
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const navLinks = [
    { id: 'website', label: t.nav.home, icon: Home },
    { id: 'consumer', label: t.nav.verify, icon: QrCode },
    { id: 'beekeeper', label: t.nav.beekeeper, icon: Radio },
    { id: 'collection', label: t.nav.mandi, icon: Scale },
    { id: 'processing', label: t.nav.processing, icon: FlaskConical },
    { id: 'admin', label: t.nav.admin, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      {/* Top Institutional Ribbon */}
      <div className="bg-[#122A1C] text-amber-100 text-xs px-4 py-1.5 flex items-center justify-between border-b border-emerald-900/60">
        <div className={`w-full mx-auto flex items-center justify-between font-medium ${activeTab === 'admin' ? 'max-w-6xl' : 'max-w-5xl'}`}>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="tracking-wide text-white">{t.ribbon.kvic}</span>
            </span>
            <span className="text-emerald-500 hidden md:inline">|</span>
            <span className="text-emerald-200/80 hidden md:inline">
              {t.ribbon.mission}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isBackendConnected ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-300 font-mono text-[11px] bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>PostgreSQL DB Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 text-amber-300 font-mono text-[11px] bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Local Cache Mode</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`w-full mx-auto px-4 py-2.5 ${activeTab === 'admin' ? 'max-w-6xl' : 'max-w-5xl'}`}>
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
                <h1 className="text-xl font-bold font-serif text-stone-900 tracking-tight">{t.nav.brand}</h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 hidden sm:inline-block">
                  {t.nav.tag}
                </span>
              </div>
              <p className="text-xs text-stone-600 hidden sm:block">{t.nav.subtitle}</p>
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

          {/* Right Fast Actions: Language Pill + Actions */}
          <div className="flex items-center space-x-2">
            {/* 3-Language Selector Pill */}
            <div className="flex items-center bg-stone-200/90 p-0.5 rounded-xl border border-stone-300 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'mr'
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
                title="मराठीत बदला"
              >
                मराठी
              </button>
            </div>

            {/* Customer Login / Profile Button */}
            {onLoginClick && (
              <button
                type="button"
                onClick={onLoginClick}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer border ${
                  isLoggedIn
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white hover:bg-amber-50 text-stone-900 border-stone-300 hover:border-amber-400'
                }`}
                title={isLoggedIn ? `Customer Profile: ${user?.name}` : "Customer Sign In"}
              >
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline truncate max-w-[90px]">
                  {isLoggedIn ? user?.name.split(' ')[0] : (lang === 'mr' ? 'ग्राहक' : (lang === 'hi' ? 'ग्राहक' : 'Sign In'))}
                </span>
              </button>
            )}

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
        <div className="lg:hidden border-t border-stone-200 bg-white p-3 space-y-2.5 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between p-2 bg-stone-100 rounded-xl">
            <span className="text-xs font-bold text-stone-600">भाषा / Language:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-stone-900 text-amber-400' : 'text-stone-700'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${lang === 'hi' ? 'bg-stone-900 text-amber-400' : 'text-stone-700'}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${lang === 'mr' ? 'bg-stone-900 text-amber-400' : 'text-stone-700'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          {onGenerateQrClick && (
            <button
              type="button"
              onClick={() => {
                onGenerateQrClick();
                setMobileDrawerOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left bg-amber-600 text-white shadow-xs"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-200" />
                <span>{t.nav.generateQr}</span>
              </div>
              <span className="text-[10px] bg-amber-900/40 px-2 py-0.5 rounded text-amber-100">
                Sticker
              </span>
            </button>
          )}

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
                <span>{t.nav.mobileHub}</span>
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
        </div>
      )}
    </header>
  );
};
