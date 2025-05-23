
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface WellnessItem {
  date: Date;
  meditation: number;
  sleep: number;
  exercise: number;
  steps: number;
  water: boolean;
  healthy: boolean;
}

interface WellnessTabProps {
  wellnessData: WellnessItem | undefined;
}

const WellnessTab = ({ wellnessData }: WellnessTabProps) => {
  return (
    <TabsContent value="wellness" className="p-4">
      {wellnessData ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Wellness Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Meditation</span>
              <Badge variant="outline">{wellnessData.meditation} minutes</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sleep</span>
              <Badge variant="outline">{wellnessData.sleep} hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Exercise</span>
              <Badge variant="outline">{wellnessData.exercise} minutes</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Steps</span>
              <Badge variant="outline">{wellnessData.steps.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Water Intake</span>
              <Badge variant={wellnessData.water ? "secondary" : "destructive"}>
                {wellnessData.water ? 'Completed' : 'Incomplete'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Healthy Eating</span>
              <Badge variant={wellnessData.healthy ? "secondary" : "destructive"}>
                {wellnessData.healthy ? 'Completed' : 'Incomplete'}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No wellness data for this date</p>
        </div>
      )}
    </TabsContent>
  );
};

export default WellnessTab;
