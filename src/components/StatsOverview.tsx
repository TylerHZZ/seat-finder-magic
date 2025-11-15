import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Building2, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  totalSeats: number;
  availableSeats: number;
  occupiedSeats: number;
  buildingCount: number;
}

export const StatsOverview = ({
  totalSeats,
  availableSeats,
  occupiedSeats,
  buildingCount,
}: StatsOverviewProps) => {
  const availabilityRate = totalSeats > 0 
    ? Math.round((availableSeats / totalSeats) * 100) 
    : 0;

  const stats = [
    {
      label: 'Available Seats',
      value: availableSeats,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      label: 'Occupied Seats',
      value: occupiedSeats,
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    {
      label: 'Total Buildings',
      value: buildingCount,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Availability Rate',
      value: `${availabilityRate}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`p-4 border-2 ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color} opacity-60`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
