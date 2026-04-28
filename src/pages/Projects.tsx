import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import TechnologyBadge from '@/components/TechnologyBadge';
import Loader from '@/components/Loader';
import { Project } from '@/data/mockData'; // Import Project interface
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

const Projects = () => {
  // const { getApprovedProjects } = useProjects(); // Removed static context usage
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiProjects, setApiProjects] = useState<Project[]>([]);


  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:2109/project");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Map API data to Project interface
        const mappedProjects: Project[] = data.map((p: any) => ({
          id: String(p.id),
          title: p.projectTitle || "Untitled Project",
          abstract: p.abstract || "Description not available",
          technologies: Array.isArray(p.technologies)
            ? p.technologies
            : typeof p.technologies === 'string'
              ? p.technologies.split(',').map((t: string) => t.trim())
              : [],
          status: 'approved', // Assuming all fetched/public projects are approved/ready to view
          submittedBy: p.uploadedBy || "Unknown User",
          submittedAt: p.date || new Date().toISOString(),
          type: 'abstract', // Default, adjust if API has this info
          githubLink: p.githubLink,
        }));

        setApiProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const filteredProjects = useMemo(() => {
    return apiProjects.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTech = selectedTech.length === 0 ||
        selectedTech.some(tech => project.technologies.includes(tech));

      return matchesSearch && matchesTech;
    });
  }, [searchQuery, selectedTech, apiProjects]);

  const toggleTech = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTech([]);
  };

  const popularTechnologies = ['React', 'Python', 'Node.js', 'MongoDB', 'TensorFlow', 'Firebase', 'Machine Learning'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showSearch onSearch={setSearchQuery} />
        <div className="container mx-auto px-4 py-16">
          <Loader text="Loading projects..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showSearch onSearch={setSearchQuery} />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground text-sm">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="self-start"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {selectedTech.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedTech.length}
              </span>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Filter by Technology</h3>
              {(selectedTech.length > 0 || searchQuery) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTechnologies.map(tech => (
                <TechnologyBadge
                  key={tech}
                  technology={tech}
                  selected={selectedTech.includes(tech)}
                  onClick={() => toggleTech(tech)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {selectedTech.length > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTech.map(tech => (
              <TechnologyBadge
                key={tech}
                technology={tech}
                selected
                onClick={() => toggleTech(tech)}
              />
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
