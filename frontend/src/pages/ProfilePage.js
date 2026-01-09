import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import {
  User,
  Mail,
  Briefcase,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Edit,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const profileDetails = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Briefcase, label: 'Title', value: user?.title },
    { icon: Shield, label: 'Role', value: user?.role, capitalize: true },
    { icon: Calendar, label: 'Member Since', value: 'January 2023' },
    { icon: MapPin, label: 'Region', value: 'Northeast' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  ];

  const activityLog = [
    { action: 'Logged in', time: 'Today at 9:00 AM' },
    { action: 'Updated patient record PT-2024-0087', time: 'Yesterday at 4:32 PM' },
    { action: 'Approved VAC request', time: 'Yesterday at 2:15 PM' },
    { action: 'Generated monthly report', time: '2 days ago' },
    { action: 'Added new site: Northwestern Memorial', time: '3 days ago' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information"
        icon={User}
        actions={
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="card-clinical lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto border-4 border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.title}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user?.role}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              {profileDetails.map((detail, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <detail.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className={`text-sm font-medium ${detail.capitalize ? 'capitalize' : ''}`}>
                      {detail.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Patients Managed', value: '156' },
              { label: 'VACs Processed', value: '89' },
              { label: 'Sites Active', value: '12' },
              { label: 'This Month', value: '+23%' },
            ].map((stat, index) => (
              <Card key={index} className="card-kpi">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Permissions */}
          <Card className="card-clinical">
            <CardHeader>
              <CardTitle className="text-base">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user?.permissions?.map((perm, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {perm === 'all' ? 'Full Access' : perm}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-clinical">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
