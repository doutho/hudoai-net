import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts and special characters
    const cleanedText = text
      .replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '')
      .replace(/[^\w\s*#.,()-]/g, '') // Keep only alphanumeric, spaces, and basic punctuation
      .trim();
    
    // Replace #text with h2 headers (main sections)
    const textWithHeaders = cleanedText.replace(/^#\s*(.*?)$/gm, '<h2 class="text-2xl font-bold text-gray-800 mt-6 mb-4">$1</h2>');
    
    // Replace **text** with bold text for subtitles
    const textWithBold = textWithHeaders.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-xl text-gray-800">$1</strong>');
    
    // Split into sections
    const sections = textWithBold.split('\n\n');
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      return (
        <div 
          key={index} 
          className="text-gray-700 mb-4" 
          dangerouslySetInnerHTML={{ __html: section }}
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 font-roboto text-gray-800">{title}</h3>
      <div className="space-y-2">
        {formatText(condition)}
      </div>
    </div>
  );
};

export default SkinConditionSection;