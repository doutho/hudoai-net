import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { type LanguageOption } from '@/components/LanguageSelector';

interface HowItWorksProps {
  currentLanguage: LanguageOption;
  onLanguageChange: (option: LanguageOption) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ currentLanguage, onLanguageChange }) => {
  const steps = [
    {
      title: "Upload Your Images",
      description: "Take clear photos of your skin concerns and upload them to our platform."
    },
    {
      title: "AI Analysis",
      description: "Our advanced AI technology analyzes your skin condition and identifies potential concerns."
    },
    {
      title: "Get Personalized Recommendations",
      description: "Receive tailored product recommendations and skincare advice based on your analysis."
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
        
        <div className="space-y-8 mt-12">
          <h1 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h1>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-lg relative animate-fade-in"
              >
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/" 
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try It Now
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;