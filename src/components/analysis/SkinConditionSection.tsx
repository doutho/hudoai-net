import React from 'react';

interface SkinConditionSectionProps {
  condition: string;
  title: string;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ condition, title }) => {
  const formatText = (text: string) => {
    // Remove any potential Gemini API artifacts from the beginning
    const cleanedText = text.replace(/^(As a dermatologist,|Based on the image,|Looking at the image,)/, '').trim();
    
    // Replace *text* with proper bold formatting
    const formattedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>');
    
    // Split into sections (Analysis, AM Routine, PM Routine)
    const sections = formattedText.split('\n\n');
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      const lines = section.split('\n');
      const sectionTitle = lines[0]?.toLowerCase() || '';
      
      // Format based on section type
      if (sectionTitle.includes('routine')) {
        const routineType = sectionTitle.includes('morning') || sectionTitle.includes('am') ? 'AM Routine:' : 'PM Routine:';
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">{routineType}</h4>
            <ul className="list-disc pl-4 space-y-1">
              {lines.slice(1).map((line, i) => (
                <li key={i} className="text-gray-700" 
                    dangerouslySetInnerHTML={{ __html: line.trim() }} />
              ))}
            </ul>
          </div>
        );
      }
      
      // Regular paragraph for analysis
      return (
        <p key={index} 
           className="text-gray-700 mb-4" 
           dangerouslySetInnerHTML={{ __html: lines.join(' ') }} />
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