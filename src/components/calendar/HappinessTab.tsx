
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface HappinessItem {
  date: Date;
  rating: number;
  notes: string;
}

interface HappinessTabProps {
  happinessData: HappinessItem | undefined;
}

const HappinessTab = ({ happinessData }: HappinessTabProps) => {
  return (
    <TabsContent value="happiness" className="p-4">
      {happinessData ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Happiness Reflection</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span>Rating:</span>
              <div className="flex space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      i < happinessData.rating 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="block font-medium mb-1">Notes:</span>
              <p className="text-gray-700 bg-white/50 p-3 rounded-md">{happinessData.notes}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No happiness data for this date</p>
        </div>
      )}
    </TabsContent>
  );
};

export default HappinessTab;
