import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
      <h1 className="text-6xl mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button className="gap-2">
          <Home className="size-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
