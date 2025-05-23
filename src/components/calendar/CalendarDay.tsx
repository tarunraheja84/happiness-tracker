
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  setDate: (date: Date) => void;
  highlightedDates: Date[];
}

const CalendarDay = ({ date, setDate, highlightedDates }: CalendarDayProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm lg:col-span-1">
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              highlighted: highlightedDates
            }}
            modifiersStyles={{
              highlighted: { backgroundColor: "rgba(99, 102, 241, 0.1)" }
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-1">
              {format(date, 'EEEE')}
            </Badge>
            {format(date, 'MMMM d, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDay;
