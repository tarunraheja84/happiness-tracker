'use client'
import { useState } from 'react';
import { User, Camera, Save, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useSession, signOut } from 'next-auth/react';
import { UserSession } from '@/types/UserSession';

const Profile = () => {
  const [activeView, setActiveView] = useState('profile');
  const session: UserSession | undefined = useSession().data?.user;
  console.log("session",session);
  const { toast } = useToast();

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-8 w-8 text-indigo-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your personal information
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={session?.picture || ''} alt="Profile" />
                </Avatar>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={session?.name || ''}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.email || ''}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
