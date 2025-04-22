'use client';

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
}

export default function ScrollButton({ targetId, children }: ScrollButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button 
      className="btn-primary"
      onClick={handleClick}
    >
      {children}
    </button>
  );
} 