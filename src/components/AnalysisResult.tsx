import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Skin Condition</h3>
            <p className="text-gray-600">{condition}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Recommended Products</h3>
            <div className="space-y-2">
              {recommendations.map((product, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
                  >
                    View on Amazon →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;