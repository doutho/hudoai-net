import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { translations } from '@/utils/translations';
import { type LanguageOption } from './LanguageSelector';

interface AnalysisCounterProps {
  currentLanguage: LanguageOption;
}

const AnalysisCounter = ({ currentLanguage }: AnalysisCounterProps) => {
  const t = translations[currentLanguage.code];

  const { data: counter } = useQuery({
    queryKey: ['analysisCounter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_counter')
        .select('total_count')
        .limit(1)
        .single();

      if (error) throw error;
      return data.total_count;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (!counter) return null;

  return (
    <div className="text-center mt-4 mb-8 animate-fade-in">
      <p className="text-primary-foreground/80 text-sm">
        {t.totalAnalyses?.replace('{count}', counter.toString()) || 
         `${counter} skin analyses completed`}
      </p>
    </div>
  );
};

export default AnalysisCounter;