import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import LiquidGlass from 'liquid-glass-react';
import * as THREE from 'three';

import { motion } from 'framer-motion';

const PlayButton3D = () => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -4,
        boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.4)"
      }}
      whileTap={{
        scale: 0.95,
        y: 2,
        boxShadow: "0px 5px 10px rgba(59, 130, 246, 0.4)"
      }}
      className="relative group bg-[#3b82f6] text-white px-12 py-5 rounded-full font-black text-4xl lowercase tracking-tighter shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-colors hover:bg-blue-400 border-b-4 border-blue-700 active:border-b-0 active:mt-1"
    >
      Explore
    </motion.button>
  );
};

const Typewriter = ({ phrases }) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && text === currentPhrase) {
      setTimeout(() => setIsDeleting(true), 2500);
      return;
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentPhrase.substring(0, prev.length - 1)
          : currentPhrase.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases]);

  return (
    <div className="font-semibold text-[1.1rem] text-white h-14 flex flex-wrap items-center leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      {text}
      <span className="ml-[2px] w-[2px] h-[1em] bg-blue-500 animate-pulse inline-block"></span>
    </div>
  );
};

/* 
  DARK GLASSMORPHISM 3D CARD
  Replicating the premium glossy 3D aesthetic from the user's reference image
*/
const Card = ({ title, highlight, subtitle, iconHtml, bottomItems }) => {
  const cardRef = React.useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'all 0.5s ease'
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-6 to 6 degrees to feel premium and subtle)
    const rotateY = -1 * ((x / rect.width) * 12 - 6);
    const rotateX = (y / rect.height) * 12 - 6;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s ease'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="group relative bg-[#1c1d24]/70 backdrop-blur-2xl rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_48px_rgba(100,100,255,0.2)] hover:border-white/20 z-10"
    >

      {/* Subtle inner top-light to simulate 3D glass edge */}
      {/* Animated Glowing Orb Background significantly expanded to fill the entire red bounding box natively */}
      <div className="absolute inset-x-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-none z-0 mix-blend-screen overflow-hidden w-full h-full">
        {/* Main Purple Blob */}
        <div className="absolute top-0 -left-[10%] w-[120vw] h-[120vh] max-w-[1200px] max-h-[1200px] bg-purple-600/60 rounded-full blur-[120px] animate-blob"></div>
        {/* Indigo Blob */}
        <div className="absolute top-[10%] -right-[10%] w-[110vw] h-[110vh] max-w-[1100px] max-h-[1100px] bg-[#5b21b6]/50 rounded-full blur-[140px] animate-blob animation-delay-2000"></div>
        {/* Blue intense core Blob */}
        <div className="absolute top-[20%] left-[20%] w-[80vw] h-[80vh] max-w-[800px] max-h-[800px] bg-blue-500/40 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Inner glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="p-7 relative z-10">
        <div className="flex items-start gap-4 mb-4">
          {/* Dark Mode Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent shadow-inner flex items-center justify-center shrink-0 border border-white/10" dangerouslySetInnerHTML={{ __html: iconHtml }}></div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {title}<span className={highlight.color}> {highlight.text}</span>
            </h3>
            <p className="text-sm text-gray-400 font-medium mt-1">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/40 px-6 py-5 relative z-10">
        <div className="flex justify-between items-center text-center">
          {bottomItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 px-1 w-1/3">
              <div className="text-gray-500 group-hover:text-blue-400 transition-colors drop-shadow-md" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
              <span className="text-[9px] font-bold text-gray-500 group-hover:text-gray-300 uppercase tracking-widest leading-tight transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoaded1, setIsLoaded1] = useState(false);
  const splineRef1 = useRef(null);

  const [isLoaded2, setIsLoaded2] = useState(false);
  const splineRef2 = useRef(null);

  const [isLoaded3, setIsLoaded3] = useState(false);
  const splineRef3 = useRef(null);

  const [isLoaded4, setIsLoaded4] = useState(false);
  const splineRef4 = useRef(null);

  const typingPhrases = [
    "Accelerating your digital transformation.",
    "Custom solutions built on BTP for the modern SAP world.",
    "Optimizing your SAP landscape with AI Intelligence."
  ];

  /* Updated Navis Cards Data with Neon Tailwind Colors */
  const cardsData = [
    {
      title: "Navis", highlight: { text: "Approvals", color: "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" },
      subtitle: "Workflow Automation",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-blue-400" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8l7.5 15H4.5L12 5.8z"/></svg>',
      bottomItems: [
        { label: "PO Approvals", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
        { label: "Budget Approvals", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
        { label: "Sales Order", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>' }
      ]
    },
    {
      title: "Navis", highlight: { text: "Master", color: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" },
      subtitle: "Master Data Governance",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-emerald-400" fill="currentColor"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z"/></svg>',
      bottomItems: [
        { label: "Data Creation", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>' },
        { label: "Clean-Up", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>' },
        { label: "Enforcement", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' }
      ]
    },
    {
      title: "Navis", highlight: { text: "DMS", color: "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" },
      subtitle: "Document Management",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-indigo-400" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>',
      bottomItems: [
        { label: "Migration", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>' },
        { label: "Cloud Storage", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>' },
        { label: "Compliance", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' }
      ]
    },
    {
      title: "Navis", highlight: { text: "Finance", color: "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" },
      subtitle: "Financial Intelligence",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-amber-400" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
      bottomItems: [
        { label: "AP Automation", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>' },
        { label: "AR Collections", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
        { label: "Insights", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>' }
      ]
    },
    {
      title: "Navis", highlight: { text: "Procure", color: "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" },
      subtitle: "Smart Procurement",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-orange-400" fill="currentColor"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      bottomItems: [
        { label: "PR Creation", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' },
        { label: "Supplier Dash", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' },
        { label: "Spend Analysis", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>' }
      ]
    },
    {
      title: "Navis", highlight: { text: "Access", color: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" },
      subtitle: "Security & Access Control",
      iconHtml: '<svg viewBox="0 0 24 24" class="w-6 h-6 text-cyan-400" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
      bottomItems: [
        { label: "Requests", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>' },
        { label: "User Lifecycle", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
        { label: "Monitoring", icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>' }
      ]
    }
  ];

  function onLoadScene1(splineApp) {
    splineRef1.current = splineApp;
    setIsLoaded1(true);

    try {
      const scene = splineApp._scene || splineApp.scene;
      if (scene) {
        // Force the Spline scene background to match our dark theme
        if (scene.background) {
          scene.background = new THREE.Color('#0c0d12');
        }

        scene.traverse((child) => {
          const lowerName = (child.name || '').toLowerCase();
          if (
            lowerName.includes("button") ||
            lowerName.includes("text") ||
            lowerName.includes("logo") ||
            lowerName.includes("watermark") ||
            lowerName.includes("branding") ||
            lowerName.includes("spline") ||
            lowerName.includes("built") ||
            lowerName.includes("rectangle") ||
            lowerName.includes("shape") ||
            lowerName.includes("group") ||
            child.type === 'Text' ||
            child.type === 'TextGeometry' ||
            child.type === 'ShapeGeometry'
          ) {
            child.visible = false;
          }
        });
      }
    } catch (e) {
      console.error('Spline traversal error:', e);
    }
  }

  function onLoadScene2(splineApp) {
    splineRef2.current = splineApp;
    setIsLoaded2(true);

    try {
      const scene = splineApp._scene || splineApp.scene;
      if (scene) {
        scene.traverse((child) => {
          const lowerName = (child.name || '').toLowerCase();
          // The discord UI elements use standard vector shapes and texts
          // By hiding these, we strip away the entire UI leaving only the animated 3D background orb!
          if (
            lowerName.includes("text") ||
            lowerName.includes("window") ||
            lowerName.includes("ui") ||
            lowerName.includes("discord") ||
            lowerName.includes("card") ||
            lowerName.includes("rectangle") ||
            lowerName.includes("shape") ||
            lowerName.includes("image") ||
            lowerName.includes("avatar") ||
            lowerName.includes("vector") ||
            lowerName.includes("path") ||
            child.type === 'Text' ||
            child.type === 'TextGeometry' ||
            child.type === 'ShapeGeometry'
          ) {
            child.visible = false;
          }
        });
      }
    } catch (e) {
      console.error('Spline traversal error:', e);
    }
  }

  function onLoadScene3(splineApp) {
    splineRef3.current = splineApp;
    setIsLoaded3(true);

    try {
      const scene = splineApp._scene || splineApp.scene;
      if (scene) {
        scene.traverse((child) => {
          const lowerName = (child.name || '').toLowerCase();
          if (
            lowerName.includes("text") ||
            lowerName.includes("button") ||
            lowerName.includes("ui") ||
            lowerName.includes("logo") ||
            lowerName.includes("background") ||
            lowerName.includes("data") ||
            lowerName.includes("security") ||
            lowerName.includes("genai") ||
            lowerName.includes("cloud") ||
            lowerName.includes("nonsense") ||
            lowerName.includes("fill") ||
            child.type === 'Text' ||
            child.type === 'TextGeometry' ||
            child.type === 'ShapeGeometry'
          ) {
            child.visible = false;
          }
        });
      }
    } catch (e) {
      console.error('Spline traversal error:', e);
    }
  }

  function onLoadScene4(splineApp) {
    splineRef4.current = splineApp;
    setIsLoaded4(true);

    try {
      const scene = splineApp._scene || splineApp.scene;
      if (scene) {
        scene.traverse((child) => {
          const lowerName = (child.name || '').toLowerCase();
          if (
            lowerName.includes("text") ||
            lowerName.includes("clarity") ||
            lowerName.includes("focus") ||
            lowerName.includes("impact") ||
            lowerName.includes("complex") ||
            lowerName.includes("ideas") ||
            lowerName.includes("experiences") ||
            child.type === 'Text' ||
            child.type === 'TextGeometry'
          ) {
            child.visible = false;
          }
        });
      }
    } catch (e) {
      console.error('Spline traversal error:', e);
    }
  }

  const scrollToCards = () => {
    document.getElementById('cards-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#1c1d24] overflow-x-hidden selection:bg-blue-500/30">

      {/* FIXED GLOBAL NAV BAR: Centered via flex-container to match your red rectangle exactly */}
      <div className="fixed top-6 inset-x-0 z-[1001] flex justify-center pointer-events-none px-4">
        <div className="w-full max-w-[1240px] pointer-events-auto">
          <LiquidGlass
            displacementScale={32}
            blurAmount={0.2}
            saturation={140}
            aberrationIntensity={1.5}
            elasticity={0.3}
            cornerRadius={24}
            className="w-full"
          >
            <header className="w-full h-14 px-8 flex justify-between items-center bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="font-bold text-lg md:text-xl tracking-tight text-white flex items-center gap-2 cursor-pointer no-underline">
                <div className="w-7 h-7 rounded shrink-0 bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                Enterprise<span className="text-blue-400">AI</span>
              </div>
              <nav className="flex items-center gap-4 md:gap-8 text-[11px] font-bold text-gray-300 uppercase tracking-widest no-underline">
                <a href="#solution" className="hover:text-blue-400 transition-colors">Solution</a>
                <a href="#products" className="hover:text-blue-400 transition-colors">Products</a>
                <a href="#joule" className="hover:text-blue-400 transition-colors">Joule & AI</a>
              </nav>
            </header>
          </LiquidGlass>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative w-screen h-screen overflow-hidden bg-[#0c0d12]">
        <div className={`absolute inset-0 w-full h-full z-0 flex items-center justify-center transition-opacity duration-1000 ${isLoaded1 ? 'opacity-100' : 'opacity-0'}`}>
          <Spline
            scene="https://prod.spline.design/DitrmZN8NNhKZyNJ/scene.splinecode"
            onLoad={onLoadScene1}
          />
        </div>

        {/* Physical Watermark Blocker: Matches the light blue wash in your screenshot (#cbd5e1) */}
        <div className="absolute right-2 bottom-3 w-48 h-12 bg-[#cbd5e1] pointer-events-none z-[1002]"></div>

        <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d12] via-[#0c0d12]/60 to-transparent w-full md:w-[70%] z-0 pointer-events-none"></div>

          <div className="h-32"></div> {/* Spacer for fixed header */}

          <main className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col justify-center pointer-events-auto">
            <div className="w-full md:w-[60%] lg:w-[45%] lg:pr-10">
              <h1 className="text-[2.75rem] md:text-[4rem] font-bold text-white leading-[1.1] tracking-tight mb-6 mt-[-40px]">
                Innovating the<br /> Future of<br /> Enterprise
              </h1>

              <div className="mb-10 max-w-[95%]">
                <Typewriter phrases={typingPhrases} />
              </div>

              <div className="flex flex-wrap items-center mt-6">
                <PlayButton3D />
              </div>
            </div>
          </main>

          <footer className="relative z-10 w-full pb-8 pointer-events-none flex justify-center">
            <div onClick={scrollToCards} className="animate-bounce pointer-events-auto cursor-pointer text-[#4b5563] hover:text-[#111827] transition-colors pb-6">
              <svg className="w-8 h-8 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </footer>
        </div>
      </section>

      {/* SECTION 2: DARK GLASSMORPHISM WITH REAL SPLINE BACKGROUND */}
      <section id="cards-section" className="relative w-screen min-h-screen bg-[#13141c] flex flex-col items-center overflow-hidden">

        {/* Real Spline 3D Background from user Spline URL */}
        <div className={`absolute inset-0 w-full h-full z-0 flex items-center justify-center transition-opacity duration-1000 ${isLoaded2 ? 'opacity-100' : 'opacity-0'}`}>
          <Spline
            scene="https://prod.spline.design/gfue0daUveDZoopL/scene.splinecode"
            onLoad={onLoadScene2}
          />
        </div>

        {/* UI Overlay: Custom Premium Navis Cards */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-28 md:px-16 flex flex-col justify-center pointer-events-auto min-h-screen">

          <div className="mb-14 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 drop-shadow-sm">Enterprise Suite</h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Discover our cohesive, SAP-optimized suite tailored perfectly for the next generation of business intelligence.
            </p>
          </div>

          {/* Standard 3-column responsive layout, using extreme 3D shadow depth to mimic floating cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {cardsData.map((card, idx) => (
              <Card key={idx} {...card} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: CORE METRICS STATS WITH NEON RINGS 3D SPLINE BACKGROUND */}
      <section className="relative w-screen min-h-[70vh] bg-black flex flex-col items-center justify-center overflow-hidden">

        {/* Real Spline 3D Digital Rings Background */}
        <div className={`absolute inset-0 w-full h-full z-0 flex items-center justify-center transition-opacity duration-1000 ${isLoaded3 ? 'opacity-100' : 'opacity-0'}`}>
          <Spline
            scene="https://prod.spline.design/HydzP48rVjzrJQJ0/scene.splinecode"
            onLoad={onLoadScene3}
          />
        </div>

        {/* Heavy obscure layer applied perfectly over the Spline text coordinates to obliterate it visually if the meshes resist API hiding */}
        <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none"></div>

        {/* Premium Floating Metric Cards Overlay encased in an additional massive blur container to further mask out Spline background text */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-28 flex flex-col items-center justify-center mt-auto pointer-events-none">

          <div className="w-full backdrop-blur-3xl bg-black/40 rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20 relative overflow-hidden">

            {/* Subtle internal shine for the glass block */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>

            <div className="flex flex-col items-center text-center group z-10 transition-transform duration-500 hover:scale-105">
              <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] mb-4 transition-all duration-500 group-hover:drop-shadow-[0_0_35px_rgba(34,211,238,0.8)]">500+</span>
              <h4 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-3 drop-shadow-md">Global Partners</h4>
              <div className="h-1 w-12 bg-blue-500 mb-4 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              <p className="text-sm text-gray-300 max-w-[250px] font-medium opacity-90 leading-relaxed drop-shadow-lg">Trusted by the world’s leading enterprises for mission-critical digital expansion.</p>
            </div>

            <div className="flex flex-col items-center text-center group z-10 transition-transform duration-500 hover:scale-105">
              <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-600 drop-shadow-[0_0_20px_rgba(232,121,249,0.6)] mb-4 transition-all duration-500 group-hover:drop-shadow-[0_0_35px_rgba(232,121,249,0.8)]">99.9%</span>
              <h4 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-3 drop-shadow-md">Uptime Guarantee</h4>
              <div className="h-1 w-12 bg-fuchsia-500 mb-4 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
              <p className="text-sm text-gray-300 max-w-[250px] font-medium opacity-90 leading-relaxed drop-shadow-lg">Engineered with fail-safe redundancies for absolute SAP operational security.</p>
            </div>

            <div className="flex flex-col items-center text-center group z-10 transition-transform duration-500 hover:scale-105">
              <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] mb-4 transition-all duration-500 group-hover:drop-shadow-[0_0_35px_rgba(251,191,36,0.8)]">24/7</span>
              <h4 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-3 drop-shadow-md">Expert Support</h4>
              <div className="h-1 w-12 bg-amber-500 mb-4 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
              <p className="text-sm text-gray-300 max-w-[250px] font-medium opacity-90 leading-relaxed drop-shadow-lg">An elite team of SAP technicians operating continuously across all global regions.</p>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 4: 3D ANIMATED ENTERPRISE FOOTER */}
      <footer className="relative w-screen min-h-[60vh] bg-[#0c0d12] flex flex-col items-center justify-end overflow-hidden pb-8 pt-32">

        {/* Real Spline 3D Wave Background */}
        <div className={`absolute inset-0 w-full h-full z-0 flex items-center justify-center transition-opacity duration-1000 ${isLoaded4 ? 'opacity-100' : 'opacity-0'}`}>
          <Spline
            scene="https://prod.spline.design/SFvQ01RGA1JMF2AF/scene.splinecode"
            onLoad={onLoadScene4}
          />
        </div>

        {/* Deep gradient fade so the dense footer text is perfectly legible over the wave */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0c0d12] to-transparent pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-10 flex flex-col pointer-events-auto">

          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-2 border-b border-white/10 pb-12 mb-8">

            {/* Left: Branding */}
            <div className="flex flex-col max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(37,99,235,0.8)]">C</div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-wide">CANOPUS</span>
                  <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Global Business Services</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Delivering enterprise-grade architecture and development on SAP BTP to transform your business processes.
              </p>
            </div>

            {/* Middle: Links */}
            <div className="flex flex-col">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Platform Solutions</a></li>
                <li><a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Consulting Services</a></li>
                <li><a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Partner Network</a></li>
              </ul>
            </div>

            {/* Right: Contact */}
            <div className="flex flex-col max-w-sm">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <span className="text-white font-medium">USA</span>
                <span>Canopus GBS Inc</span>
                <span>200 S Washington St, Suite 300, Crawfordsville, Indiana 47933, USA</span>
                <span>Phone: <a href="tel:+17372281454" className="text-blue-400 hover:text-blue-300">+1 (737) 228-1454</a></span>
                <span>Email: <a href="mailto:info_USA@canopusgbs.com" className="text-blue-400 hover:text-blue-300">info_USA@canopusgbs.com</a></span>
              </div>
            </div>

          </div>

          {/* Copyright Row */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 pt-6 mt-4">
            <span>© 2026 Canopus GBS. All rights reserved.</span>
            <div className="flex gap-6 mt-4 md:mt-0 text-2xl">
              <a href="#" className="hover:text-blue-400 transition-transform hover:scale-110 text-gray-400">🌍</a>
              <a href="#" className="hover:text-blue-400 transition-transform hover:scale-110 text-gray-400 font-bold uppercase">in</a>
              <a href="#" className="hover:text-blue-400 transition-transform hover:scale-110 text-gray-400">✉</a>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}