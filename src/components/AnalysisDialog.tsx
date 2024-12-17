import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';
import { translations } from '@/utils/translations';
import { type LanguageOption } from './LanguageSelector';

interface AnalysisDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  isAnalyzing: boolean;
  imagesCount: number;
  currentLanguage: LanguageOption;
}

const AnalysisDialog = ({
  showDialog,
  setShowDialog,
  isAnalyzing,
  imagesCount,
  currentLanguage
}: AnalysisDialogProps) => {
  const t = translations[currentLanguage.code];

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.analysisTitle}</DialogTitle>
          <DialogDescription>
            {isAnalyzing ? t.analysisProcessing : t.analysisComplete}
          </DialogDescription>
        </DialogHeader>
        {isAnalyzing ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="p-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-gray-600 mb-4">
              {imagesCount > 1 ? t.multipleImagesSuccess : t.singleImageSuccess}
            </p>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => setShowDialog(false)}
            >
              {t.viewResults}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;