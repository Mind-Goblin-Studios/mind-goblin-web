'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger, createTimeline, createDrawable } from 'animejs';

export default function FuturisticHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const textSvgRef = useRef<SVGSVGElement>(null);
  const [isGamesMode, setIsGamesMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Ref to track color mode for breathing animation
  const colorModeRef = useRef<'red' | 'purple'>('red');

  useEffect(() => {
    if (!containerRef.current || !sphereRef.current) return;

    const spherePathEls = sphereRef.current.querySelectorAll('.sphere path');
    const pathLength = spherePathEls.length;

    // Color definitions
    const colors = {
      red: { bright: [255, 75, 75], dim: [80, 80, 80] },
      purple: { bright: [168, 85, 247], dim: [80, 80, 80] }
    };

    // Breath animation - creates the pulsing wave effect with direct color manipulation
    let breathAnimationId: number;
    let startTime: number | null = null;
    
    function breathe(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const currentTime = timestamp - startTime;
      
      const currentColors = colors[colorModeRef.current];
      
      spherePathEls.forEach((path, i) => {
        const pathEl = path as SVGPathElement;
        // Calculate wave position for this path
        const percent = (1 - Math.sin(i * 0.35 + 0.0008 * currentTime)) / 2;
        
        // Interpolate between bright and dim colors
        const r = Math.round(currentColors.bright[0] + (currentColors.dim[0] - currentColors.bright[0]) * percent);
        const g = Math.round(currentColors.bright[1] + (currentColors.dim[1] - currentColors.bright[1]) * percent);
        const b = Math.round(currentColors.bright[2] + (currentColors.dim[2] - currentColors.bright[2]) * percent);
        const alpha = 1 - (percent * 0.65); // Fade from 1 to 0.35
        
        pathEl.style.stroke = `rgba(${r},${g},${b},${alpha})`;
        
        // Apply transform based on wave
        const translateVal = 2 + (percent * -6); // Goes from 2 to -4
        pathEl.style.transform = `translate(${translateVal}px, ${translateVal}px)`;
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
      // First, make the SVG visible
      animate('.mind-goblin-text', {
        opacity: [0, 1],
        visibility: 'visible',
        duration: 300,
        ease: 'outQuad',
        delay: 1800,
      });
      
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

    // Satellite orbit animations
    const satellite1 = document.querySelector('.satellite-1') as HTMLElement;
    const satellite2 = document.querySelector('.satellite-2') as HTMLElement;
    
    if (satellite1 && satellite2) {
      // Calculate orbital positions manually for tilted ellipses
      // Orbit 1: rx=260, ry=100, rotation=-25 degrees
      // Orbit 2: rx=280, ry=90, rotation=30 degrees
      
      const centerX = 220;
      const centerY = 220;
      const containerSize = sphereRef.current?.clientWidth || 550;
      const scale = containerSize / 440;
      
      let startTime1: number | null = null;
      let startTime2: number | null = null;
      
      // Orbit animation for satellite 1
      const animateSatellite1 = (timestamp: number) => {
        if (!startTime1) startTime1 = timestamp;
        const elapsed = timestamp - startTime1;
        const duration = 18000; // 18 seconds per orbit
        const progress = (elapsed % duration) / duration;
        
        // Ellipse parameters for orbit 1
        const rx = 260 * scale;
        const ry = 100 * scale;
        const rotationDeg = -25;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        
        // Calculate position on unrotated ellipse
        const angle = progress * 2 * Math.PI;
        const x = rx * Math.cos(angle);
        const y = ry * Math.sin(angle);
        
        // Apply rotation
        const rotatedX = x * Math.cos(rotationRad) - y * Math.sin(rotationRad);
        const rotatedY = x * Math.sin(rotationRad) + y * Math.cos(rotationRad);
        
        // Final position relative to container center
        const finalX = (containerSize / 2) + rotatedX;
        const finalY = (containerSize / 2) + rotatedY;
        
        satellite1.style.left = `${finalX}px`;
        satellite1.style.top = `${finalY}px`;
        
        // Simulate depth - when y component indicates "behind" sphere
        // Behind when angle is between π/4 and 3π/4 (roughly top-back portion)
        if (angle > Math.PI * 0.2 && angle < Math.PI * 0.8) {
          satellite1.style.opacity = '0.25';
          satellite1.style.zIndex = '5';
          satellite1.style.filter = 'blur(1px)';
        } else {
          satellite1.style.opacity = '1';
          satellite1.style.zIndex = '35';
          satellite1.style.filter = 'none';
        }
        
        requestAnimationFrame(animateSatellite1);
      };
      
      // Orbit animation for satellite 2 (opposite direction)
      const animateSatellite2 = (timestamp: number) => {
        if (!startTime2) startTime2 = timestamp;
        const elapsed = timestamp - startTime2;
        const duration = 24000; // 24 seconds per orbit
        const progress = (elapsed % duration) / duration;
        
        // Ellipse parameters for orbit 2
        const rx = 280 * scale;
        const ry = 90 * scale;
        const rotationDeg = 30;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        
        // Calculate position on unrotated ellipse (counter-clockwise)
        const angle = (1 - progress) * 2 * Math.PI;
        const x = rx * Math.cos(angle);
        const y = ry * Math.sin(angle);
        
        // Apply rotation
        const rotatedX = x * Math.cos(rotationRad) - y * Math.sin(rotationRad);
        const rotatedY = x * Math.sin(rotationRad) + y * Math.cos(rotationRad);
        
        // Final position relative to container center
        const finalX = (containerSize / 2) + rotatedX;
        const finalY = (containerSize / 2) + rotatedY;
        
        satellite2.style.left = `${finalX}px`;
        satellite2.style.top = `${finalY}px`;
        
        // Simulate depth - opposite phase from satellite 1
        if (angle > Math.PI * 1.2 && angle < Math.PI * 1.8) {
          satellite2.style.opacity = '0.25';
          satellite2.style.zIndex = '5';
          satellite2.style.filter = 'blur(1px)';
        } else {
          satellite2.style.opacity = '1';
          satellite2.style.zIndex = '35';
          satellite2.style.filter = 'none';
        }
        
        requestAnimationFrame(animateSatellite2);
      };
      
      // Start satellite animations with delay
      setTimeout(() => {
        satellite1.style.opacity = '1';
        requestAnimationFrame(animateSatellite1);
      }, 3500);
      
      setTimeout(() => {
        satellite2.style.opacity = '1';
        requestAnimationFrame(animateSatellite2);
      }, 4200);
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
      .add('.steam-button', {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        ease: 'outExpo',
      }, 600)
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

  // Games mode - change sphere color and show games text
  useEffect(() => {
    if (isGamesMode) {
      // Switch to purple color mode for breathing animation
      colorModeRef.current = 'purple';
      
      // Animate the "Games" text in
      animate('.games-text', {
        opacity: [0, 1],
        visibility: 'visible',
        scale: [0.8, 1],
        duration: 800,
        ease: 'outExpo',
        delay: 300,
      });
      // Hide Mind Goblin text
      animate('.mind-goblin-text', {
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 500,
        ease: 'inOutQuad',
      });
      // Animate games mode side text in
      animate('.games-left-text', {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        ease: 'outExpo',
        delay: 400,
      });
      animate('.games-right-text', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        ease: 'outExpo',
        delay: 500,
      });
    } else {
      // Switch back to red color mode for breathing animation
      colorModeRef.current = 'red';
      
      // Show Mind Goblin text
      animate('.mind-goblin-text', {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        ease: 'outExpo',
        delay: 300,
      });
      // Hide Games text
      animate('.games-text', {
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 500,
        ease: 'inOutQuad',
        onComplete: () => {
          const el = document.querySelector('.games-text') as HTMLElement;
          if (el) el.style.visibility = 'hidden';
        },
      });
      // Games mode side text fade out is handled in handleBackToHome
    }
  }, [isGamesMode]);

  const handleShowGames = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Fade out side content but keep sphere and social links
    animate('.hero-text-line, .hero-subtitle, .right-text, .bottom-buttons', {
      opacity: [1, 0],
      translateY: [0, 20],
      duration: 600,
      ease: 'inOutQuad',
      onComplete: () => {
        setIsGamesMode(true);
        setIsTransitioning(false);
      },
    });
  };

  const handleBackToHome = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Fade out games mode UI (matching the landing page fade out style)
    animate('.games-left-text, .games-right-text, .back-button', {
      opacity: [1, 0],
      translateY: [0, 20],
      duration: 600,
      ease: 'inOutQuad',
      onComplete: () => {
        setIsGamesMode(false);
        setIsTransitioning(false);
        // Re-trigger side content animations
        setTimeout(() => {
          animate('.hero-text-line, .hero-subtitle, .right-text, .bottom-buttons', {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            ease: 'outExpo',
          });
        }, 300);
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
    
    try {
      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }).toString(),
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Close modal after success
        setTimeout(() => {
          handleCloseContact();
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Steam button - top left */}
      <a 
        href="https://store.steampowered.com/developer/mindgoblin/"
        target="_blank"
        rel="noopener noreferrer"
        className="steam-button absolute top-4 md:top-8 left-4 md:left-16 lg:left-24 px-2 py-1.5 md:px-4 md:py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-[#1b2838] hover:text-white hover:bg-[#1b2838] transition-all flex items-center gap-1.5 md:gap-2 group z-20 opacity-0"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .125.004.188.006l2.861-4.142V8.91a4.528 4.528 0 0 1 4.524-4.524c2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303a3.019 3.019 0 0 0-3.015-3.015 3.019 3.019 0 0 0-3.015 3.015 3.019 3.019 0 0 0 3.015 3.015 3.019 3.019 0 0 0 3.015-3.015zm-5.273-.005c0-1.248 1.013-2.262 2.261-2.262a2.263 2.263 0 0 1 0 4.525c-1.248 0-2.261-1.014-2.261-2.263z"/>
        </svg>
        <span className="text-xs md:text-sm font-medium hidden sm:inline">Follow us on Steam</span>
        <span className="text-xs font-medium sm:hidden">Steam</span>
      </a>

      {/* Left side text - hidden in games mode */}
      {!isGamesMode && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-16 lg:left-24 md:translate-x-0 top-16 md:top-1/2 md:-translate-y-1/2 z-20 max-w-md text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 md:mb-6">
            <span className="hero-text-line block opacity-0">Game</span>
            <span className="hero-text-line block opacity-0">development</span>
            <span className="hero-text-line block opacity-0">studio.</span>
          </h1>
          <p className="hero-subtitle text-gray-400 text-sm md:text-lg lg:text-xl opacity-0 hidden md:block">
            A passionate indie studio creating<br />
            immersive gaming experiences.
          </p>
        </div>
      )}

      {/* Right side text - hidden in games mode, below sphere on mobile */}
      {!isGamesMode && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-16 lg:right-24 bottom-28 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 max-w-sm text-center md:text-right">
          <p className="right-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed opacity-0">
            Creatives crafting new<br />
            and exciting titles
          </p>
          <p className="right-text text-sm md:text-lg lg:text-xl text-gray-500 mt-2 md:mt-4 opacity-0 font-light hidden md:block">
            新しくエキサイティングな<br />
            タイトルを創り出す
          </p>
        </div>
      )}

      {/* Center sphere - always visible */}
      <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[550px] md:h-[550px] lg:w-[650px] lg:h-[650px] z-10">
        
        {/* The Sphere Animation */}
        <div ref={sphereRef} className="absolute inset-0 flex items-center justify-center z-10">
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

        {/* Orbital paths and satellites */}
        <div className="orbit-container absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <svg className="w-full h-full" viewBox="0 0 440 440" style={{ overflow: 'visible' }}>
            {/* Visible orbital path 1 - tilted ellipse (red satellite track) */}
            <ellipse 
              className="orbit-path-1"
              cx="220" 
              cy="220" 
              rx="260" 
              ry="100"
              stroke="rgba(255,75,75,1)" 
              strokeWidth="1"
              strokeDasharray="6 6"
              fill="none"
              transform="rotate(-25 220 220)"
            />
            {/* Visible orbital path 2 - opposite tilt (purple satellite track) */}
            <ellipse 
              className="orbit-path-2"
              cx="220" 
              cy="220" 
              rx="280" 
              ry="90"
              stroke="rgba(168,85,247,1)" 
              strokeWidth="1"
              strokeDasharray="6 6"
              fill="none"
              transform="rotate(30 220 220)"
            />
          </svg>
          
          {/* Satellite 1 - red */}
          <div 
            className="satellite-1 absolute rounded-full"
            style={{ 
              width: '15px',
              height: '15px',
              left: '50%', 
              top: '50%', 
              opacity: 0,
              background: 'radial-gradient(circle, #ff6b6b 0%, #ff4b4b 50%, #cc3333 100%)',
              boxShadow: '0 0 14px rgba(255,75,75,0.9), 0 0 28px rgba(255,75,75,0.5), 0 0 42px rgba(255,75,75,0.3)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Satellite 2 - purple */}
          <div 
            className="satellite-2 absolute rounded-full"
            style={{ 
              width: '10px',
              height: '10px',
              left: '50%', 
              top: '50%', 
              opacity: 0,
              background: 'radial-gradient(circle, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
              boxShadow: '0 0 12px rgba(168,85,247,0.9), 0 0 24px rgba(168,85,247,0.5), 0 0 36px rgba(168,85,247,0.3)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Center title container - both texts, toggle visibility */}
        <div className="center-title-container absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          {/* Subtle glow effect behind text */}
          <div className="absolute w-48 h-32 bg-white/5 rounded-full blur-3xl" />
          
          {/* Mind Goblin Text - shown when not in games mode */}
          <svg 
            ref={textSvgRef}
            viewBox="0 0 200 80" 
            className="mind-goblin-text w-40 sm:w-52 md:w-72 lg:w-80 absolute"
            style={{ 
              opacity: 0, 
              visibility: 'hidden',
              filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.08))'
            }}
          >
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
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

          {/* Games Text - shown when in games mode */}
          <h2 
            className="games-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white title-font absolute"
            style={{ fontFamily: 'var(--font-wage), sans-serif', opacity: 0, visibility: 'hidden' }}
          >
            Games
          </h2>
        </div>
      </div>

      {/* Bottom buttons - hidden in games mode */}
      {!isGamesMode && (
        <div className="bottom-buttons absolute bottom-4 md:bottom-12 left-4 md:left-16 lg:left-24 flex gap-2 md:gap-4 z-20">
          <button 
            onClick={handleShowGames}
            className="px-3 py-2 md:px-6 md:py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all flex items-center gap-1 md:gap-2 group"
          >
            <span className="text-xs md:text-sm font-medium">Our Games</span>
            <svg className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button 
            onClick={handleOpenContact}
            className="px-3 py-2 md:px-6 md:py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all flex items-center gap-1 md:gap-2 group"
          >
            <span className="text-xs md:text-sm font-medium">Contact Us</span>
            <svg className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )}

      {/* Social Media Links - visible in both modes */}
      <div className="social-links absolute bottom-4 md:bottom-12 right-2 md:right-16 lg:right-24 flex gap-1 md:gap-4 z-20">
          <a 
            href="https://www.instagram.com/mindgoblin.gg/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
            aria-label="Instagram"
          >
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://x.com/mindgoblin_gg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
            aria-label="Twitter/X"
          >
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://www.tiktok.com/@mindgoblin.gg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
            aria-label="TikTok"
          >
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://www.youtube.com/@mindgoblin_gg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center border border-gray-600 text-gray-400 rounded hover:border-[#ff4b4b] hover:text-white hover:bg-[#ff4b4b]/10 transition-all group opacity-0"
            aria-label="YouTube"
          >
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

      {/* Games mode - Left side text (top on mobile) */}
      {isGamesMode && (
        <>
          {/* Mobile version - centered at top */}
          <div className="games-left-text absolute inset-x-0 top-16 z-20 flex justify-center md:hidden opacity-0 px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight text-center">
              The Mind Goblin team<br />
              is hard at work.
            </h1>
          </div>
          {/* Desktop version - left aligned */}
          <div className="games-left-text absolute left-16 lg:left-24 top-[42%] -translate-y-1/2 z-20 max-w-md text-left opacity-0 hidden md:block">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              The Mind Goblin team<br />
              is hard at work.
            </h1>
            <p className="text-gray-400 text-base lg:text-lg">
              Our team is in the process of building<br />
              some unique multiplayer games as well<br />
              as roguelike games.
            </p>
          </div>
        </>
      )}

      {/* Games mode - Right side text (bottom on mobile) */}
      {isGamesMode && (
        <>
          {/* Mobile version - centered at bottom */}
          <div className="games-right-text absolute inset-x-0 bottom-24 z-20 flex justify-center md:hidden opacity-0 px-4">
            <p className="text-base sm:text-lg font-light text-white leading-relaxed text-center max-w-xs">
              ETA on our first game is likely to be released in 2026
            </p>
          </div>
          {/* Desktop version - right aligned */}
          <div className="games-right-text absolute right-16 lg:right-24 top-[42%] -translate-y-1/2 z-20 max-w-sm text-right opacity-0 hidden md:block">
            <p className="text-2xl lg:text-3xl font-light text-white leading-relaxed">
              ETA on our first game<br />is likely to be released<br />in 2026
            </p>
            <p className="text-lg lg:text-xl text-gray-500 mt-4 font-light">
              最初のゲームのリリースは<br />
              2026年を予定しています
            </p>
          </div>
        </>
      )}

      {/* Back button - shown in games mode */}
      {isGamesMode && (
        <button 
          onClick={handleBackToHome}
          className="back-button absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 md:px-6 md:py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all flex items-center gap-1.5 md:gap-2 group z-20"
        >
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-xs md:text-sm font-medium">Back</span>
        </button>
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
                  Get in touch with the Mind Goblin Team
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
              ) : submitStatus === 'error' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-mono text-lg">TRANSMISSION_FAILED</p>
                  <p className="text-gray-400 mt-2">Please try again later.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-4 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-[#ff4b4b] hover:text-white transition-all font-mono text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                >
                  {/* Hidden fields for Netlify */}
                  <input type="hidden" name="form-name" value="contact" />
                  <input type="hidden" name="bot-field" />
                  
                  {/* Name field */}
                  <div className="modal-field">
                    <label className="block text-xs font-mono text-[#ff4b4b] mb-2 uppercase tracking-wider">
                      <span className="text-gray-500">01.</span> Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
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
                        name="email"
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
                        name="message"
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
