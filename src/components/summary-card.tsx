import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryIcon from "./category-icon";

interface SummaryCardProps {
  title: string;
  value: number;
  iconName: string;
  isCurrency?: boolean;
}

export default function SummaryCard({ title, value, iconName, isCurrency = true }: SummaryCardProps) {
  const formattedValue = isCurrency ? new Intl.NumberFormat('id-ID').format(value) : value;
  const textColor = () => {
    if (!isCurrency) return '';
    if (title.toLowerCase().includes('balance')) {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    return '';
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CategoryIcon name={iconName} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor()}`}>
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  );
}
