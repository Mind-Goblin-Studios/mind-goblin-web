import Image from "next/image";

export default function Home() {
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
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent hero-gradient">
            Mind Goblin Studios
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Next level indie game development studio
          </p>
          <button className="btn-primary">
            Explore Our Games
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300">
               Welcome to the goblin lmao
              </p>
              <p className="text-lg text-gray-300">
                
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/studio-image.jpg"
                alt="Mind Goblin Studios Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Our Games</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Game Card 1 */}
            {/* <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/game-placeholder-1.jpg"
                  alt="Game 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                <p className="text-gray-400">
                  An exciting new adventure awaits...
                </p>
              </div>
            </div> */}

            {/* Game Card 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/game-placeholder-2.jpg"
                  alt="Game 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">In Development</h3>
                <p className="text-gray-400">
                  Something special is brewing...
                </p>
              </div>
            </div>

            {/* Game Card 3 */}
            {/* <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/game-placeholder-3.jpg"
                  alt="Game 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Coming 2024</h3>
                <p className="text-gray-400">
                  Stay tuned for our next big release...
                </p>
              </div>
            </div> */}
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
          <button className="btn-primary">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}
