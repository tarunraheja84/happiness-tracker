import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface HappinessItem {
  date: Date;
  rating: number;
  notes: string;
}

interface HappinessTabProps {
  happinessData: HappinessItem | undefined;
}

const HappinessTab = ({ happinessData }: HappinessTabProps) => {
  if (!happinessData) {
    return (
      <TabsContent value="happiness" className="space-y-4">
        <h3 className="font-medium text-lg">Happiness Rating</h3>
        <p className="text-gray-500 italic">No happiness data for this date</p>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="happiness" className="space-y-4">
      <h3 className="font-medium text-lg">Happiness Rating</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Rating</span>
            <span className="text-sm text-gray-500">{happinessData.rating}/10</span>
          </div>
          <Progress value={happinessData.rating} max={10} className="h-2" />
        </div>

        {happinessData.notes && (
          <div>
            <h4 className="text-sm font-medium mb-2">Notes</h4>
            <p className="text-gray-700 text-sm">{happinessData.notes}</p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default HappinessTab;
