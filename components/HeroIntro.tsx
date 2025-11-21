
import React from 'react';

interface HeroIntroProps {
  isVisible: boolean;
}

const FloatingPropertyCard: React.FC<{ image: string; title: string; price: string; delay: number; position: string }> = ({ image, title, price, delay, position }) => (
  <div
    className={`absolute ${position} w-40 md:w-48 h-28 md:h-32 rounded-xl overflow-hidden shadow-2xl opacity-20 hover:opacity-30 transition-opacity duration-300 hidden md:block`}
    style={{
      animation: `float 8s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      backdropFilter: 'blur(4px)'
    }}
  >
    <img src={image} alt={title} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-2">
      <p className="text-white text-xs font-bold truncate">{title}</p>
      <p className="text-indigo-300 text-xs font-semibold">{price}</p>
    </div>
  </div>
);

export const HeroIntro: React.FC<HeroIntroProps> = ({ isVisible }) => {
  const sampleProperties = [
    { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', title: 'Modern Villa', price: '120,000 KSh/mo', delay: 0, position: 'top-20 left-10' },
    { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', title: 'Luxury Apartment', price: '85,000 KSh/mo', delay: 2, position: 'top-40 right-10' },
    { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', title: 'Penthouse Suite', price: '150,000 KSh/mo', delay: 4, position: 'bottom-32 left-20' },
    { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400', title: 'Garden Estate', price: '95,000 KSh/mo', delay: 6, position: 'bottom-40 right-20' },
  ];

  return (
    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Floating Property Cards */}
      {sampleProperties.map((prop, index) => (
        <FloatingPropertyCard key={index} {...prop} />
      ))}

      <div className="text-center px-4 relative z-10">
        <h1 className={`text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Empowering Real Estate with AI
        </h1>
        <p className={`mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-all duration-1000 delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          MyGF AI understands your needs to find the perfect property. Start by asking a question below.
        </p>

        {/* Animated decorative element */}
        <div className={`mt-8 flex justify-center gap-2 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
