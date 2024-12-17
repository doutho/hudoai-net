import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Decode HTML entities and normalize special characters
    const decodedText = text
      .replace(/&auml;/g, 'ä')
      .replace(/&aring;/g, 'å')
      .replace(/&ouml;/g, 'ö')
      .replace(/&Auml;/g, 'Ä')
      .replace(/&Aring;/g, 'Å')
      .replace(/&Ouml;/g, 'Ö')
      // Remove any potential Gemini API artifacts and special characters, but keep Swedish chars
      .replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '')
      .replace(/[^\wåäöÅÄÖ\s.,()-]/g, '')
      .trim();
    
    // Fix the number formatting by ensuring numbers are next to their headers
    const fixedNumbers = decodedText
      .replace(/(\d+)\.\s*([A-ZÅÄÖa-zåäö])/g, '$1.\n$2')
      .replace(/(Morgon|Kväll)/g, '\n**$1**\n');
    
    // Replace # text with h2 headers (main sections)
    const textWithHeaders = fixedNumbers.replace(
      /^#\s*(.*?)$/gm, 
      '<h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">$1</h2>'
    );
    
    // Replace **text** with bold text for subtitles
    const textWithBold = textWithHeaders.replace(
      /\*\*([^*]+)\*\*/g, 
      '<h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">$1</h3>'
    );
    
    // Split into paragraphs and format them with more spacing
    const sections = textWithBold.split('\n\n');
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      // Add extra spacing for numbered items
      const formattedSection = section.replace(
        /(\d+)\.\s*/g,
        '<div class="mt-4">$1. </div>'
      );
      
      return (
        <div 
          key={index} 
          className="text-gray-700 mb-6 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: formattedSection }}
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h3 className="text-2xl font-semibold mb-6 font-roboto text-gray-800">{title}</h3>
      <div className="space-y-4">
        {formatText(condition)}
      </div>
    </div>
  );
};

export default SkinConditionSection;