import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { allTechnologies } from '@/data/mockData';
import { X, Check, Loader2 } from 'lucide-react';
import AIAnalysisButton from '@/components/AIAnalysisButton';

const SubmitProject = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTech, setSelectedTech] = useState<string[]>([]);
    const [githubLink, setGithubLink] = useState('');
    const [techSearch, setTechSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    // Fetch projects when component mounts
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchProjects();
        }
    }, [isAuthenticated, user?.id]);

    const fetchProjects = async () => {
        if (!user?.id) return;

        setIsLoadingProjects(true);
        try {
            const response = await fetch(`http://localhost:2109/project/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.status}`);
            }

            const data = await response.json();
            setProjects(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast({
                title: 'Failed to Load Projects',
                description: error instanceof Error ? error.message : 'Could not load your projects.',
                variant: "destructive"
            });
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const filteredTechnologies = allTechnologies.filter(
        tech =>
            tech.toLowerCase().includes(techSearch.toLowerCase()) &&
            !selectedTech.includes(tech)
    ).slice(0, 8);

    const toggleTech = (tech: string) => {
        if (selectedTech.includes(tech)) {
            setSelectedTech(prev => prev.filter(t => t !== tech));
        } else {
            setSelectedTech(prev => [...prev, tech]);
            setTechSearch('');
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to submit a project.",
                variant: "destructive"
            });
            return;
        }

        if (!title.trim() || !description.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide both a project title and a description.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                projectTitle: title,
                abstractText: description,
                department: user.department ,
                year: new Date().getFullYear(),
                technologies: selectedTech.join(', '),
                githubLink: githubLink || "",
                userId: user.id,
            };

            const response = await fetch("http://localhost:2109/project/addidea", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit: ${response.status}`);
            }

            toast({
                title: 'Project Added!',
                description: 'Your project has been added to the repository.',
            });

            navigate('/my-submissions'); // Redirect to submissions list
        } catch (error) {
            console.error("Error submitting project:", error);
            toast({
                title: 'Submission Failed',
                description: error instanceof Error ? error.message : 'There was an error submitting your project.',
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="text-muted-foreground mb-6">
                        Please log in to submit a project.
                    </p>
                    <Button onClick={() => navigate('/login')}>Login to Continue</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header with Submit Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Your Projects</h1>
                        <p className="text-muted-foreground mt-2">Manage and submit your projects</p>
                    </div>
                    <Button
                        onClick={() => setShowSubmitForm(!showSubmitForm)}
                        size="lg"
                    >
                        {showSubmitForm ? 'Hide Form' : '+ Submit New Project'}
                    </Button>
                </div>

                {/* Submit Form */}
                {showSubmitForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Submit Completed Project</CardTitle>
                            <CardDescription>
                                Add your completed project to the repository portfolio.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., E-Commerce Platform"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what your project does, its key features and architecture..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Technologies</Label>
                                    {selectedTech.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {selectedTech.map(tech => (
                                                <Badge key={tech} variant="default" className="gap-1">
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleTech(tech)}
                                                        className="ml-1 hover:bg-primary-foreground/20 rounded-full"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <Input
                                        placeholder="Search technologies..."
                                        value={techSearch}
                                        onChange={(e) => setTechSearch(e.target.value)}
                                    />

                                    {(techSearch || selectedTech.length === 0) && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {filteredTechnologies.map(tech => (
                                                <Badge
                                                    key={tech}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-secondary"
                                                    onClick={() => toggleTech(tech)}
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="github">GitHub Link (Optional)</Label>
                                    <Input
                                        id="github"
                                        type="url"
                                        placeholder="https://github.com/username/repo"
                                        value={githubLink}
                                        onChange={(e) => setGithubLink(e.target.value)}
                                    />
                                </div>

                                {(title && description) && (
                                    <Card className="bg-muted/50 border-dashed">
                                        <CardContent className="pt-4">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                🔍 Analyze your description before submission.
                                            </p>
                                            <AIAnalysisButton
                                                title={title}
                                                abstract={description}
                                                technologies={selectedTech}
                                                department={user?.department}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                                        {isSubmitting ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Add Project
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowSubmitForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Projects List */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Submitted Projects</h2>
                    
                    {isLoadingProjects ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                <p className="text-muted-foreground">Loading your projects...</p>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    No projects submitted yet. Click "Submit New Project" to get started!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <Card key={project.id || project._id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg line-clamp-2">
                                            {project.projectTitle || project.title || 'Untitled Project'}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {project.year && `Year: ${project.year}`}
                                            {project.department && ` • ${project.department}`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {project.abstractText || project.description || 'No description'}
                                        </p>
                                        {project.technologies && (
                                            <div className="flex flex-wrap gap-1">
                                                {(typeof project.technologies === 'string'
                                                    ? project.technologies.split(',')
                                                    : Array.isArray(project.technologies)
                                                    ? project.technologies
                                                    : []
                                                ).map((tech: string) => (
                                                    <Badge key={tech.trim()} variant="secondary" className="text-xs">
                                                        {tech.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-500 hover:underline block"
                                            >
                                                View on GitHub →
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmitProject;
