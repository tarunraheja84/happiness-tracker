import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

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
  if (!wellnessData) {
    return (
      <TabsContent value="wellness" className="space-y-4">
        <h3 className="font-medium text-lg">Wellness Tracking</h3>
        <p className="text-gray-500 italic">No wellness data for this date</p>
      </TabsContent>
    );
  }

  // Ensure all numeric values are numbers and have defaults
  const meditation = typeof wellnessData.meditation === 'number' ? wellnessData.meditation : 0;
  const sleep = typeof wellnessData.sleep === 'number' ? wellnessData.sleep : 0;
  const exercise = typeof wellnessData.exercise === 'number' ? wellnessData.exercise : 0;
  const steps = typeof wellnessData.steps === 'number' ? wellnessData.steps : 0;

  return (
    <TabsContent value="wellness" className="space-y-4">
      <h3 className="font-medium text-lg">Wellness Tracking</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Meditation</span>
            <span className="text-sm text-gray-500">{meditation} minutes</span>
          </div>
          <Progress value={meditation} max={30} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Sleep</span>
            <span className="text-sm text-gray-500">{sleep} hours</span>
          </div>
          <Progress value={sleep} max={10} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Exercise</span>
            <span className="text-sm text-gray-500">{exercise} minutes</span>
          </div>
          <Progress value={exercise} max={60} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Steps</span>
            <span className="text-sm text-gray-500">{steps.toLocaleString()}</span>
          </div>
          <Progress value={steps} max={10000} className="h-2" />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${wellnessData.water ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <span className="text-sm">Water</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${wellnessData.healthy ? 'bg-green-500' : 'bg-gray-200'}`} />
            <span className="text-sm">Healthy Eating</span>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default WellnessTab;
