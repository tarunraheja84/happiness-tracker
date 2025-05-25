import { 
  Smile, 
  Heart, 
  Moon, 
  Dumbbell, 
  Droplets, 
  Apple, 
  BookOpen, 
  PenTool, 
  Stretch, 
  Users, 
  Monitor,
  AlertTriangle,
  Flame,
  AlertCircle
} from 'lucide-react';

interface CalendarData {
  date: Date;
  rating: number;
  notes?: string;
}

const CalendarView = ({ data }: { data: CalendarData }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Smile className="h-4 w-4 text-yellow-500" />
        <span>Happiness Rating: {data.rating}/10</span>
      </div>
      {data.notes && (
        <p className="text-sm text-gray-600">{data.notes}</p>
      )}
    </div>
  );
};

const HappinessDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Smile className="h-4 w-4 text-yellow-500" />
        <span>Happiness Rating: {data.rating}/10</span>
      </div>
      {data.notes && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Notes:</span> {data.notes}
        </div>
      )}
    </div>
  );
};

const WellnessDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-500" />
          <span>Meditation: {data.meditation} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-500" />
          <span>Sleep: {data.sleep} hrs</span>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-green-500" />
          <span>Exercise: {data.exercise} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-blue-500" />
          <span>Steps: {data.steps}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span>Water: {data.water ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Apple className="h-4 w-4 text-red-500" />
          <span>Ate healthy meals: {data.healthy ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-500" />
          <span>Reading: {data.reading ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-yellow-500" />
          <span>Journaling: {data.journaling ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Stretch className="h-4 w-4 text-orange-500" />
          <span>Stretching: {data.stretching ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-green-500" />
          <span>Social: {data.socialConnection ? '✓' : '✗'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-gray-500" />
          <span>Screen Time: {data.screenTime} hrs</span>
        </div>
      </div>
    </div>
  );
};

const MoodDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="space-y-2">
      {data.moodDetractors.length > 0 ? (
        <div className="space-y-2">
          {data.moodDetractors.map((detractor: any, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0">
                {detractor.label.toLowerCase().includes('stress') ? (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                ) : detractor.label.toLowerCase().includes('anger') ? (
                  <Flame className="h-4 w-4 text-red-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{detractor.label}</span>
                  <span className="text-sm text-gray-500">
                    (Severity: {detractor.severity}/10)
                  </span>
                </div>
                {detractor.notes && (
                  <div className="mt-1 text-sm text-gray-600 pl-6">
                    <span className="font-medium">Notes:</span> {detractor.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No mood issues recorded</div>
      )}
    </div>
  );
}; 