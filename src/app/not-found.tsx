import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
} 