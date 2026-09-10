import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WebsiteHome } from './components/WebsiteHome';
import { ConsumerVerification } from './components/ConsumerVerification';
import { BeekeeperPortal } from './components/BeekeeperPortal';
import { CollectionTerminal } from './components/CollectionTerminal';
import { ProcessingFacility } from './components/ProcessingFacility';
import { StageHeader } from './components/StageHeader';
import { HoneyVaaniVoiceWidget } from './components/HoneyVaaniVoiceWidget';
import { MobileAccessModal } from './components/MobileAccessModal';
import { CustomerJarQRGenerator } from './components/CustomerJarQRGenerator';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerLoginModal } from './components/CustomerLoginModal';
import { checkBackendHealth } from './services/api';
import { Heart, ArrowLeft, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'dashboard' || tabParam === 'admin') return 'website';
      if (tabParam) return tabParam;
      if (urlParams.get('batch')) return 'consumer';
    }
    return 'website';
  });
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [isCustomerQrOpen, setIsCustomerQrOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      if (tabParam === 'dashboard' || tabParam === 'admin') {
        setActiveTab('website');
      } else {
        setActiveTab(tabParam);
      }
    } else if (urlParams.get('batch')) {
      setActiveTab('consumer');
    }

    const verifyHealth = async () => {
      const healthy = await checkBackendHealth();
      setIsBackendConnected(healthy);
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalScan = () => {
    setActiveTab('consumer');
    setTimeout(() => {
      const scanBtn = document.getElementById('btn-scan-qr');
      if (scanBtn) scanBtn.click();
    }, 150);
  };

  const handleGlobalCert = () => {
    setActiveTab('consumer');
    setTimeout(() => {
      const certBtn = document.getElementById('btn-view-cert');
      if (certBtn) certBtn.click();
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-real-honey-photo text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-950 relative">
      {/* 1. Official Government Institutional Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        onScanClick={handleGlobalScan}
        onCertificateClick={handleGlobalCert}
        onMobileClick={() => setIsMobileModalOpen(true)}
        onGenerateQrClick={() => setIsCustomerQrOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        {activeTab === 'website' ? (
          /* Public Facing High-Impact Website with All Unified Audit Features */
          <main className="animate-in fade-in duration-300">
            <WebsiteHome 
              onOpenPortal={(portalId) => setActiveTab(portalId)} 
              onOpenMobileModal={() => setIsMobileModalOpen(true)}
              onOpenCustomerQrModal={() => setIsCustomerQrOpen(true)}
            />
          </main>
        ) : (
          /* Operational Terminals */
          <main className="space-y-6 animate-in fade-in duration-300">
            {/* Context Navigation Bar */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('website')}
                className="px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-stone-800 border border-stone-300 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:border-amber-400 hover:text-amber-900"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {lang === 'mr' ? '← हनीचेन मुख्य पानावर परत जा' : (lang === 'hi' ? '← हनीचेन मुख्य पृष्ठ पर लौटें' : '← Back to HoneyChain Public Website')}
                </span>
              </button>

              <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline">Active Terminal:</span>
                <span className="font-bold text-stone-900 uppercase">
                  {activeTab}
                </span>
              </div>
            </div>

            {/* Contextual Stage Header */}
            <StageHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Active Working Module */}
            <section className="animate-in fade-in duration-300">
              {activeTab === 'consumer' && <ConsumerVerification />}
              {activeTab === 'beekeeper' && <BeekeeperPortal />}
              {activeTab === 'collection' && <CollectionTerminal />}
              {activeTab === 'processing' && <ProcessingFacility />}
            </section>
          </main>
        )}
      </div>

      {/* 3. Official Government & Cooperative Footer */}
      <footer className="bg-[#102317] text-stone-300 border-t border-emerald-950 mt-16 relative z-20">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs leading-relaxed">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-black text-stone-950 text-xs">
                  HC
                </div>
                <span className="font-serif font-bold text-white text-base">HoneyChain India</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                {t.footer.desc}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2.5 text-[11px]">
                {t.footer.stationsTitle}
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('website')} className="hover:text-amber-400 text-left">
                    • 01. {lang === 'mr' ? 'हनीचेन मुख्य पोर्टल व QR' : (lang === 'hi' ? 'हनीचेन मुख्य पोर्टल एवं QR' : 'HoneyChain Master Home & QR')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('consumer')} className="hover:text-amber-400 text-left">
                    • 02. {t.nav.verify}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('beekeeper')} className="hover:text-amber-400 text-left">
                    • 03. {t.nav.beekeeper}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('collection')} className="hover:text-amber-400 text-left">
                    • 04. {t.nav.mandi}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('processing')} className="hover:text-amber-400 text-left">
                    • 05. {t.nav.processing}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2.5 text-[11px]">
                {t.footer.complianceTitle}
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>• {t.footer.standard1}</li>
                <li>• {t.footer.standard2}</li>
                <li>• {t.footer.standard3}</li>
                <li>• {t.footer.standard4}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2.5 text-[11px]">
                {t.footer.hackathonTitle}
              </h4>
              <p className="text-stone-400 leading-relaxed">
                {t.footer.hackathonDesc}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <span>{t.footer.builtFor}</span>
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-950 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.tagline}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Phone Access & QR Code Hub Modal */}
      <MobileAccessModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        localIp={
          typeof window !== 'undefined' &&
          window.location.hostname &&
          window.location.hostname !== 'localhost' &&
          window.location.hostname !== '127.0.0.1'
            ? window.location.hostname
            : '10.196.224.19'
        }
        port="5173"
      />

      {/* Customer Honey Jar QR Generator Modal */}
      <CustomerJarQRGenerator
        isOpen={isCustomerQrOpen}
        onClose={() => setIsCustomerQrOpen(false)}
        onTestVerify={(batchCode) => {
          setIsCustomerQrOpen(false);
          setActiveTab('website');
          setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) {
              input.value = batchCode;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }, 150);
        }}
        localIp="10.196.224.19"
        port="5173"
      />

      {/* HoneyVaani Hands-Free Voice Assistant for Rural & Non-Typing Users */}
      <HoneyVaaniVoiceWidget
        onNavigateTab={(tab) => {
          if (tab === 'admin' || tab === 'dashboard') {
            setActiveTab('website');
          } else {
            setActiveTab(tab);
          }
        }}
        activeTab={activeTab}
      />

      {/* Customer Login & Account Profile Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onScanRedirect={handleGlobalScan}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
};
export default App;
