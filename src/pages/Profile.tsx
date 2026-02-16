import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Building2, MapPin, Shield, Camera, Save, X, Pencil } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  city: string;
  country: string;
}

const defaultProfile: UserProfile = {
  firstName: 'Ahmed',
  lastName: 'Benali',
  email: 'ahmed.benali@fleetmanager.ma',
  phone: '+212 6 12 34 56 78',
  company: 'FleetManager Pro',
  role: 'Administrateur',
  city: 'Casablanca',
  country: 'Maroc',
};

const Profile = () => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fleet-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('fleet-profile', JSON.stringify(editForm));
    setIsEditing(false);
    toast.success(t.profile.saveSuccess);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.profile.title}</h1>
          <p className="text-muted-foreground">{t.profile.subtitle}</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Pencil className="w-4 h-4" />
            {t.common.edit}
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 text-2xl">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Shield className="w-4 h-4" />
                {profile.role}
              </p>
              <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Building2 className="w-4 h-4" />
                {profile.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t.profile.personalInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.profile.firstName}</Label>
                  <Input
                    id="firstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.profile.lastName}</Label>
                  <Input
                    id="lastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.profile.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.profile.phone}</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">{t.profile.company}</Label>
                  <Input
                    id="company"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t.profile.role}</Label>
                  <Input
                    id="role"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.profile.city}</Label>
                  <Input
                    id="city"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t.profile.country}</Label>
                  <Input
                    id="country"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="w-4 h-4" />
                  {t.common.cancel}
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  {t.common.save}
                </Button>
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <ProfileField icon={<User className="w-4 h-4" />} label={t.profile.firstName} value={profile.firstName} />
              <ProfileField icon={<User className="w-4 h-4" />} label={t.profile.lastName} value={profile.lastName} />
              <ProfileField icon={<Mail className="w-4 h-4" />} label={t.profile.email} value={profile.email} />
              <ProfileField icon={<Phone className="w-4 h-4" />} label={t.profile.phone} value={profile.phone} />
              <ProfileField icon={<Building2 className="w-4 h-4" />} label={t.profile.company} value={profile.company} />
              <ProfileField icon={<Shield className="w-4 h-4" />} label={t.profile.role} value={profile.role} />
              <ProfileField icon={<MapPin className="w-4 h-4" />} label={t.profile.city} value={profile.city} />
              <ProfileField icon={<MapPin className="w-4 h-4" />} label={t.profile.country} value={profile.country} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default Profile;
