import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Flame, AlertCircle } from 'lucide-react';

interface MoodTabProps {
  moodData: {
    date: Date;
    moodDetractors: Array<{
      label: string;
      severity: number;
      notes: string;
    }>;
  };
}

const MoodTab = ({ moodData }: MoodTabProps) => {
  if (!moodData) {
    return (
      <TabsContent value="mood" className="space-y-4">
        <h3 className="font-medium text-lg">Mood Detractors</h3>
        <p className="text-gray-500 italic">No mood data for this date</p>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="mood" className="space-y-4">
      <h3 className="font-medium text-lg">Mood Detractors</h3>
      <div className="space-y-4">
        {moodData.moodDetractors.length > 0 ? (
          <div className="space-y-4">
            {moodData.moodDetractors.map((detractor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {detractor.label.toLowerCase().includes('stress') ? (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    ) : detractor.label.toLowerCase().includes('anger') ? (
                      <Flame className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-medium">{detractor.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Severity: {detractor.severity}/10
                    </span>
                  </div>
                </div>
                {detractor.notes && (
                  <div className="pl-6 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {detractor.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No mood issues recorded</div>
        )}
      </div>
    </TabsContent>
  );
};

export default MoodTab;
