import { Badge } from '@/components/ui/badge';

interface TechnologyBadgeProps {
  technology: string;
  onClick?: () => void;
  selected?: boolean;
}

const TechnologyBadge = ({ technology, onClick, selected }: TechnologyBadgeProps) => {
  return (
    <Badge
      variant={selected ? 'default' : 'secondary'}
      className={onClick ? 'cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors' : ''}
      onClick={onClick}
    >
      {technology}
    </Badge>
  );
};

export default TechnologyBadge;
