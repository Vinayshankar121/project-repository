import { Link } from 'react-router-dom';
import { Project } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TechnologyBadge from './TechnologyBadge';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const truncatedAbstract = project.abstract.length > 150
    ? project.abstract.substring(0, 150) + '...'
    : project.abstract;

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">{truncatedAbstract}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechnologyBadge key={tech} technology={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs text-muted-foreground self-center">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link to={`/projects/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full group">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
