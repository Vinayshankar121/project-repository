import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, GraduationCap, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const Navbar = ({ onSearch, showSearch = false }: NavbarProps) => {
  const { user, logout, isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Project Repository</span>
        </Link>

        {showSearch && (
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-3">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              Projects
            </Button>
          </Link>

          {/* {isAuthenticated ? (
            <>
              {isStaff ? (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/submit-project">
                  <Button variant="ghost" size="sm">
                    Submit Project
                  </Button>
                </Link>
              )}
              <Link to="/submit-abstract">
                <Button variant="outline" size="sm">
                  Submit Abstract
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name}
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )} */}

          {isAuthenticated ? (
            <>
              {/* STAFF NAVIGATION */}
              {isStaff && (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Dashboard
                    </Button>
                  </Link>

                  {/* <Link to="/projects">
                    <Button variant="ghost" size="sm">
                      Projects
                    </Button>
                  </Link> */}
                </>
              )}

              {/* STUDENT NAVIGATION */}
              {!isStaff && (
                <>
                  {/* <Link to="/projects">
                    <Button variant="ghost" size="sm">
                      Projects
                    </Button>
                  </Link> */}

                  <Link to="/submit-project">
                    <Button variant="ghost" size="sm">
                      Submit Idea
                    </Button>
                  </Link>

                  <Link to="/submit-abstract">
                    <Button variant="outline" size="sm">
                      Submit Abstract
                    </Button>
                  </Link>
                </>
              )}

              {/* COMMON LOGOUT */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name}
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
