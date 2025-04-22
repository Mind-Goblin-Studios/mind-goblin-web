'use client';

import Image from "next/image";
import ScrollButton from "./components/ScrollButton";
import ContactModal from "./components/ContactModal";
import game01Image from "./assets/game_01.jpg";
import mglogo2Image from "./assets/mglogo2.png";
import { useState } from "react";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10" />
        <div className="absolute inset-0 z-0">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/LvEbYVq6EXk?autoplay=1&mute=1&controls=0&loop=1&playlist=LvEbYVq6EXk"
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-6xl md:text-8xl mb-6 font-bold bg-clip-text text-transparent hero-gradient title-font pt-4">
            Mind Goblin Studios
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Next level indie game development studio
          </p>
          <ScrollButton targetId="games-section">
            Explore Our Games
          </ScrollButton>
        </div>
      </section>

      {/* About Section */}
      {/* <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300">
               Welcome to the goblin lmao 
              </p>
              <p className="text-lg text-gray-300">
                We are a small indie game development studio that is passionate about creating unique and engaging games.
              </p>
            </div>
            <div className="image-container relative h-80 rounded-xl overflow-hidden">
              <Image
                src={mglogo2Image}
                alt="Mind Goblin Studios Logo"
                fill
                className="object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Games Section */}
      <section id="games-section" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Our Games</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            

            {/* Game Card */}
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src={game01Image}
                  alt="Game"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">In Development</h3>
                <p className="text-gray-400">
                  We're working on something special...
                </p>
              </div>
            </div>

         
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">Get in Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            Interested in our work? Want to collaborate? We'd love to hear from you!
          </p>
          <button 
            className="btn-primary"
            onClick={() => setIsContactModalOpen(true)}
          >
            Contact Us
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
