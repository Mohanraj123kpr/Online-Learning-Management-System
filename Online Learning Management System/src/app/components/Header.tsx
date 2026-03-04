import { Link, useLocation } from 'react-router';
import { BookOpen, Home, GraduationCap, Search, User, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <>
      <Link to="/">
        <Button
          variant={isActive('/') ? 'default' : 'ghost'}
          className="gap-2"
        >
          <Home className="size-4" />
          <span>Dashboard</span>
        </Button>
      </Link>
      <Link to="/catalog">
        <Button
          variant={isActive('/catalog') ? 'default' : 'ghost'}
          className="gap-2"
        >
          <Search className="size-4" />
          <span>Browse Courses</span>
        </Button>
      </Link>
      <Link to="/my-learning">
        <Button
          variant={isActive('/my-learning') ? 'default' : 'ghost'}
          className="gap-2"
        >
          <BookOpen className="size-4" />
          <span>My Learning</span>
        </Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap className="size-6 text-white" />
            </div>
            <span className="text-xl font-bold">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLinks />
          </nav>

          {/* Search and Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-64 pl-10"
                />
              </div>
            </div>

            <Avatar className="size-9">
              <AvatarImage src="https://images.unsplash.com/photo-1629507208649-70919ca33793?w=100" />
              <AvatarFallback>
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
