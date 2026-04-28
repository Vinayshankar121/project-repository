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
import { X, Check, Plus, FileText, RefreshCw } from 'lucide-react';
import AIAnalysisButton from '@/components/AIAnalysisButton';

interface AbstractSubmission {
    id: number;
    title: string;
    abstractText: string;
    technologies: string;
    department: string;
    status: string;
    createdAt: string;
    abstractId?: number;
    remarks?: string;
    action?: string;
}

const SubmitAbstract = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [selectedTech, setSelectedTech] = useState<string[]>([]);
    const [techSearch, setTechSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [previousSubmissions, setPreviousSubmissions] = useState<AbstractSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        if (user?.id) {
            fetchPreviousSubmissions();
        }
    }, [user?.id]);

    const fetchPreviousSubmissions = async () => {
        if (!user?.id) return;
        
        setIsLoading(true);
        try {
            // Fetch abstracts list
            const response = await fetch(`http://localhost:2109/abstract/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }
            const data = await response.json();
            const submissions = Array.isArray(data) ? data : [];

            console.log('Submissions from API:', submissions);

            // Fetch all status details in one call
            let statusDataMap: Record<number, any> = {};
            try {
                const statusResponse = await fetch(
                    `http://localhost:2109/abstract/status/${user.id}`
                );
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    console.log('Status data from API:', statusData);
                    
                    // Create a map of abstractId -> status details
                    if (Array.isArray(statusData)) {
                        statusData.forEach((status: any) => {
                            const id = status.abstractId || status.id;
                            if (id !== null && id !== undefined) {
                                statusDataMap[id] = status;
                                console.log(`Mapped status for abstractId ${id}:`, status);
                            }
                        });
                    } else if (statusData?.abstractId) {
                        statusDataMap[statusData.abstractId] = statusData;
                        console.log(`Mapped status for abstractId ${statusData.abstractId}:`, statusData);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch status:', error);
            }

            console.log('Status map:', statusDataMap);

            // Enrich submissions with status details
            const enrichedSubmissions = submissions.map((submission: any) => {
                // Try multiple field name variations to find the ID
                const submissionId = submission.abstractId || submission.abstract_id || submission.id;
                const statusDetail = statusDataMap[submissionId];
                
                console.log(`Looking up status for submission id=${submissionId}:`, statusDetail);
                
                if (statusDetail && statusDetail.action) {
                    const enriched = {
                        ...submission,
                        status: statusDetail.action,
                        remarks: statusDetail.remarks || '',
                    };
                    console.log('Enriched submission:', enriched);
                    return enriched;
                }
                return submission;
            });

            console.log('Final enriched submissions:', enrichedSubmissions);
            setPreviousSubmissions(enrichedSubmissions);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            toast({
                title: 'Error',
                description: 'Failed to load previous submissions.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to submit.",
                variant: "destructive"
            });
            return;
        }

        if (!title.trim() || !abstract.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide both a project title and an abstract.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: title,
                abstractText: abstract,
                technologies: selectedTech.join(', '),
                department: user.department,
                status: "SUBMITTED",
                userId: parseInt(user.id),
            };

            console.log('Submitting payload:', payload);

            const response = await fetch("http://localhost:2109/abstract", {
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
                title: 'Abstract Submitted!',
                description: 'Your project abstract has been submitted for staff approval.',
            });

            // Reset form and refresh submissions
            setTitle('');
            setAbstract('');
            setSelectedTech([]);
            setShowForm(false);
            fetchPreviousSubmissions();
        } catch (error) {
            console.error("Error submitting project:", error);
            toast({
                title: 'Submission Failed',
                description: error instanceof Error ? error.message : 'There was an error submitting your abstract.',
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        const upperStatus = (status || '').toUpperCase();
        if (upperStatus === 'APPROVED') {
            return 'bg-green-500';
        } else if (upperStatus === 'REJECTED') {
            return 'bg-red-500';
        } else {
            return 'bg-yellow-500';
        }
    };

    const getDisplayStatus = (status: string | null | undefined) => {
        if (!status) return 'SUBMITTED';
        return status.toUpperCase();
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="text-muted-foreground mb-6">
                        Please log in to submit a project abstract.
                    </p>
                    <Button onClick={() => navigate('/login')}>Login to Continue</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {!showForm ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold">My Abstract Submissions</h1>
                                <p className="text-muted-foreground mt-2">
                                    View and manage your project abstract submissions
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => fetchPreviousSubmissions()}
                                    variant="outline"
                                    size="sm"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                                <Button onClick={() => setShowForm(true)} size="lg">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Submit New Abstract
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Loading submissions...</p>
                                </CardContent>
                            </Card>
                        ) : previousSubmissions.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Submit your first project abstract to get started
                                    </p>
                                    <Button onClick={() => setShowForm(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Submit Abstract
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {previousSubmissions.map((submission) => (
                                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
                                                    <div className="flex gap-2 items-center">
                                                        <Badge className={getStatusColor(submission.status)}>
                                                            {getDisplayStatus(submission.status)}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(submission.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                                {submission.abstractText}
                                            </p>
                                            {submission.technologies && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {submission.technologies.split(',').map((tech, idx) => (
                                                        <Badge key={idx} variant="outline">
                                                            {tech.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="text-sm text-muted-foreground mb-4">
                                                Department: <span className="font-medium">{submission.department}</span>
                                            </div>

                                            {submission.remarks && (
                                                <div className={`p-3 rounded-lg border ${
                                                    getDisplayStatus(submission.status) === 'REJECTED'
                                                        ? 'bg-destructive/10 border-destructive/20'
                                                        : 'bg-green-500/10 border-green-500/20'
                                                }`}>
                                                    <p className={`text-sm font-medium mb-1 ${
                                                        getDisplayStatus(submission.status) === 'REJECTED'
                                                            ? 'text-destructive'
                                                            : 'text-green-600'
                                                    }`}>
                                                        {getDisplayStatus(submission.status) === 'REJECTED' ? 'Rejection Reason:' : 'Staff Remarks:'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{submission.remarks}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">Submit Final Year Project Abstract</CardTitle>
                                    <CardDescription>
                                        Submit your abstract to college management for review and approval.
                                        Use AI analysis to check similarity before submitting.
                                    </CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => setShowForm(false)}>
                                    Back to List
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Smart Campus Navigation System"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="abstract">Abstract *</Label>
                                    <Textarea
                                        id="abstract"
                                        placeholder="Describe your project, its goals, features, and potential impact..."
                                        value={abstract}
                                        onChange={(e) => setAbstract(e.target.value)}
                                        required
                                        rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {abstract.length} characters
                                    </p>
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

                                {(title && abstract) && (
                                    <Card className="bg-muted/50 border-dashed">
                                        <CardContent className="pt-4">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                🔍 Analyze your abstract before submission to check for similarity and get improvement suggestions.
                                            </p>
                                            <AIAnalysisButton
                                                title={title}
                                                abstract={abstract}
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
                                                Submit for Approval
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SubmitAbstract;
