
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface GratitudeItem {
  date: Date;
  items: string[];
}

interface GratitudeTabProps {
  gratitudeData: GratitudeItem | undefined;
}

const GratitudeTab = ({ gratitudeData }: GratitudeTabProps) => {
  return (
    <TabsContent value="gratitude" className="p-4">
      {gratitudeData ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Gratitude Journal</h3>
          <ul className="list-disc list-inside space-y-2">
            {gratitudeData.items.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No gratitude entries for this date</p>
        </div>
      )}
    </TabsContent>
  );
};

export default GratitudeTab;
