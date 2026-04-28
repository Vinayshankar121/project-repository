import { useParams, Link } from 'react-router-dom';
import { aiSuggestions } from '@/data/mockData';
import { useProjects } from '@/context/ProjectContext';
import Navbar from '@/components/Navbar';
import TechnologyBadge from '@/components/TechnologyBadge';
import AISuggestionBox from '@/components/AISuggestionBox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Github, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';


const ProjectDetails = () => {

  const { id } = useParams<{ id: string }>();
  const [apiProject, setApiProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:2109/project/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiProject(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Map API data to component structure
  const project = apiProject ? {
    id: String(apiProject.id),
    title: apiProject.projectTitle || "Untitled",
    abstract: apiProject.abstract || apiProject.abstractText || "No description available.",
    technologies: Array.isArray(apiProject.technologies)
      ? apiProject.technologies
      : typeof apiProject.technologies === 'string'
        ? apiProject.technologies.split(',').map((t: string) => t.trim())
        : [],
    submittedBy: apiProject.uploadedBy || "Unknown",
    submittedAt: apiProject.date || new Date().toISOString(),
    githubLink: apiProject.githubLink || "",
  } : null;

  const suggestions = id ? aiSuggestions[id] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {project.submittedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.abstract}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.map((tech: string) => (
                      <TechnologyBadge key={tech} technology={tech} />
                    ))
                  ) : (
                    <span>No technologies listed</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {project.githubLink && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    {project.githubLink}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - AI Suggestions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AISuggestionBox suggestions={suggestions || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
