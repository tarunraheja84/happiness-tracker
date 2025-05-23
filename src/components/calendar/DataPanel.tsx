
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import GratitudeTab from './GratitudeTab';
import WellnessTab from './WellnessTab';
import HappinessTab from './HappinessTab';
import MoodTab from './MoodTab';

interface GratitudeItem {
  date: Date;
  items: string[];
}

interface WellnessItem {
  date: Date;
  meditation: number;
  sleep: number;
  exercise: number;
  steps: number;
  water: boolean;
  healthy: boolean;
}

interface HappinessItem {
  date: Date;
  rating: number;
  notes: string;
}

interface MoodItem {
  date: Date;
  issues: string[];
  severity: number[];
  notes: string;
}

interface DataPanelProps {
  date: Date;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  gratitudeData: GratitudeItem | undefined;
  wellnessData: WellnessItem | undefined;
  happinessData: HappinessItem | undefined;
  moodData: MoodItem | undefined;
}

const DataPanel = ({ 
  date, 
  selectedTab, 
  setSelectedTab,
  gratitudeData,
  wellnessData,
  happinessData,
  moodData
}: DataPanelProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm lg:col-span-2">
      <CardHeader>
        <CardTitle>
          Data for {format(date, 'MMMM d, yyyy')}
        </CardTitle>
        <Tabs
          defaultValue="gratitude"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="happiness">Happiness</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
          </TabsList>

          <GratitudeTab gratitudeData={gratitudeData} />
          <WellnessTab wellnessData={wellnessData} />
          <HappinessTab happinessData={happinessData} />
          <MoodTab moodData={moodData} />
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default DataPanel;
