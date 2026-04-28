import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';

interface AISuggestionBoxProps {
  suggestions: string[];
}

const AISuggestionBox = ({ suggestions }: AISuggestionBoxProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Here are some ideas to improve or extend this project
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{suggestion}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AISuggestionBox;
