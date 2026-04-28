import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, GraduationCap, BookOpen, Users, Sparkles } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import Navbar from '@/components/Navbar';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const approvedProjects = mockProjects.filter(p => p.status === 'approved');
  const uniqueTechnologies = new Set(mockProjects.flatMap(p => p.technologies));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Senior Project Repository</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover & Innovate <br />
            <span className="text-primary">Senior Projects</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore existing senior projects, avoid duplicates, and get AI-powered suggestions 
            to make your project unique and impactful.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by project title or technology..."
                className="h-12 pl-12 pr-4 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/projects">
              <Button size="lg" className="w-full sm:w-auto">
                <BookOpen className="mr-2 h-5 w-5" />
                View All Projects
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Login to Submit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{approvedProjects.length}</p>
              <p className="text-sm text-muted-foreground">Projects Available</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{uniqueTechnologies.size}+</p>
              <p className="text-sm text-muted-foreground">Technologies Covered</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">AI</p>
              <p className="text-sm text-muted-foreground">Powered Suggestions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-3">1</div>
            <h3 className="font-semibold mb-2">Search Projects</h3>
            <p className="text-sm text-muted-foreground">
              Browse through existing senior projects to check if your idea already exists
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-3">2</div>
            <h3 className="font-semibold mb-2">Get AI Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              View AI-powered improvement ideas to make similar projects unique
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-3">3</div>
            <h3 className="font-semibold mb-2">Submit Your Idea</h3>
            <p className="text-sm text-muted-foreground">
              Contribute your project abstract for others to discover
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Senior Project Repository © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
