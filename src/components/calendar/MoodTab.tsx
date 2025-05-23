
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface MoodItem {
  date: Date;
  issues: string[];
  severity: number[];
  notes: string;
}

interface MoodTabProps {
  moodData: MoodItem | undefined;
}

const MoodTab = ({ moodData }: MoodTabProps) => {
  return (
    <TabsContent value="mood" className="p-4">
      {moodData && moodData.issues.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Mood Detractors</h3>
          <div className="space-y-4">
            {moodData.issues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{issue}</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-5 h-5 rounded-sm ${
                        i < moodData.severity[index] 
                          ? 'bg-red-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
            {moodData.notes && (
              <div>
                <span className="block font-medium mb-1">Notes:</span>
                <p className="text-gray-700 bg-white/50 p-3 rounded-md">{moodData.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {moodData ? 'No mood issues reported for this date' : 'No mood data for this date'}
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default MoodTab;
