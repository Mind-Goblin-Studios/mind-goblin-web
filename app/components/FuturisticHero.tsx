'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger, createTimeline, createDrawable } from 'animejs';
import dynamic from 'next/dynamic';

// Dynamic import for Three.js cube to avoid SSR issues
const ThreeCube = dynamic(() => import('./ThreeCube'), { ssr: false });

export default function FuturisticHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const textSvgRef = useRef<SVGSVGElement>(null);
  const [showCube, setShowCube] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!containerRef.current || !sphereRef.current) return;

    const spherePathEls = sphereRef.current.querySelectorAll('.sphere path');
    const pathLength = spherePathEls.length;

    // Create individual path animations for breath effect
    const pathAnimations: ReturnType<typeof animate>[] = [];
    for (let i = 0; i < pathLength; i++) {
      pathAnimations.push(
        animate(spherePathEls[i], {
          stroke: ['rgba(255,75,75,1)', 'rgba(80,80,80,.35)'],
          translateX: [2, -4],
          translateY: [2, -4],
          ease: 'outQuad',
          duration: 500,
          autoplay: false,
        })
      );
    }

    // Breath animation - creates the pulsing wave effect
    let breathAnimationId: number;
    let startTime: number | null = null;
    
    function breathe(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const currentTime = timestamp - startTime;
      
      pathAnimations.forEach((animation, i) => {
        // Slowed down further for a more relaxed breathing effect
        const percent = (1 - Math.sin(i * 0.35 + 0.0008 * currentTime)) / 2;
        animation.seek(animation.duration * percent);
      });
      
      breathAnimationId = requestAnimationFrame(breathe);
    }

    // Intro animation - draws the paths using strokeDashoffset
    spherePathEls.forEach((path) => {
      const pathEl = path as SVGPathElement;
      const length = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = `${length}`;
      pathEl.style.strokeDashoffset = `${length}`;
    });

    const introAnimation = createTimeline({
      autoplay: true,
    }).add(spherePathEls, {
      strokeDashoffset: 0,
      duration: 3000,
      ease: 'inOutSine',
      delay: stagger(120, { start: 0, reversed: true }),
    }, 0);

    // Start sphere breathing animation
    breathAnimationId = requestAnimationFrame(breathe);

    // Animate the Mind Goblin SVG text drawing
    if (textSvgRef.current) {
      const textPaths = textSvgRef.current.querySelectorAll('.draw-text');
      
      // Create drawable for each text path
      textPaths.forEach((textPath) => {
        const drawable = createDrawable(textPath as SVGGeometryElement);
        
        animate(drawable, {
          draw: '0 1',
          duration: 6000,
          ease: 'inOutSine',
          delay: 2000,
        });
      });

      // Fill in the text with white after the draw animation completes
      animate('.draw-text', {
        fill: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
        duration: 1500,
        ease: 'inOutSine',
        delay: 5000,
      });
    }

    // Intro animation for side text
    const textTimeline = createTimeline({ autoplay: true });
    
    textTimeline
      .add('.hero-text-line', {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(200),
        duration: 1000,
        ease: 'outExpo',
      }, 500)
      .add('.hero-subtitle', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        ease: 'outExpo',
      }, 1200)
      .add('.right-text', {
        opacity: [0, 1],
        translateX: [-30, 0],
        delay: stagger(150),
        duration: 1000,
        ease: 'outExpo',
      }, 800)
      .add('.social-links a', {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 800,
        ease: 'outExpo',
      }, 1000);

    // Cleanup
    return () => {
      cancelAnimationFrame(breathAnimationId);
    };
  }, []);

  // Games view animations
  useEffect(() => {
    if (!showCube) return;

    // Animate the "Games" text
    animate('.games-title-text', {
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1000,
      ease: 'outExpo',
      delay: 500,
    });
  }, [showCube]);

  const handleShowGames = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Fade out current content
    const timeline = createTimeline({
      autoplay: true,
    });

    timeline
      .add('.sphere, .center-title-container, .hero-text-line, .hero-subtitle, .right-text, .bottom-buttons, .social-links', {
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 800,
        ease: 'inOutQuad',
      }, 0)
      .add({
        duration: 100,
        onComplete: () => {
          setShowCube(true);
          setIsTransitioning(false);
        }
      }, 800);
  };

  const handleBackToHome = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    animate('.cube-container, .games-title-text, .back-button', {
      opacity: [1, 0],
      scale: [1, 0.9],
      duration: 600,
      ease: 'inOutQuad',
      onComplete: () => {
        setShowCube(false);
        setIsTransitioning(false);
        // Re-trigger intro animations
        setTimeout(() => {
          animate('.sphere, .center-title-container, .hero-text-line, .hero-subtitle, .right-text, .bottom-buttons, .social-links', {
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 800,
            ease: 'outExpo',
          });
        }, 100);
      },
    });
  };

  const handleOpenContact = () => {
    setShowContactModal(true);
    setSubmitStatus('idle');
    // Animate modal in
    setTimeout(() => {
      animate('.contact-modal-backdrop', {
        opacity: [0, 1],
        duration: 300,
        ease: 'outQuad',
      });
      animate('.contact-modal-content', {
        opacity: [0, 1],
        scale: [0.9, 1],
        translateY: [20, 0],
        duration: 500,
        ease: 'outExpo',
      });
      animate('.modal-line', {
        scaleX: [0, 1],
        duration: 800,
        ease: 'outExpo',
        delay: stagger(100, { start: 200 }),
      });
      animate('.modal-field', {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 500,
        ease: 'outExpo',
        delay: stagger(100, { start: 300 }),
      });
    }, 10);
  };

  const handleCloseContact = () => {
    animate('.contact-modal-content', {
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 300,
      ease: 'inQuad',
    });
    animate('.contact-modal-backdrop', {
      opacity: [1, 0],
      duration: 300,
      ease: 'inQuad',
      onComplete: () => {
        setShowContactModal(false);
        setFormData({ name: '', email: '', message: '' });
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Close modal after success
    setTimeout(() => {
      handleCloseContact();
    }, 2000);
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {!showCube ? (
        <>
          {/* Left side text */}
          <div className="absolute left-8 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 z-20 max-w-md">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="hero-text-line block opacity-0">Game</span>
              <span className="hero-text-line block opacity-0">development</span>
              <span className="hero-text-line block opacity-0">studio.</span>
            </h1>
            <p className="hero-subtitle text-gray-400 text-lg md:text-xl opacity-0">
              A passionate indie studio creating<br />
              immersive gaming experiences.
            </p>
          </div>

          {/* Right side text */}
          <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-20 max-w-sm text-right">
            <p className="right-text text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed opacity-0">
              Creatives crafting new<br />
              and exciting titles
            </p>
            <p className="right-text text-lg md:text-xl text-gray-500 mt-4 opacity-0 font-light">
              新しくエキサイティングな<br />
              タイトルを創り出す
            </p>
          </div>

          {/* Center sphere with Mind Goblin */}
          <div className="relative w-[485px] h-[485px] md:w-[620px] md:h-[620px] lg:w-[690px] lg:h-[690px]">
            
            {/* The Sphere Animation */}
            <div ref={sphereRef} className="absolute inset-0 flex items-center justify-center">
              <svg className="sphere w-full h-full" viewBox="0 0 440 440" stroke="rgba(80,80,80,.35)">
                <defs>
                  <linearGradient id="sphereGradientHero" x1="5%" x2="5%" y1="0%" y2="15%">
                    <stop stopColor="#373734" offset="0%" />
                    <stop stopColor="#242423" offset="50%" />
                    <stop stopColor="#0D0D0C" offset="100%" />
                  </linearGradient>
                </defs>
                <path d="M361.604 361.238c-24.407 24.408-51.119 37.27-59.662 28.727-8.542-8.543 4.319-35.255 28.726-59.663 24.408-24.407 51.12-37.269 59.663-28.726 8.542 8.543-4.319 35.255-28.727 59.662z" />
                <path d="M360.72 360.354c-35.879 35.88-75.254 54.677-87.946 41.985-12.692-12.692 6.105-52.067 41.985-87.947 35.879-35.879 75.254-54.676 87.946-41.984 12.692 12.692-6.105 52.067-41.984 87.946z" />
                <path d="M357.185 356.819c-44.91 44.91-94.376 68.258-110.485 52.149-16.11-16.11 7.238-65.575 52.149-110.485 44.91-44.91 94.376-68.259 110.485-52.15 16.11 16.11-7.239 65.576-52.149 110.486z" />
                <path d="M350.998 350.632c-53.21 53.209-111.579 81.107-130.373 62.313-18.794-18.793 9.105-77.163 62.314-130.372 53.209-53.21 111.579-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z" />
                <path d="M343.043 342.677c-59.8 59.799-125.292 91.26-146.283 70.268-20.99-20.99 10.47-86.483 70.269-146.282 59.799-59.8 125.292-91.26 146.283-70.269 20.99 20.99-10.47 86.484-70.27 146.283z" />
                <path d="M334.646 334.28c-65.169 65.169-136.697 99.3-159.762 76.235-23.065-23.066 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z" />
                <path d="M324.923 324.557c-69.806 69.806-146.38 106.411-171.031 81.76-24.652-24.652 11.953-101.226 81.759-171.032 69.806-69.806 146.38-106.411 171.031-81.76 24.652 24.653-11.953 101.226-81.759 171.032z" />
                <path d="M312.99 312.625c-73.222 73.223-153.555 111.609-179.428 85.736-25.872-25.872 12.514-106.205 85.737-179.428s153.556-111.609 179.429-85.737c25.872 25.873-12.514 106.205-85.737 179.429z" />
                <path d="M300.175 299.808c-75.909 75.909-159.11 115.778-185.837 89.052-26.726-26.727 13.143-109.929 89.051-185.837 75.908-75.908 159.11-115.778 185.837-89.051 26.726 26.726-13.143 109.928-89.051 185.836z" />
                <path d="M284.707 284.34c-77.617 77.617-162.303 118.773-189.152 91.924-26.848-26.848 14.308-111.534 91.924-189.15C265.096 109.496 349.782 68.34 376.63 95.188c26.849 26.849-14.307 111.535-91.923 189.151z" />
                <path d="M269.239 267.989c-78.105 78.104-163.187 119.656-190.035 92.807-26.849-26.848 14.703-111.93 92.807-190.035 78.105-78.104 163.187-119.656 190.035-92.807 26.849 26.848-14.703 111.93-92.807 190.035z" />
                <path d="M252.887 252.52C175.27 330.138 90.584 371.294 63.736 344.446 36.887 317.596 78.043 232.91 155.66 155.293 233.276 77.677 317.962 36.521 344.81 63.37c26.85 26.848-14.307 111.534-91.923 189.15z" />
                <path d="M236.977 236.61C161.069 312.52 77.867 352.389 51.14 325.663c-26.726-26.727 13.143-109.928 89.052-185.837 75.908-75.908 159.11-115.777 185.836-89.05 26.727 26.726-13.143 109.928-89.051 185.836z" />
                <path d="M221.067 220.7C147.844 293.925 67.51 332.31 41.639 306.439c-25.873-25.873 12.513-106.206 85.736-179.429C200.6 53.786 280.931 15.4 306.804 41.272c25.872 25.873-12.514 106.206-85.737 179.429z" />
                <path d="M205.157 204.79c-69.806 69.807-146.38 106.412-171.031 81.76-24.652-24.652 11.953-101.225 81.759-171.031 69.806-69.807 146.38-106.411 171.031-81.76 24.652 24.652-11.953 101.226-81.759 171.032z" />
                <path d="M189.247 188.881c-65.169 65.169-136.696 99.3-159.762 76.235-23.065-23.065 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z" />
                <path d="M173.337 172.971c-59.799 59.8-125.292 91.26-146.282 70.269-20.991-20.99 10.47-86.484 70.268-146.283 59.8-59.799 125.292-91.26 146.283-70.269 20.99 20.991-10.47 86.484-70.269 146.283z" />
                <path d="M157.427 157.061c-53.209 53.21-111.578 81.108-130.372 62.314-18.794-18.794 9.104-77.164 62.313-130.373 53.21-53.209 111.58-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z" />
                <path d="M141.517 141.151c-44.91 44.91-94.376 68.259-110.485 52.15-16.11-16.11 7.239-65.576 52.15-110.486 44.91-44.91 94.375-68.258 110.485-52.15 16.109 16.11-7.24 65.576-52.15 110.486z" />
                <path d="M125.608 125.241c-35.88 35.88-75.255 54.677-87.947 41.985-12.692-12.692 6.105-52.067 41.985-87.947C115.525 43.4 154.9 24.603 167.592 37.295c12.692 12.692-6.105 52.067-41.984 87.946z" />
                <path d="M109.698 109.332c-24.408 24.407-51.12 37.268-59.663 28.726-8.542-8.543 4.319-35.255 28.727-59.662 24.407-24.408 51.12-37.27 59.662-28.727 8.543 8.543-4.319 35.255-28.726 59.663z" />
              </svg>
            </div>

            {/* Center title - SVG text with drawable animation */}
            <div className="center-title-container absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Subtle glow effect behind text */}
              <div className="absolute w-48 h-32 bg-white/5 rounded-full blur-3xl" />
              
              {/* SVG Text that draws in */}
              <svg 
                ref={textSvgRef}
                viewBox="0 0 200 80" 
                className="w-64 md:w-72 lg:w-80"
              >
                <defs>
                  <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e0e0e0" />
                  </linearGradient>
                </defs>
                {/* Mind */}
                <text
                  className="draw-text"
                  x="100"
                  y="35"
                  textAnchor="middle"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                  fontSize="40"
                  fontWeight="bold"
                  fontFamily="var(--font-wage), sans-serif"
                >
                  Mind
                </text>
                {/* Goblin */}
                <text
                  className="draw-text"
                  x="100"
                  y="68"
                  textAnchor="middle"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                  fontSize="40"
                  fontWeight="bold"
                  fontFamily="var(--font-wage), sans-serif"
                >
                  Goblin
                </text>
              </svg>
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="bottom-buttons absolute bottom-12 left-8 md:left-16 lg:left-24 flex gap-4 z-20">
            <button 
              onClick={handleShowGames}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all flex items-center gap-2 group"
            >
              <span className="text-sm font-medium">Our Games</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button 
              onClick={handleOpenContact}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all flex items-center gap-2 group"
            >
              <span className="text-sm font-medium">Contact Us</span>
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Social Media Links */}
          <div className="social-links absolute bottom-12 right-8 md:right-16 lg:right-24 flex gap-4 z-20">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/mindgoblin.gg/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Twitter/X */}
            <a 
              href="https://x.com/mindgoblin_gg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
              aria-label="Twitter/X"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@mindgoblin.gg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@mindgoblin_gg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </>
      ) : (
        <>
          {/* Games View - Three.js Spinning Cube */}
          <div className="cube-container relative w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]">
            <ThreeCube className="w-full h-full" />
            
            {/* "Games" text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="games-title-text text-5xl md:text-6xl font-bold text-white title-font opacity-0 drop-shadow-lg"
                style={{ textShadow: '0 0 20px rgba(255,75,75,0.5)' }}
              >
                Games
              </h2>
            </div>
          </div>

          {/* Coming Soon text */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
            <p className="games-title-text text-xl text-gray-400 opacity-0">
              Coming Soon...
            </p>
          </div>

          {/* Back button */}
          <button 
            onClick={handleBackToHome}
            className="back-button absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-red-500 hover:text-white hover:bg-red-500/10 transition-all flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </>
      )}

      {/* Futuristic Contact Modal */}
      {showContactModal && (
        <div className="contact-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0">
          <div className="contact-modal-content relative w-full max-w-lg mx-4 opacity-0">
            {/* Glowing border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#ff4b4b] via-[#ff4b4b]/50 to-[#ff4b4b] rounded-2xl blur-sm opacity-60" />
            
            {/* Modal content */}
            <div className="relative bg-[#0d0d0d] rounded-2xl p-8 border border-gray-800">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4b4b] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gray-600 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gray-600 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4b4b] rounded-br-2xl" />

              {/* Close button */}
              <button 
                onClick={handleCloseContact}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  <span className="text-[#ff4b4b]">&gt;</span> Contact Us
                </h3>
                <div className="modal-line h-[1px] bg-gradient-to-r from-[#ff4b4b] to-transparent origin-left" />
                <p className="text-gray-400 mt-3 text-sm font-mono">
                  // Initialize connection...
                </p>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff4b4b]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#ff4b4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#ff4b4b] font-mono text-lg">MESSAGE_SENT</p>
                  <p className="text-gray-400 mt-2">We&apos;ll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div className="modal-field">
                    <label className="block text-xs font-mono text-[#ff4b4b] mb-2 uppercase tracking-wider">
                      <span className="text-gray-500">01.</span> Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#ff4b4b] focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]/50 transition-all font-mono"
                        placeholder="Enter your name..."
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff4b4b] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="modal-field">
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                      <span className="text-gray-500">02.</span> Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500/50 transition-all font-mono"
                        placeholder="your@email.com"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="modal-field">
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                      <span className="text-gray-500">03.</span> Message
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#ff4b4b] focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]/50 transition-all font-mono resize-none"
                        placeholder="Your message..."
                      />
                      <div className="absolute right-3 top-3 w-2 h-2 bg-[#ff4b4b] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="modal-line h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="modal-field w-full py-4 bg-[#ff4b4b] hover:bg-[#ff6b6b] text-white font-mono uppercase tracking-wider rounded-lg transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* Animated scan line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}

              {/* Decorative grid overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{
                  backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                  backgroundSize: '50px 50px',
                }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
