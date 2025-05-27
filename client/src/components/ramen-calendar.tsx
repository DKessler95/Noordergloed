import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarDay {
  date: Date;
  available: number;
  total: number;
  isSelectable: boolean;
}

interface RamenCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function RamenCalendar({ onDateSelect, selectedDate }: RamenCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Simuleer beschikbaarheid voor vrijdagen (in werkelijke app zou dit van server komen)
  const getAvailability = (date: Date): { available: number; total: number } => {
    // Alleen vrijdagen zijn beschikbaar
    if (date.getDay() !== 5) return { available: 0, total: 6 };
    
    // Simuleer verschillende bezettingsgraden
    const dayOfMonth = date.getDate();
    if (dayOfMonth % 4 === 0) return { available: 0, total: 6 }; // Rood - vol
    if (dayOfMonth % 3 === 0) return { available: 1, total: 6 }; // Oranje - bijna vol
    if (dayOfMonth % 2 === 0) return { available: 3, total: 6 }; // Blauw - half vol
    return { available: 6, total: 6 }; // Groen - ruim beschikbaar
  };

  const getStatusColor = (available: number, total: number) => {
    if (available === 0) return "bg-red-500"; // Rood - vol
    if (available <= 1) return "bg-orange-500"; // Oranje - bijna vol
    if (available <= 3) return "bg-blue-500"; // Blauw - half vol
    return "bg-green-500"; // Groen - ruim beschikbaar
  };

  const getStatusText = (available: number, total: number) => {
    if (available === 0) return "Vol";
    if (available <= 1) return "Bijna vol";
    if (available <= 3) return "Half vol";
    return "Beschikbaar";
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isFriday = currentDate.getDay() === 5;
      const isFuture = currentDate > new Date();
      const isSelectable = isCurrentMonth && isFriday && isFuture;
      
      const availability = getAvailability(currentDate);
      
      days.push({
        date: currentDate,
        available: availability.available,
        total: availability.total,
        isSelectable: isSelectable && availability.available > 0
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];
  const dayNames = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Kies een vrijdag
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Maand navigatie */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-semibold text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Kalender grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Dag headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {/* Kalender dagen */}
          {days.map((day, index) => {
            const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
            const isFriday = day.date.getDay() === 5;
            const statusColor = getStatusColor(day.available, day.total);
            
            return (
              <button
                key={index}
                onClick={() => day.isSelectable && onDateSelect(day.date)}
                disabled={!day.isSelectable}
                className={`
                  relative p-2 text-sm rounded-lg transition-all duration-200
                  ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                  ${day.isSelectable ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' : 'cursor-not-allowed'}
                  ${isSelectedDate(day.date) ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : ''}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
              >
                <span className="relative z-10">{day.date.getDate()}</span>
                
                {/* Status indicator voor vrijdagen */}
                {isFriday && isCurrentMonth && (
                  <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${statusColor}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Legenda:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Beschikbaar (4-6 plekken)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Half vol (2-3 plekken)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Bijna vol (1 plek)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Vol (0 plekken)</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium">Alleen vrijdagen beschikbaar</p>
              <p className="text-xs mt-1">Ramen wordt vers bereid voor max 6 personen per avond</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}