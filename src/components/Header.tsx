import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionMarkCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/how-it-works">
                <QuestionMarkCircle className="w-5 h-5 text-white hover:text-primary transition-colors" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>How does it work?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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