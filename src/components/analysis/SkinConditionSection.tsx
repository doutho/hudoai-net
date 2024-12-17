import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    const cleanedText = text.replace(/^Ja.*ser\.\n\n/, '');
    
    return cleanedText.split('\n').map((line, index) => {
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
    });
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