import React from 'react';
import LanguageSelector, { type LanguageOption } from './LanguageSelector';

interface HeaderProps {
  currentLanguage: LanguageOption;
  onLanguageChange: (option: LanguageOption) => void;
}

const Header = ({ currentLanguage, onLanguageChange }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-12 animate-fade-in">
      <img 
        src="/lovable-uploads/869792b2-0779-487f-a7fc-74c4425c1134.png" 
        alt="hudo" 
        className="h-8 md:h-10 hover-scale" // Reduced from h-12 md:h-16
      />
      <div className="bg-white rounded-full p-1"> {/* Added white background */}
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </div>
  );
};

export default Header;