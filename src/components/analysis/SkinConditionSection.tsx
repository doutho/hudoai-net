import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts from the beginning
    const cleanedText = text.replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '').trim();
    
    // Replace #text with h2 headers (main sections)
    const textWithHeaders = cleanedText.replace(/^#\s*(.*?)$/gm, '<h2 class="text-2xl font-bold text-gray-800 mt-6 mb-4">$1</h2>');
    
    // Replace single asterisk items with list items
    const formattedText = textWithHeaders.replace(/\*\s([^*]+)\*/g, '<li class="mb-2">$1</li>');
    
    // Replace **text** with bold text
    const textWithBold = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Split into sections
    const sections = textWithBold.split('\n\n');
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      // Check if the section starts with a list item
      if (section.includes('<li')) {
        return (
          <ul key={index} className="list-none space-y-2 ml-4 mb-4">
            <div dangerouslySetInnerHTML={{ __html: section }} />
          </ul>
        );
      }
      
      // Return regular sections
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