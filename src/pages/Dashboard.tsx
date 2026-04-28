import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Clock, BookOpen, Users, AlertCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AbstractItem = {
  id: string;
  abstractId: number | null;
  title: string;
  abstract: string;
  technologies: string[];
  submittedBy: string;
  submittedAt: string;
  status: 'approved' | 'pending' | 'rejected';
};

const normalizeStatus = (status?: string): 'approved' | 'pending' | 'rejected' => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'approved') return 'approved';
  if (normalized === 'rejected') return 'rejected';
  return 'pending';
};

const parseTechnologies = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const Dashboard = () => {
  const { user, isStaff, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [abstracts, setAbstracts] = useState<AbstractItem[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<'approved' | 'rejected' | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.department || !isStaff || !isAuthenticated) return;

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        // Fetch dashboard stats
        const statsResponse = await fetch(
          `http://localhost:2109/abstract/dashboard/${encodeURIComponent(user.department)}`,
          { signal: controller.signal }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            total: statsData.total || 0,
            pending: statsData.pending || 0,
            approved: statsData.approved || 0,
            rejected: statsData.rejected || 0,
          });
        }

        // Fetch pending abstracts for review
        const abstractsResponse = await fetch(
          `http://localhost:2109/abstract/department/${encodeURIComponent(user.department)}`,
          { signal: controller.signal }
        );

        if (!abstractsResponse.ok) {
          throw new Error(`Failed to fetch abstracts (${abstractsResponse.status})`);
        }

        const data = await abstractsResponse.json();
        const rawList: any[] = Array.isArray(data) ? data : data?.abstracts || [];

        const normalized: AbstractItem[] = rawList
          .map((item) => {
            const rawId = item.abstract_id ?? item.abstractId ?? item.id ?? item._id;
            if (rawId === undefined || rawId === null) return null;

            const numericId = Number(rawId);

            return {
              id: String(rawId),
              abstractId: Number.isFinite(numericId) ? numericId : null,
              title: item.title || item.projectTitle || item.abstractTitle || 'Untitled Abstract',
              abstract: item.abstract || item.description || item.summary || 'No abstract provided.',
              technologies: parseTechnologies(item.technologies || item.techStack || item.technology || item.technologyUsed),
              submittedBy: item.submittedBy || item.studentName || item.author || 'Unknown student',
              submittedAt: item.submittedAt || item.submissionDate || item.createdAt || 'Not specified',
              status: normalizeStatus(item.status),
            } as AbstractItem;
          })
          .filter((item): item is AbstractItem => item !== null);

        setAbstracts(normalized);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        setFetchError(error?.message || 'Unable to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [user?.department, isStaff, isAuthenticated]);

  const pendingProjects = useMemo(
    () => abstracts.filter(project => normalizeStatus(project.status) === 'pending'),
    [abstracts]
  );

  const approvedProjects = useMemo(
    () => abstracts.filter(project => normalizeStatus(project.status) === 'approved'),
    [abstracts]
  );

  const rejectedProjects = useMemo(
    () => abstracts.filter(project => normalizeStatus(project.status) === 'rejected'),
    [abstracts]
  );

  if (!isAuthenticated || !isStaff) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            This page is only accessible to staff members.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user?.department) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Department Required</h1>
          <p className="text-muted-foreground mb-6">
            Staff department is missing. Please update your profile or contact an administrator.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const submitReview = async (
    project: AbstractItem,
    decision: 'approved' | 'rejected',
    comment?: string
  ) => {
    setActionLoadingId(project.id);
    setFetchError(null);

    try {
      const abstractNumericId = project.abstractId ?? Number(project.id);
      const payload = {
        abstract_id: Number.isFinite(abstractNumericId) ? abstractNumericId : project.id,
        staff_id: user?.id ? Number(user.id) || user.id : undefined,
        action: decision.toUpperCase(),
        remarks: comment || '',
      };

      const response = await fetch('http://localhost:2109/review/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review (${response.status})`);
      }

      return true;
    } catch (error: any) {
      const message = error?.message || 'Unable to submit review.';
      setFetchError(message);
      toast({
        title: 'Review failed',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  const openReviewDialog = (projectId: string, action: 'approved' | 'rejected') => {
    setSelectedProjectId(projectId);
    setSelectedAction(action);
    setReviewComment('');
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (!selectedProjectId || !selectedAction) return;

    const project = abstracts.find(item => item.id === selectedProjectId);
    if (!project) return;

    // For rejection, remarks are optional but encouraged. For approval, remarks are optional.
    const ok = await submitReview(project, selectedAction, reviewComment.trim() || '');
    if (!ok) return;

    setAbstracts(prev =>
      prev.map(item =>
        item.id === selectedProjectId
          ? { ...item, status: selectedAction }
          : item
      )
    );

    const toastConfig = selectedAction === 'approved'
      ? {
          title: 'Abstract Approved',
          description: 'The abstract has been approved and is now visible to students.',
        }
      : {
          title: 'Abstract Rejected',
          description: 'The abstract has been rejected with feedback.',
          variant: 'destructive' as const,
        };

    toast(toastConfig);
    setReviewDialogOpen(false);
    setSelectedProjectId(null);
    setSelectedAction(null);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Staff Abstract Dashboard</h1>

        {fetchError && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
            {fetchError}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Abstracts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved Abstracts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected Abstracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Abstracts ({pendingProjects.length})
            </CardTitle>
            <CardDescription>
              Review and approve or reject abstract submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading pending abstracts...</div>
            ) : pendingProjects.length > 0 ? (
              <div className="space-y-4">
                {pendingProjects.map(project => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.abstract}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted by {project.submittedBy} on {project.submittedAt}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => openReviewDialog(project.id, 'approved')}
                        disabled={actionLoadingId === project.id}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {actionLoadingId === project.id ? 'Saving...' : 'Approve Abstract'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openReviewDialog(project.id, 'rejected')}
                        disabled={actionLoadingId === project.id}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject Abstract
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending submissions to review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approved' ? 'Approve Abstract' : 'Reject Abstract'}
            </DialogTitle>
            <DialogDescription>
              {selectedAction === 'approved'
                ? 'Add optional remarks for the student about the approved abstract.'
                : 'Please provide a reason for rejecting this abstract. This feedback will be visible to the student.'}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={selectedAction === 'approved' ? 'Enter optional remarks...' : 'Enter rejection reason...'}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              variant={selectedAction === 'approved' ? 'default' : 'destructive'}
              disabled={selectedAction === 'rejected' && !reviewComment.trim()}
            >
              {selectedAction === 'approved' ? 'Approve Abstract' : 'Reject Abstract'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
