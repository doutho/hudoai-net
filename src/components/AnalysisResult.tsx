import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  link: string;
}

interface AnalysisResultProps {
  condition: string;
  recommendations: Product[];
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ condition, recommendations }) => {
  return (
    <Card className="w-full mt-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-2xl">Your Skin Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Skin Condition</h3>
          <p className="text-gray-700 leading-relaxed">{condition}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Recommended Products</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-purple-600">{product.name}</h4>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <span className="text-sm text-purple-500 mt-2 inline-block">
                  View on Amazon
                </span>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;