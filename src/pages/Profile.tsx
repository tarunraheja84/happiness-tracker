
import { useState } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [activeView, setActiveView] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face'
  });

  const [savedMoodDetractors, setSavedMoodDetractors] = useState([
    { id: 'stress', label: 'Work Stress', frequency: 'Often' },
    { id: 'anxiety', label: 'Social Anxiety', frequency: 'Sometimes' },
    { id: 'overthinking', label: 'Overthinking', frequency: 'Daily' }
  ]);

  const { toast } = useToast();

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMoodDetractor = (id: string) => {
    setSavedMoodDetractors(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Mood detractor removed",
      description: "The mood detractor has been removed from your profile.",
    });
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
            Manage your personal information and mood tracking preferences
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
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
                  <AvatarImage src={profileData.profileImage} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="profile-upload"
                  />
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Mood Detractors */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <User className="h-5 w-5" />
                Saved Mood Detractors
              </CardTitle>
              <p className="text-sm text-orange-600">
                Common mood patterns you've identified
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedMoodDetractors.length > 0 ? (
                <div className="space-y-3">
                  {savedMoodDetractors.map((detractor) => (
                    <div
                      key={detractor.id}
                      className="flex items-center justify-between p-3 bg-white/70 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-orange-800">{detractor.label}</p>
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            {detractor.frequency}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMoodDetractor(detractor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-orange-600">
                    No saved mood detractors yet. Start tracking your mood to build patterns.
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-orange-200">
                <p className="text-sm text-orange-600 mb-2">
                  Mood detractors are automatically saved when you track them consistently.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => window.location.href = '/'}
                >
                  Track Mood Now
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
