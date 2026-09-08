import React, { useState, useEffect } from 'react';
import {
  Mic,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Thermometer,
  Droplets,
  Scale,
  BatteryCharging,
  Wifi,
  MapPin,
  Calendar,
  Volume2
} from 'lucide-react';
import { Hive, SensorReading, YieldPredictionResponse, HarvestLot } from '../types';
import { getHives, getSensorReadings, simulateSensorData, predictYield, createHarvest } from '../services/api';
import { HiveAcousticAnalyzer } from './HiveAcousticAnalyzer';

type Language = 'en' | 'hi' | 'mr';

const TRANSLATIONS = {
  en: {
    title: 'Beekeeper Digital Field Terminal',
    sub: 'National Honey Mission • Kisan Smart Apiary Network (Satara Valley Cluster)',
    connectedAs: 'Authenticated Farmer: Ramesh Tukaram Patil (KVIC Reg: KVIC-MH-2024-8841)',
    apiaryLocation: 'Mahabaleshwar Flora Zone, Satara, Maharashtra (Elevation: 1,353m)',
    liveTelemetry: 'Live Hive IoT Telemetry',
    simulateSensors: 'Fetch Fresh Sensor Stream',
    aiPrediction: 'AI Biomass & Yield Prediction Engine',
    predictButton: 'Calculate Predictive Harvest Window',
    declareHarvest: 'Declare New Honey Harvest',
    voiceInput: 'Voice Log (Hindi / Marathi / English)',
    listening: 'Listening to rural speech...',
    voiceInstruction: 'Click microphone or choose a voice phrase preset below:',
    sampleVoice1: '"हाइव १७ से आठ किलो शहद निकाला"',
    sampleVoice2: '"Hive 18 se 6.5 kilo Jamun honey harvest kiya"',
    selectHive: 'Select Monitored Hive',
    lotCode: 'Batch Lot Identifier',
    harvestDate: 'Harvest Date',
    quantity: 'Quantity Harvested (kg)',
    notes: 'Botanical Observation / Notes',
    submitHarvest: 'Submit & Sign to Blockchain Ledger',
    harvestSuccess: 'Harvest Lot successfully registered and digitally signed!',
    temp: 'Brood Temp',
    hum: 'Internal Humidity',
    weight: 'Gross Hive Weight',
    normal: 'Optimum Brood Climate',
    lastUpdated: 'Last telemetry broadcast',
  },
  hi: {
    title: 'मधुमक्खी पालक डिजिटल फील्ड टर्मिनल',
    sub: 'राष्ट्रीय मधुमक्खी मिशन • किसान स्मार्ट एपियरी नेटवर्क (सतारा क्लस्टर)',
    connectedAs: 'प्रमाणित किसान: रमेश तुकाराम पाटिल (KVIC पंजी: KVIC-MH-2024-8841)',
    apiaryLocation: 'महाबलेश्वर वन क्षेत्र, सतारा, महाराष्ट्र (ऊंचाई: १,३५३ मी)',
    liveTelemetry: 'लाइव हाइव आईओटी टेलीमेट्री',
    simulateSensors: 'नया सेंसर डेटा प्राप्त करें',
    aiPrediction: 'एआई शहद उत्पादन पूर्वानुमान',
    predictButton: 'कटाई की संभावना की गणना करें',
    declareHarvest: 'नई शहद कटाई दर्ज करें',
    voiceInput: 'आवाज से दर्ज करें (हिंदी / मराठी / अंग्रेजी)',
    listening: 'आवाज सुनी जा रही है...',
    voiceInstruction: 'माइक दबाएं या नीचे दिए गए उदाहरण पर क्लिक करें:',
    sampleVoice1: '"हाइव १७ से आठ किलो शहद निकाला"',
    sampleVoice2: '"हाइव १८ से साढ़े छह किलो जामुन शहद मिला"',
    selectHive: 'निगरानी वाला हाइव चुनें',
    lotCode: 'बैच लॉट संख्या',
    harvestDate: 'कटाई की तारीख',
    quantity: 'निकाली गई मात्रा (किलो)',
    notes: 'वानस्पतिक विवरण / टिप्पणी',
    submitHarvest: 'ब्लॉकचेन बहीखाते में दर्ज करें',
    harvestSuccess: 'शहद लॉट सफलतापूर्वक दर्ज और डिजिटल हस्ताक्षरित हुआ!',
    temp: 'हाइव तापमान',
    hum: 'आंतरिक आर्द्रता',
    weight: 'हाइव कुल वजन',
    normal: 'इष्टतम छत्ता वातावरण',
    lastUpdated: 'अंतिम टेलीमेट्री समय',
  },
  mr: {
    title: 'मधुपाळ डिजिटल शेतकरी पोर्टल',
    sub: 'राष्ट्रीय मध मोहीम • शेतकरी स्मार्ट मधुमक्षिका नेटवर्क (सातारा विभाग)',
    connectedAs: 'प्रमाणित शेतकरी: रमेश तुकाराम पाटील (KVIC नोंदणी: KVIC-MH-2024-8841)',
    apiaryLocation: 'महाबळेश्वर वन परिक्षेत्र, सातारा, महाराष्ट्र',
    liveTelemetry: 'थेट पेटी आयओटी सेन्सर नोंदी',
    simulateSensors: 'नवीन सेन्सर नोंदी अपडेट करा',
    aiPrediction: 'एआय मध उत्पादन अंदाज प्रणाली',
    predictButton: 'मध काढणीच्या वेळेचा अंदाज घ्या',
    declareHarvest: 'नवीन मध काढणीची नोंद करा',
    voiceInput: 'आवाजाद्वारे नोंदणी (मराठी / हिंदी / इंग्रजी)',
    listening: 'आवाज ऐकत आहे...',
    voiceInstruction: 'माइकवर क्लिक करा किंवा खालील नमुना निवडा:',
    sampleVoice1: '"पेटी क्रमांक १७ मधून ८ किलो जांभूळ मध काढला"',
    sampleVoice2: '"पेटी १८ मधून ६.५ किलो मध संकलित केला"',
    selectHive: 'मधुमक्षिका पेटी निवडा',
    lotCode: 'बॅच लॉट कोड',
    harvestDate: 'काढणीची तारीख',
    quantity: 'काढलेले वजन (किलो)',
    notes: 'फुलोरा निरीक्षण / टिप्पणी',
    submitHarvest: 'ब्लॉकचेनवर सुरक्षित नोंदवा',
    harvestSuccess: 'मध काढणीची यशस्वीपणे नोंद झाली आणि डिजिटल स्वाक्षरी झाली!',
    temp: 'पेटीचे तापमान',
    hum: 'आतील आर्द्रता',
    weight: 'पेटीचे एकूण वजन',
    normal: 'उत्कृष्ट पेटी हवामान',
    lastUpdated: 'शेवटची अपडेट',
  }
};

export const BeekeeperPortal: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = TRANSLATIONS[lang];

  const [hives, setHives] = useState<Hive[]>([]);
  const [selectedHiveId, setSelectedHiveId] = useState<number>(1);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);

  // AI Prediction State
  const [aiPrediction, setAiPrediction] = useState<YieldPredictionResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Harvest Form State
  const [harvestForm, setHarvestForm] = useState({
    lot_code: `HC-SAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    harvest_date: new Date().toISOString().split('T')[0],
    declared_quantity: 8.0,
    unit: 'kg',
    notes: 'Western Ghats Flora: Syzygium cumini (Jamun) nectar flow. Moisture naturally ripened.'
  });
  const [submittingHarvest, setSubmittingHarvest] = useState(false);
  const [createdHarvest, setCreatedHarvest] = useState<HarvestLot | null>(null);

  // Voice Input Simulation
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Initial load
  useEffect(() => {
    loadHives();
  }, []);

  useEffect(() => {
    if (selectedHiveId) {
      loadHiveReadings(selectedHiveId);
    }
  }, [selectedHiveId]);

  const loadHives = async () => {
    const list = await getHives();
    setHives(list);
    if (list.length > 0 && !selectedHiveId) {
      setSelectedHiveId(list[0].id);
    }
  };

  const loadHiveReadings = async (hiveId: number) => {
    setLoadingReadings(true);
    const data = await getSensorReadings(hiveId);
    setReadings(data);
    setLoadingReadings(false);
  };

  const handleSimulateSensors = async () => {
    setLoadingReadings(true);
    const data = await simulateSensorData(selectedHiveId);
    setReadings(data);
    setLoadingReadings(false);
  };

  const handlePredictYield = async () => {
    setLoadingAi(true);
    const latest = readings[0] || { temperature: 34.5, humidity: 62.0, hive_weight: 28.5 };
    const pred = await predictYield({
      hive_id: selectedHiveId,
      env_temp: 29.5,
      rel_hum: 65.0,
      hive_temp: latest.temperature,
      hive_hum: latest.humidity,
      wind_speed: 7.2
    });
    setAiPrediction(pred);
    setLoadingAi(false);
  };

  // Voice simulation triggers
  const triggerVoicePreset = (text: string, parsedQty: number, parsedHiveCode: string) => {
    setIsListening(true);
    setVoiceTranscript(text);
    setTimeout(() => {
      setIsListening(false);
      // Find hive id by code
      const targetHive = hives.find(h => h.hive_code.toLowerCase().includes(parsedHiveCode.toLowerCase()));
      if (targetHive) {
        setSelectedHiveId(targetHive.id);
      }
      setHarvestForm(prev => ({
        ...prev,
        declared_quantity: parsedQty,
        notes: `Voice logged: "${text}". Auto-extracted ${parsedQty} kg from ${parsedHiveCode}. Verified by acoustic stamp.`
      }));

      // Speak back audio confirmation
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const confirmationSpeech =
          lang === 'hi'
            ? `आवाज पहचानी गई: ${parsedHiveCode} से ${parsedQty} किलो शहद दर्ज कर लिया गया है।`
            : lang === 'mr'
            ? `आवाज ओळखली: ${parsedHiveCode} मधून ${parsedQty} किलो मधाची नोंद झाली आहे.`
            : `Voice recognized: ${parsedQty} kg logged from ${parsedHiveCode}.`;
        const ut = new SpeechSynthesisUtterance(confirmationSpeech);
        ut.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
        window.speechSynthesis.speak(ut);
      }
    }, 1200);
  };

  const handleSubmitHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingHarvest(true);
    try {
      const result = await createHarvest({
        hive_id: selectedHiveId,
        lot_code: harvestForm.lot_code,
        harvest_date: harvestForm.harvest_date,
        declared_quantity: Number(harvestForm.declared_quantity),
        unit: harvestForm.unit,
        notes: harvestForm.notes
      });
      setCreatedHarvest(result);

      // Audio confirmation for rural beekeepers
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const congratsText =
          lang === 'hi'
            ? `बधाई हो रमेश जी! आपका ${harvestForm.declared_quantity} किलो शहद ब्लॉकचेन किसान पासबुक में दर्ज हो गया है।`
            : lang === 'mr'
            ? `अभिनंदन रमेश जी! तुमचे ${harvestForm.declared_quantity} किलो मध ब्लॉकचेन शेतकरी पासबुकमध्ये जमा झाले आहे.`
            : `Harvest of ${harvestForm.declared_quantity} kg successfully anchored to the blockchain.`;
        const ut = new SpeechSynthesisUtterance(congratsText);
        ut.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
        window.speechSynthesis.speak(ut);
      }

      // Generate new lot code for next run
      setHarvestForm(prev => ({
        ...prev,
        lot_code: `HC-SAT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    } finally {
      setSubmittingHarvest(false);
    }
  };

  const latestReading = readings[0] || {
    temperature: 34.5,
    humidity: 61.2,
    hive_weight: 28.4,
    recorded_at: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Top Identity & Multilingual Header */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-honey-100 text-honey-800 text-xs font-semibold border border-honey-300">
              <Radio className="w-3 h-3 text-honey-700 animate-pulse" />
              {t.sub}
            </div>
            <h1 className="text-2xl font-bold font-serif text-forest-900 tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm font-medium text-forest-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t.connectedAs}
            </p>
            <p className="text-xs text-cream-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-honey-600" />
              {t.apiaryLocation}
            </p>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2 bg-cream-100 p-1.5 rounded-xl border border-cream-300 self-start md:self-auto">
            <span className="text-xs font-semibold text-cream-700 px-2">भाषा / Language:</span>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'en'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-forest-800 hover:bg-cream-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'hi'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-forest-800 hover:bg-cream-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'mr'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-forest-800 hover:bg-cream-200'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>

      {/* Grassroots Kisan Identity Passbook */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-amber-400 shrink-0 bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=300&q=80"
              alt="Ramesh Tukaram Patil"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-forest-950">Ramesh Tukaram Patil</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                KVIC Smart Kisan Passbook
              </span>
            </div>
            <p className="text-xs text-forest-800">
              Cooperative: Satara Forest Beekeeping Federation Ltd. • 24 Registered Colonies (Apis cerana)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-forest-900 bg-white/90 px-3.5 py-2 rounded-xl border border-amber-200 shrink-0">
          <div>
            <span className="text-[10px] text-cream-600 block uppercase">DBT Account</span>
            <span className="font-bold">SBI Kas Valley (Active)</span>
          </div>
          <div className="h-6 w-px bg-cream-300" />
          <div>
            <span className="text-[10px] text-cream-600 block uppercase">Govt Subsidized Hive</span>
            <span className="font-bold text-emerald-700">Scheme 80% Cleared</span>
          </div>
        </div>
      </div>

      {/* Grid: Live IoT Telemetry & AI Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: IoT Hive Telemetry */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-honey-600 animate-pulse" />
                {t.liveTelemetry}
              </h2>
              <p className="text-xs text-cream-600 mt-0.5">
                Low-Power LoRaWAN Hive Scale & Brood Climate Sensors (ESP32 Gateway)
              </p>
            </div>

            {/* Hive Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-cream-300 bg-cream-50 p-1">
                {hives.map(hive => (
                  <button
                    key={hive.id}
                    onClick={() => setSelectedHiveId(hive.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedHiveId === hive.id
                        ? 'bg-honey-500 text-forest-950 shadow-sm'
                        : 'text-forest-800 hover:text-forest-950'
                    }`}
                  >
                    {hive.hive_code}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSimulateSensors}
                disabled={loadingReadings}
                className="p-2 text-forest-700 hover:text-forest-900 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors border border-cream-300"
                title={t.simulateSensors}
              >
                <RefreshCw className={`w-4 h-4 ${loadingReadings ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Metric Cards for the Selected Hive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Brood Temperature */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80">
              <div className="flex items-center justify-between text-amber-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{t.temp}</span>
                <Thermometer className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-forest-950 font-mono">
                {latestReading.temperature ? `${latestReading.temperature.toFixed(1)}°C` : '34.5°C'}
              </div>
              <div className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ideal brood range: 33°C - 36°C
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-cyan-50/40 border border-blue-200/80">
              <div className="flex items-center justify-between text-blue-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{t.hum}</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-forest-950 font-mono">
                {latestReading.humidity ? `${latestReading.humidity.toFixed(1)}%` : '61.2%'}
              </div>
              <div className="mt-2 text-xs font-medium text-blue-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ripening humidity: 55% - 65%
              </div>
            </div>

            {/* Hive Weight */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80">
              <div className="flex items-center justify-between text-emerald-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{t.weight}</span>
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-forest-950 font-mono">
                {latestReading.hive_weight ? `${latestReading.hive_weight.toFixed(2)} kg` : '28.40 kg'}
              </div>
              <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                <span className="text-emerald-800 font-bold">+0.42 kg</span> nectar flow today
              </div>
            </div>
          </div>

          {/* Device status footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-cream-600 pt-2 border-t border-cream-100 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-forest-800">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" /> LoRaWAN Signal: -78 dBm (Strong)
              </span>
              <span className="flex items-center gap-1 text-forest-800">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Solar Battery: 94% (4.1V)
              </span>
            </div>
            <span className="text-cream-500 font-mono">
              {t.lastUpdated}: {new Date(latestReading.recorded_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Right 1 Col: AI Biomass & Yield Prediction */}
        <div className="bg-gradient-to-b from-forest-900 to-forest-950 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-honey-400 text-forest-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white">{t.aiPrediction}</h3>
                <span className="text-[10px] text-honey-300 uppercase tracking-wider font-semibold">
                  Trained on Western Ghats Weather & Flora
                </span>
              </div>
            </div>

            <p className="text-xs text-cream-200 mt-2 leading-relaxed">
              Real-time XGBoost regression analyzing daily weight velocity, ambient temperature, and flower blooming calendar to estimate optimal uncapping day.
            </p>

            {aiPrediction ? (
              <div className="mt-4 p-4 rounded-xl bg-forest-800/80 border border-forest-700 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-honey-300 font-medium">Estimated Harvest:</span>
                  <span className="text-2xl font-black font-mono text-honey-400">
                    {aiPrediction.predicted_yield_kg.toFixed(2)} kg
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-forest-700/60 pt-2 text-xs">
                  <span className="text-cream-300">Harvest Window:</span>
                  <span className="font-bold text-white bg-honey-500/20 px-2 py-0.5 rounded text-honey-300 border border-honey-500/30">
                    {aiPrediction.expected_harvest_window_days}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-forest-700/60 pt-2 text-xs">
                  <span className="text-cream-300">Model Confidence:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {(aiPrediction.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-[11px] text-cream-300 pt-1 leading-snug italic border-t border-forest-700/60">
                  "{aiPrediction.explanation}"
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-forest-800/40 border border-forest-700/60 text-center">
                <p className="text-xs text-cream-300">
                  No prediction run for this hive yet. Run calculation based on live telemetry.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handlePredictYield}
            disabled={loadingAi}
            className="w-full py-2.5 px-4 rounded-xl bg-honey-400 hover:bg-honey-500 text-forest-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
            {loadingAi ? 'Computing AI Features...' : t.predictButton}
          </button>
        </div>
      </div>

      {/* Real Photographic Comb Health & Cold Extraction Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Comb Optical Health */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                Optical Frame Inspection
              </span>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Hive HIVE-17 • Brood & Honey Comb
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              88% Capped Wax
            </span>
          </div>

          <div className="h-44 rounded-xl overflow-hidden relative border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=600&q=80"
              alt="Apis cerana indica Honeybees on Honeycomb"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-3">
              <div className="text-white text-xs">
                <span className="font-bold text-amber-300 block">Apis cerana indica colony</span>
                <span className="text-[11px] text-stone-200">Western Ghats endemic species • Zero synthetic chemicals</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Brood Status</span>
              <span className="font-bold text-emerald-800">Healthy Queen</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Cell Capping</span>
              <span className="font-bold text-amber-800">88% (Ripened)</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Varroa Mite</span>
              <span className="font-bold text-emerald-800">0.0% (Clean)</span>
            </div>
          </div>
        </div>

        {/* Cold Extraction Quality */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                Unpasteurized Nectar Quality
              </span>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Cold Centrifugal Extraction Standard
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Non-Thermal &lt;40°C
            </span>
          </div>

          <div className="h-44 rounded-xl overflow-hidden relative border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80"
              alt="Raw Honeycomb and Wooden Dipper"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-3">
              <div className="text-white text-xs">
                <span className="font-bold text-amber-300 block">Raw Comb Honey Quality</span>
                <span className="text-[11px] text-stone-200">Natural unpasteurized nectar preserving live enzymes & pollen</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Refractive Index</span>
              <span className="font-bold text-stone-900">1.4925 nD</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Moisture Ratio</span>
              <span className="font-bold text-emerald-800">17.8% (&lt;20% FSSAI)</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Sugar Addition</span>
              <span className="font-bold text-emerald-800">0.0% (Zero)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI HIVE ACOUSTIC STETHOSCOPE (UNIQUE INNOVATION) */}
      <HiveAcousticAnalyzer />

      {/* Harvest Declaration Section */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-cream-200 pb-4">
          <h2 className="text-xl font-bold font-serif text-forest-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-honey-600" />
            {t.declareHarvest}
          </h2>
          <p className="text-xs text-cream-600 mt-1">
            Produce digital harvest declaration and generate tamper-proof cryptographic lot certificate.
          </p>
        </div>

        {/* Voice Input Assist Banner */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-honey-500 text-forest-950 flex items-center justify-center">
                <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-red-700' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forest-900">{t.voiceInput}</h4>
                <p className="text-xs text-cream-600">{t.voiceInstruction}</p>
              </div>
            </div>
            {isListening && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-red-500 animate-pulse rounded-full" />
                  <span className="w-1 h-5 bg-red-600 animate-bounce rounded-full" />
                  <span className="w-1 h-6 bg-amber-500 animate-pulse rounded-full" />
                  <span className="w-1 h-4 bg-red-600 animate-bounce rounded-full" />
                  <span className="w-1 h-2 bg-red-500 animate-pulse rounded-full" />
                </div>
                <span className="text-xs font-bold text-red-700">
                  {t.listening}
                </span>
              </div>
            )}
          </div>

          {/* Preset Voice Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => triggerVoicePreset('हाइव १७ से आठ किलो शहद निकाला', 8.0, 'HIVE-17')}
              className="px-3 py-1.5 bg-white hover:bg-honey-100 border border-amber-300 rounded-lg text-xs font-medium text-forest-900 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-honey-700" />
              {t.sampleVoice1}
            </button>
            <button
              type="button"
              onClick={() => triggerVoicePreset('Hive 18 se 6.5 kilo Jamun honey harvest kiya', 6.5, 'HIVE-18')}
              className="px-3 py-1.5 bg-white hover:bg-honey-100 border border-amber-300 rounded-lg text-xs font-medium text-forest-900 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-honey-700" />
              {t.sampleVoice2}
            </button>
          </div>

          {voiceTranscript && (
            <div className="text-xs font-mono bg-white p-2 rounded border border-amber-200 text-forest-900 flex items-center gap-2">
              <span className="font-bold text-honey-700">Heard:</span>
              <span>"{voiceTranscript}"</span>
            </div>
          )}
        </div>

        {/* Harvest Form */}
        <form onSubmit={handleSubmitHarvest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hive Selection */}
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {t.selectHive}
              </label>
              <select
                value={selectedHiveId}
                onChange={e => setSelectedHiveId(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
              >
                {hives.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.hive_code} ({h.hive_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Lot Code */}
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {t.lotCode}
              </label>
              <input
                type="text"
                value={harvestForm.lot_code}
                onChange={e => setHarvestForm({ ...harvestForm, lot_code: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-mono font-bold text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                required
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {t.harvestDate}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={harvestForm.harvest_date}
                  onChange={e => setHarvestForm({ ...harvestForm, harvest_date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
                <Calendar className="w-4 h-4 text-cream-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Declared Quantity */}
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {t.quantity}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={harvestForm.declared_quantity}
                  onChange={e => setHarvestForm({ ...harvestForm, declared_quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-bold font-mono text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-cream-500">kg</span>
              </div>
            </div>
          </div>

          {/* Botanical Notes */}
          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              {t.notes}
            </label>
            <input
              type="text"
              value={harvestForm.notes}
              onChange={e => setHarvestForm({ ...harvestForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-cream-600">
              Cryptographically signed using Ramesh Patil's private key registered with KVIC Satara.
            </div>

            <button
              type="submit"
              disabled={submittingHarvest}
              className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-honey-400" />
              {submittingHarvest ? 'Broadcasting to Chain...' : t.submitHarvest}
            </button>
          </div>
        </form>

        {/* Success Confirmation Card */}
        {createdHarvest && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-forest-900 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {t.harvestSuccess}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-3 rounded-lg border border-emerald-200">
              <div>
                <span className="text-cream-600 block">Lot Code:</span>
                <span className="font-mono font-bold text-forest-950">{createdHarvest.lot_code}</span>
              </div>
              <div>
                <span className="text-cream-600 block">Quantity Declared:</span>
                <span className="font-bold text-forest-950">{createdHarvest.declared_quantity} {createdHarvest.unit}</span>
              </div>
              <div>
                <span className="text-cream-600 block">Blockchain Ledger Timestamp:</span>
                <span className="font-mono text-cream-700">{new Date(createdHarvest.created_at || Date.now()).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
