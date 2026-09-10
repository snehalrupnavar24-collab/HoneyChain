import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles, RotateCw, CheckCircle2, Layers, QrCode } from 'lucide-react';

export const HoneyJar3DViewer: React.FC = () => {
  const { lang, t } = useLanguage();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Variety state: 'jamun' | 'acacia' | 'mangrove'
  const [variety, setVariety] = useState<'jamun' | 'acacia' | 'mangrove'>('jamun');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References for Three.js objects
  const honeyMeshRef = useRef<THREE.Mesh | null>(null);
  const honeyGlowLightRef = useRef<THREE.PointLight | null>(null);
  const jarGroupRef = useRef<THREE.Group | null>(null);

  // Variety color config
  const varietyColors = {
    jamun: {
      color: 0xd97706, // Rich golden amber
      lightColor: 0xf59e0b,
      ior: 1.54,
      name: t.viewer3d.jamun,
      code: 'PKG-MAHA-042',
      origin: lang === 'mr' ? 'महाबळेश्वर, सह्याद्री' : (lang === 'hi' ? 'महाबलेश्वर, सह्याद्री' : 'Mahabaleshwar, Western Ghats'),
      purity: '99.1%'
    },
    acacia: {
      color: 0xfbbf24, // Pale luminous golden straw
      lightColor: 0xfef08a,
      ior: 1.50,
      name: t.viewer3d.acacia,
      code: 'PKG-JK-019',
      origin: lang === 'mr' ? 'काश्मीर खोरे' : (lang === 'hi' ? 'कश्मीर घाटी' : 'Kashmir Valley'),
      purity: '99.4%'
    },
    mangrove: {
      color: 0xb45309, // Deep wild reddish amber
      lightColor: 0xd97706,
      ior: 1.56,
      name: t.viewer3d.mangrove,
      code: 'PKG-WB-088',
      origin: lang === 'mr' ? 'सुंदरबन खारफुटी' : (lang === 'hi' ? 'सुंदरबन मैंग्रोव' : 'Sunderbans Mangrove'),
      purity: '98.8%'
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = 400;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfef3c7, 1.5);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    // Internal Glow PointLight inside the honey liquid
    const honeyGlowLight = new THREE.PointLight(varietyColors[variety].lightColor, 2.2, 3);
    honeyGlowLight.position.set(0, 0, 0);
    scene.add(honeyGlowLight);
    honeyGlowLightRef.current = honeyGlowLight;

    // 5. Jar Assembly Group
    const jarGroup = new THREE.Group();
    scene.add(jarGroup);
    jarGroupRef.current = jarGroup;

    // A. Glass Body Material (Physical Glass with refraction)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.92,
      thickness: 0.5,
      ior: 1.52,
      transparent: true,
      opacity: 0.75,
      reflectivity: 0.9,
    });

    // Outer Glass Jar Cylinder
    const glassGeometry = new THREE.CylinderGeometry(0.95, 0.9, 2.0, 48, 1);
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    jarGroup.add(glassMesh);

    // Glass Base Bottom
    const baseGeometry = new THREE.CylinderGeometry(0.9, 0.92, 0.14, 48);
    const baseMesh = new THREE.Mesh(baseGeometry, glassMaterial);
    baseMesh.position.y = -1.02;
    jarGroup.add(baseMesh);

    // Glass Shoulder & Neck
    const shoulderGeometry = new THREE.CylinderGeometry(0.72, 0.95, 0.28, 48);
    shoulderGeometry.translate(0, 1.1, 0);
    const shoulderMesh = new THREE.Mesh(shoulderGeometry, glassMaterial);
    jarGroup.add(shoulderMesh);

    const neckGeometry = new THREE.CylinderGeometry(0.72, 0.72, 0.25, 48);
    neckGeometry.translate(0, 1.32, 0);
    const neckMesh = new THREE.Mesh(neckGeometry, glassMaterial);
    jarGroup.add(neckMesh);

    // B. Inner Golden Honey Liquid
    const honeyMaterial = new THREE.MeshPhysicalMaterial({
      color: varietyColors[variety].color,
      emissive: varietyColors[variety].color,
      emissiveIntensity: 0.22,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.55,
      thickness: 1.2,
      ior: 1.54,
      transparent: true,
      opacity: 0.94,
    });

    const honeyGeometry = new THREE.CylinderGeometry(0.87, 0.83, 1.75, 40);
    honeyGeometry.translate(0, -0.08, 0);
    const honeyMesh = new THREE.Mesh(honeyGeometry, honeyMaterial);
    jarGroup.add(honeyMesh);
    honeyMeshRef.current = honeyMesh;

    // C. Carved Wooden Lid
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.65,
      metalness: 0.05,
    });
    const lidGeometry = new THREE.CylinderGeometry(0.82, 0.82, 0.32, 48);
    lidGeometry.translate(0, 1.54, 0);
    const lidMesh = new THREE.Mesh(lidGeometry, woodMaterial);
    jarGroup.add(lidMesh);

    // Lid Rim bevel
    const lidRimGeometry = new THREE.CylinderGeometry(0.86, 0.86, 0.08, 48);
    lidRimGeometry.translate(0, 1.44, 0);
    const lidRimMesh = new THREE.Mesh(lidRimGeometry, woodMaterial);
    jarGroup.add(lidRimMesh);

    // D. Gold Holographic Tamper Ribbon on Lid
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ribbonGeometry = new THREE.CylinderGeometry(0.74, 0.74, 0.12, 48);
    ribbonGeometry.translate(0, 1.32, 0);
    const ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    jarGroup.add(ribbonMesh);

    // E. Realistic Label Band around Jar with Canvas Texture
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      // Cream background
      ctx.fillStyle = '#FCF8ED';
      ctx.fillRect(0, 0, 1024, 512);

      // Gold border stripes
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 984, 472);

      // KVIC Header
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('HONEYCHAIN • 100% PURE RAW HONEY', 512, 85);

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('KVIC & FSSAI GOVERNMENT VERIFIED BOTANICAL ORIGIN', 512, 130);

      // Main product badge
      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 44px serif';
      ctx.fillText('MAHABALESHWAR WILD JAMUN', 512, 210);

      ctx.fillStyle = '#374151';
      ctx.font = '24px sans-serif';
      ctx.fillText('Cold-Settled (<45°C) • Zero Invert Cane Sugar • Lead-Free Glass', 512, 260);

      // Batch tag & micro QR representation
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('BATCH: PKG-MAHA-042-2697  |  BLOCK #840912', 512, 330);

      // Fake QR pattern
      ctx.fillStyle = '#111827';
      ctx.fillRect(80, 360, 100, 100);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(95, 375, 70, 70);
      ctx.fillStyle = '#111827';
      ctx.fillRect(110, 390, 40, 40);

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✓ NABL IRMS ISOTOPE TESTED: 0.0% C4 SUGAR', 210, 400);
      ctx.fillText('✓ SHA-256 CRYPTOGRAPHIC TAMPER SEAL', 210, 435);
    }

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.5,
      metalness: 0.1,
    });

    const labelGeometry = new THREE.CylinderGeometry(0.955, 0.915, 0.95, 48, 1, true);
    labelGeometry.translate(0, -0.05, 0);
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    jarGroup.add(labelMesh);

    // Initial tilt for realistic tabletop angle
    jarGroup.rotation.x = 0.12;
    jarGroup.rotation.y = 0.35;

    // 6. Animation Loop
    let animationFrameId: number;
    let autoRotateSpeed = 0.007;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotating && !isDragging && jarGroupRef.current) {
        jarGroupRef.current.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Mouse / Touch Drag Handlers
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !jarGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      jarGroupRef.current.rotation.y += deltaX * 0.008;
      jarGroupRef.current.rotation.x += deltaY * 0.004;

      // Limit pitch
      jarGroupRef.current.rotation.x = Math.max(-0.25, Math.min(0.4, jarGroupRef.current.rotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Responsive resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Update honey color when variety changes
  useEffect(() => {
    const config = varietyColors[variety];
    if (honeyMeshRef.current) {
      const mat = honeyMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.setHex(config.color);
      mat.emissive.setHex(config.color);
      mat.ior = config.ior;
    }
    if (honeyGlowLightRef.current) {
      honeyGlowLightRef.current.color.setHex(config.lightColor);
    }
  }, [variety]);

  return (
    <div className="bg-gradient-to-br from-[#FEFAF0] via-[#FAF4E6] to-[#F7EED9] rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.viewer3d.tag}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight mt-1.5">
            {t.viewer3d.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 max-w-2xl leading-relaxed">
            {t.viewer3d.subtitle}
          </p>
        </div>

        {/* Variety Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setVariety('jamun')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              variety === 'jamun'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-300'
            }`}
          >
            {t.viewer3d.jamun}
          </button>
          <button
            type="button"
            onClick={() => setVariety('acacia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              variety === 'acacia'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-300'
            }`}
          >
            {t.viewer3d.acacia}
          </button>
          <button
            type="button"
            onClick={() => setVariety('mangrove')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              variety === 'mangrove'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-300'
            }`}
          >
            {t.viewer3d.mangrove}
          </button>
        </div>
      </div>

      {/* 3D Canvas + Technical Specification HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Cols: Interactive 3D WebGL Canvas */}
        <div className="lg:col-span-7 bg-radial from-amber-50/60 to-amber-100/40 rounded-3xl border border-amber-300/80 shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
          {/* Subtle 3D background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-80 h-80 rounded-full border-2 border-dashed border-amber-600" />
            <div className="w-56 h-56 rounded-full border border-amber-500" />
          </div>

          {/* Three.js Canvas Container */}
          <div 
            ref={mountRef} 
            className="w-full h-[400px] cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
            title="Click and drag horizontally to spin the 3D Honey Jar"
          />

          {/* Floating HUD Controls & Hint */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
            <div className="bg-stone-900/80 backdrop-blur-xs text-amber-200 px-3 py-1 rounded-xl text-[11px] font-mono font-medium shadow-sm border border-stone-700/80 flex items-center gap-1.5">
              <span>{t.viewer3d.hint}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                isAutoRotating
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                  : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
              <span>{t.viewer3d.autoRotate}</span>
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Technical Physical Inspection Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Variety Card */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="uppercase tracking-wider">{varietyColors[variety].name}</span>
              <span className="font-mono bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                {varietyColors[variety].code}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-amber-50/70 p-2 rounded-xl">
                <span className="text-stone-500 block text-[10px]">{t.batchCard.locationLabel}:</span>
                <span className="font-bold text-stone-900">{varietyColors[variety].origin}</span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl">
                <span className="text-emerald-700 block text-[10px]">{t.batchCard.purityLabel}:</span>
                <span className="font-bold text-emerald-900 font-mono">{varietyColors[variety].purity} PURE</span>
              </div>
            </div>
          </div>

          {/* 3 Physical Marker Inspection Points */}
          <div className="space-y-2.5">
            {/* Marker 1 */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">{t.viewer3d.glassSpec}</span>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  {lang === 'mr' 
                    ? 'अन्न-सुरक्षित पारदर्शक काच, शून्य विषारी घटक. मधातील अँटिऑक्सिडंट्स टिकवून ठेवते.'
                    : (lang === 'hi' 
                      ? 'सीसा-मुक्त खाद्य ग्रेड कांच जो शहद के प्राकृतिक एंटीऑक्सीडेंट्स और एंजाइम को सुरक्षित रखता है।'
                      : 'Lead-free transparent glass preserving natural diastase enzymes and antioxidant value.')}
                </p>
              </div>
            </div>

            {/* Marker 2 */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">{t.viewer3d.coldSettled}</span>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  {lang === 'mr' 
                    ? '४५ अंशाखाली नैसर्गिक शीत प्रक्रिया. उच्च पृष्ठताण आणि शून्य साखर पाक.'
                    : (lang === 'hi' 
                      ? 'कम तापमान पर प्राकृतिक निष्कर्षण। उच्च पृष्ठ तनाव और शून्य चीनी चाशनी मिलावट।'
                      : 'Unpasteurized cold extraction below 45°C retaining active floral pollen and low 17.8% moisture.')}
                </p>
              </div>
            </div>

            {/* Marker 3 */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">{t.viewer3d.tamperSeal}</span>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  {lang === 'mr' 
                    ? 'बाटलीवर डिजिटल QR शिक्का. स्कॅन करताच थेट शेतकरी आणि NABL लॅब अहवाल उघडतो.'
                    : (lang === 'hi' 
                      ? 'जार पर चिपकी डिजिटल QR मुहर। फोन कैमरे से स्कैन करते ही सरकारी लैब रिपोर्ट खुलती है।'
                      : 'Tamper-evident holographic neck band linking directly to blockchain origin record on scan.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
