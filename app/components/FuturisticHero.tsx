'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline, createDrawable } from 'animejs';

export default function FuturisticHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const textSvgRef = useRef<SVGSVGElement>(null);

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
      duration: 8000,
      ease: 'inOutSine',
      delay: stagger(350, { start: 0, reversed: true }),
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
      }, 800);

    // Cleanup
    return () => {
      cancelAnimationFrame(breathAnimationId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

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
      <div className="relative w-[440px] h-[440px] md:w-[565px] md:h-[565px] lg:w-[625px] lg:h-[625px]">
        
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
      <div className="absolute bottom-12 left-8 md:left-16 lg:left-24 flex gap-4 z-20">
        <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all flex items-center gap-2 group">
          <span className="text-sm font-medium">Our Games</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-pink-500 hover:text-white hover:bg-pink-500/10 transition-all flex items-center gap-2 group">
          <span className="text-sm font-medium">Learn more</span>
          <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 right-8 md:right-16 lg:right-24 flex flex-col items-center text-gray-500">
        <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-5 h-8 border border-gray-600 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
