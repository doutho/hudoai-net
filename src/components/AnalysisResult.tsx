import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Product {
  name: string;
  description: string;
  link: string;
  image: string;
  price: string;
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
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{condition}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Recommended Products</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((product, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-purple-600">{product.name}</h4>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                        {product.image && (
                          <div className="relative h-40 w-full">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-500">View on Amazon</span>
                          <span className="text-sm font-semibold text-gray-700">{product.price}</span>
                        </div>
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to view on Amazon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;