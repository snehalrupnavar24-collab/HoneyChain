import React from 'react';
import { Camera, QrCode, Smartphone, Printer, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CoreFeaturesBarProps {
  onOpenScanner: () => void;
  onOpenGenerator: () => void;
  onOpenMobile: () => void;
  onOpenCertificate: () => void;
}

export const CoreFeaturesBar: React.FC<CoreFeaturesBarProps> = ({
  onOpenScanner,
  onOpenGenerator,
  onOpenMobile,
  onOpenCertificate
}) => {
  const { lang, t } = useLanguage();

  const features = [
    {
      id: 'scan',
      title: lang === 'mr' ? '१. कॅमेरा QR स्कॅनर' : (lang === 'hi' ? '1. कैमरा QR स्कैनर' : '1. Camera QR Scanner'),
      desc: lang === 'mr' ? 'मोबाईल/वेबकॅमने मधाच्या बाटलीचा QR कोड स्कॅन करा' : (lang === 'hi' ? 'मोबाइल या लैपटॉप कैमरे से शहद का QR कोड स्कैन करें' : 'Scan any physical honey jar QR code using your camera'),
      badge: lang === 'mr' ? 'थेट स्कॅन' : (lang === 'hi' ? 'लाइव स्कैन' : 'Live Camera'),
      btnText: lang === 'mr' ? 'कॅमेरा उघडा' : (lang === 'hi' ? 'कैमरा खोलें' : 'Scan Jar QR'),
      icon: Camera,
      iconBg: 'bg-amber-500 text-stone-950',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-stone-950',
      border: 'border-amber-300 hover:border-amber-400',
      action: onOpenScanner
    },
    {
      id: 'generate',
      title: lang === 'mr' ? '२. जार QR लेबल तयार करा' : (lang === 'hi' ? '2. जार QR लेबल बनाएं' : '2. Generate Jar QR Label'),
      desc: lang === 'mr' ? 'बाटलीवर लावण्यासाठी अधिकृत प्रिंट करण्यायोग्य QR स्टिकर बनवा' : (lang === 'hi' ? 'जार पर चिपकाने हेतु आधिकारिक प्रिंट करने योग्य QR स्टीकर बनाएं' : 'Create & print high-res verifiable QR sticker labels for jars'),
      badge: lang === 'mr' ? 'प्रिंट स्टिकर' : (lang === 'hi' ? 'प्रिंट स्टीकर' : 'Printable QR'),
      btnText: lang === 'mr' ? 'QR लेबल बनवा' : (lang === 'hi' ? 'QR लेबल बनाएं' : 'Generate QR'),
      icon: QrCode,
      iconBg: 'bg-stone-900 text-amber-400',
      btnBg: 'bg-stone-900 hover:bg-black text-white',
      border: 'border-stone-300 hover:border-amber-400',
      action: onOpenGenerator
    },
    {
      id: 'mobile',
      title: lang === 'mr' ? '३. फोनमध्ये थेट उघडा' : (lang === 'hi' ? '3. फोन में तुरंत खोलें' : '3. Open on Mobile Phone'),
      desc: lang === 'mr' ? 'मोबाईल कॅमेऱ्याने स्कॅन करून हनीचेन फोनवर वापरा (वाय-फाय)' : (lang === 'hi' ? 'मोबाइल से QR स्कैन करें और फोन पर हनीचेन चलाएं (Wi-Fi)' : 'Scan on-screen QR with phone camera to use HoneyChain on mobile'),
      badge: lang === 'mr' ? 'फोन हब' : (lang === 'hi' ? 'फोन हब' : 'Mobile Access'),
      btnText: lang === 'mr' ? 'फोन QR पहा' : (lang === 'hi' ? 'फोन QR देखें' : 'Mobile Phone QR'),
      icon: Smartphone,
      iconBg: 'bg-emerald-700 text-white',
      btnBg: 'bg-emerald-800 hover:bg-emerald-900 text-white',
      border: 'border-emerald-300 hover:border-emerald-500',
      action: onOpenMobile
    },
    {
      id: 'cert',
      title: lang === 'mr' ? '४. NABL सरकारी प्रमाणपत्र' : (lang === 'hi' ? '4. NABL सरकारी प्रमाण पत्र' : '4. Official NABL Certificate'),
      desc: lang === 'mr' ? 'FSSAI आणि NABL लॅबचे अधिकृत रासायनिक शुद्धता प्रमाणपत्र सेव्ह करा' : (lang === 'hi' ? 'FSSAI और NABL लैब का आधिकारिक रासायनिक शुद्धता प्रमाण पत्र देखें' : 'View & print official Government of India chemical purity certificate'),
      badge: lang === 'mr' ? 'FSSAI / NABL' : (lang === 'hi' ? 'FSSAI / NABL' : 'Govt Certified'),
      btnText: lang === 'mr' ? 'प्रमाणपत्र पहा' : (lang === 'hi' ? 'प्रमाण पत्र देखें' : 'View Certificate'),
      icon: Printer,
      iconBg: 'bg-amber-600 text-white',
      btnBg: 'bg-stone-900 hover:bg-black text-amber-300',
      border: 'border-stone-300 hover:border-amber-400',
      action: onOpenCertificate
    }
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-200/90 shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-black text-base sm:text-lg text-stone-900 tracking-tight">
              {lang === 'mr' ? 'प्रमुख ४ वैशिष्ट्ये व QR साधने' : (lang === 'hi' ? 'प्रमुख 4 विशेषताएं एवं QR उपकरण' : '4 Core Verification Features & QR Hub')}
            </h3>
            <p className="text-xs text-stone-600">
              {lang === 'mr' ? 'कॅमेरा स्कॅनर, QR जनरेटर, मोबाईल ऍक्सेस आणि NABL प्रमाणपत्र थेट उपलब्ध' : (lang === 'hi' ? 'कैमरा स्कैनर, QR जनरेटर, मोबाइल एक्सेस और NABL प्रमाण पत्र प्रत्यक्ष उपलब्ध' : 'Direct on-screen access to Camera Scanning, Label Generation, Mobile Hub, and NABL Certificate')}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 self-start sm:self-auto">
          ✓ All 4 Visible
        </span>
      </div>

      {/* 4 Systematic Feature Cards (100% visible on screen without hiding) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`bg-stone-50/80 rounded-2xl border-2 ${item.border} p-4 flex flex-col justify-between space-y-3 shadow-2xs transition-all hover:bg-white hover:shadow-xs`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center font-bold shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-stone-200 text-stone-700 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 leading-snug mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={item.action}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs ${item.btnBg} transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <span>{item.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
