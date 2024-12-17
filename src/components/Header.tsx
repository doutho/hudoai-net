import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector, { type LanguageOption } from './LanguageSelector';

interface HeaderProps {
  currentLanguage: LanguageOption;
  onLanguageChange: (option: LanguageOption) => void;
}

const Header = ({ currentLanguage, onLanguageChange }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-12 animate-fade-in">
      <Link to="/">
        <img 
          src="/lovable-uploads/869792b2-0779-487f-a7fc-74c4425c1134.png" 
          alt="hudo" 
          className="h-8 md:h-10 hover-scale cursor-pointer"
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link 
          to="/how-it-works"
          className="text-white hover:text-primary transition-colors"
        >
          How It Works
        </Link>
        <div className="bg-white rounded-full p-1">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;