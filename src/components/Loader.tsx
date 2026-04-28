import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

const Loader = ({ text = 'Loading...' }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loader;
