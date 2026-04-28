import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, XCircle, Plus, FileText, FolderOpen } from 'lucide-react';
import AIAnalysisButton from '@/components/AIAnalysisButton';

const MySubmissions = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to view your project ideas.
          </p>
          <Link to="/login">
            <Button>Login to Continue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2109/student");
      if (response.ok) {
        const data = await response.json();
        const userProjects = data.filter((p: any) => p.uploadedBy === user.name).map((p: any) => ({
          id: String(p.id),
          title: p.projectTitle || "Untitled",
          abstract: p.abstract || p.abstractText || "No description",
          technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies?.split(',') || []),
          submittedAt: p.date,
          status: 'approved',
          type: 'portfolio',
          rejectionComment: p.rejectionComment
        }));
        setMyProjects(userProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Submit Idea</h1>
            <p className="text-muted-foreground">Add your completed projects to your portfolio</p>
          </div>
          <div className="flex gap-2">
            <Link to="/submit-project">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project Idea
              </Button>
            </Link>
          </div>
        </div>

        {myProjects.length > 0 ? (
          <div className="space-y-4">
            {myProjects.map(project => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="text-xs">
                    Submitted on {project.submittedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.abstract}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 5).map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 5}
                      </Badge>
                    )}
                  </div>

                  {project.status === 'rejected' && project.rejectionComment && (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 mb-3">
                      <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                      <p className="text-sm text-muted-foreground">{project.rejectionComment}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.status === 'approved' && (
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Project
                        </Button>
                      </Link>
                    )}

                    <AIAnalysisButton
                      title={project.title}
                      abstract={project.abstract}
                      technologies={project.technologies}
                      department={user?.department || 'mca'}
                      projectId={project.id}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your completed project ideas to your portfolio.
              </p>
              <Link to="/submit-project">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project Idea
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;