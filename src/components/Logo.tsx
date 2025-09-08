import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', onClick, size = 'md', showText = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div 
      className={`cursor-pointer transition-transform duration-200 hover:scale-105 flex items-center gap-2 ${className}`}
      onClick={handleClick}
    >
      <img 
        src="/logo1.png" 
        alt="Inkaranya Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to Logo.jpg if logo1.png fails to load
          e.currentTarget.src = '/Logo.jpg';
        }}
      />
      {showText && (
        <span className={`font-bold text-green-600 ${textSizeClasses[size]}`}>
          INKARANYA
        </span>
      )}
    </div>
  );
};

export default Logo;
