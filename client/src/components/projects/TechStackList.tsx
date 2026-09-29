import { Badge } from '../ui/Badge';

interface TechStackListProps {
  items: string[];
  max?: number;
  className?: string;
}

export function TechStackList({ items, max = 5, className }: TechStackListProps) {
  const visible = items.slice(0, max);
  const extra = items.length - max;

  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ''}`}>
      {visible.map((tech) => (
        <Badge key={tech} variant="slate" size="sm">{tech}</Badge>
      ))}
      {extra > 0 && <Badge variant="slate" size="sm">+{extra}</Badge>}
    </div>
  );
}
