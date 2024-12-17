import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts from the beginning
    const cleanedText = text.replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '').trim();
    
    // Replace #text with h3 headers
    const textWithHeaders = cleanedText.replace(/^#\s*(.*?)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h3>');
    
    // Replace *text* with italics, but not **text**
    const formattedText = textWithHeaders.replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '<em class="text-gray-700 italic">$1</em>');
    
    // Split into sections
    const sections = formattedText.split('\n\n');
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      // Return a div containing the formatted HTML
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