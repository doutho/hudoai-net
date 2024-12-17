import React from 'react';
import { List, Sun, Moon, Droplet } from 'lucide-react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts from the beginning
    const cleanedText = text.replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '').trim();
    
    const sections = cleanedText.split('\n\n');
    return sections.map((section, sectionIndex) => {
      if (!section.trim()) return null;
      
      const lines = section.split('\n');
      return (
        <div key={sectionIndex} className="mb-6">
          {lines.map((line, lineIndex) => {
            if (!line.trim()) return null;
            
            // Determine which icon to use based on content
            let icon = <List className="inline-block mr-2 text-primary" size={20} />;
            if (line.toLowerCase().includes('morning') || line.toLowerCase().includes('day')) {
              icon = <Sun className="inline-block mr-2 text-primary" size={20} />;
            } else if (line.toLowerCase().includes('night') || line.toLowerCase().includes('evening')) {
              icon = <Moon className="inline-block mr-2 text-primary" size={20} />;
            } else if (line.toLowerCase().includes('hydrat') || line.toLowerCase().includes('moistur')) {
              icon = <Droplet className="inline-block mr-2 text-primary" size={20} />;
            }

            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-primary font-medium">{part.slice(2, -2)}</strong>;
              }
              return part;
            });
            
            return (
              <p key={lineIndex} className="mb-3 flex items-start font-roboto text-gray-700 leading-relaxed">
                <span className="mt-1 shrink-0">{icon}</span>
                <span>{formattedParts}</span>
              </p>
            );
          }).filter(Boolean)}
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 font-roboto text-primary">{title}</h3>
      <div className="space-y-2">
        {formatText(condition)}
      </div>
    </div>
  );
};

export default SkinConditionSection;