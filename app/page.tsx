'use client';

import Image from "next/image";
import ContactModal from "./components/ContactModal";
import FuturisticHero from "./components/FuturisticHero";
import game01Image from "./assets/game_01.jpg";
import { useState, useEffect, useRef } from "react";
import { animate, stagger, onScroll } from 'animejs';

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Games section - scroll triggered
    if (gamesRef.current) {
      animate('.games-title', {
        opacity: [0, 1],
        translateX: [-100, 0],
        duration: 1000,
        ease: 'outExpo',
        autoplay: onScroll({
          target: gamesRef.current,
          enter: 'bottom 80%',
        }),
      });

      animate('.game-card', {
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.9, 1],
        delay: stagger(150),
        duration: 800,
        ease: 'outExpo',
        autoplay: onScroll({
          target: gamesRef.current,
          enter: 'bottom 60%',
        }),
      });
    }

    // Contact section - scroll triggered
    if (contactRef.current) {
      animate('.contact-title', {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        ease: 'outExpo',
        autoplay: onScroll({
          target: contactRef.current,
          enter: 'bottom 80%',
        }),
      });

      animate('.contact-text', {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 200,
        ease: 'outExpo',
        autoplay: onScroll({
          target: contactRef.current,
          enter: 'bottom 70%',
        }),
      });

      animate('.contact-btn', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 400,
        ease: 'outExpo',
        autoplay: onScroll({
          target: contactRef.current,
          enter: 'bottom 60%',
        }),
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1a1a] overflow-x-hidden">
      {/* Futuristic Hero Section */}
      <FuturisticHero />

      {/* Games Section */}
      <section 
        ref={gamesRef}
        id="games-section" 
        className="min-h-screen py-32 px-4 relative bg-[#1a1a1a]"
      >
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-gray-900/30 to-[#1a1a1a]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="games-title text-5xl md:text-6xl font-bold text-white text-center mb-16 opacity-0">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Games</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Game Card 1 */}
            <div className="game-card group bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500 opacity-0">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={game01Image}
                  alt="Game in Development"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  In Development
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                  Project Alpha
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  An immersive adventure awaits. We're crafting something special...
                </p>
              </div>
            </div>

            {/* Game Card 2 - Coming Soon */}
            <div className="game-card group bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all duration-500 opacity-0">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-6xl opacity-30">🎮</div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-pink-600/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  Coming Soon
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-400 transition-colors">
                  Project Beta
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Something mysterious is brewing in the goblin workshop...
                </p>
              </div>
            </div>

            {/* Game Card 3 - Concept */}
            <div className="game-card group bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-500 opacity-0">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-6xl opacity-30">✨</div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-600/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  Concept
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">
                  Project Gamma
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Ideas are forming. The future holds endless possibilities...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactRef}
        className="min-h-screen py-32 px-4 flex items-center relative bg-[#1a1a1a]"
      >
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="contact-title text-5xl md:text-7xl font-bold mb-8 opacity-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Let's Create</span>
            <br />
            <span className="text-white">Together</span>
          </h2>
          <p className="contact-text text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0">
            Got an idea? Want to collaborate? We're always excited to hear from 
            fellow creators, players, and dreamers.
          </p>
          <button 
            className="contact-btn btn-primary text-lg px-10 py-4 opacity-0"
            onClick={() => setIsContactModalOpen(true)}
          >
            Get in Touch
          </button>
        </div>
      </section>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </main>
  );
}
