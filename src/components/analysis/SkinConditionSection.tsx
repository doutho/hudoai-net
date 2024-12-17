import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts from the beginning
    const cleanedText = text.replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '').trim();
    
    return cleanedText.split('\n').map((line, index) => {
      if (!line.trim()) return null;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-purple-600">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return (
        <p key={index} className="mb-2">
          {formattedParts}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="text-gray-700 leading-relaxed">
        {formatText(condition)}
      </div>
    </div>
  );
};

export default SkinConditionSection;