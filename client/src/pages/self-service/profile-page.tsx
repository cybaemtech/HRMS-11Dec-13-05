import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Users, Mail, Phone, MapPin, Building2, Calendar, Edit, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
}

export default function MyProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.personalPhone || "+91 9876543210",
    address: user?.address || "123 Main Street, Mumbai, Maharashtra",
    photoUrl: user?.photoUrl || ""
  });

  const [editData, setEditData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    address: profileData.address
  });

  useEffect(() => {
    if (showEditDialog) {
      setEditData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address
      });
    }
  }, [showEditDialog, profileData]);

  const profileInfo = {
    personalInfo: [
      { label: "Full Name", value: `${profileData.firstName} ${profileData.lastName}`, icon: <Users className="h-4 w-4" /> },
      { label: "Email", value: profileData.email, icon: <Mail className="h-4 w-4" /> },
      { label: "Phone", value: profileData.phone, icon: <Phone className="h-4 w-4" /> },
      { label: "Address", value: profileData.address, icon: <MapPin className="h-4 w-4" /> },
    ],
    employmentInfo: [
      { label: "Employee ID", value: user?.employeeId || "EMP001" },
      { label: "Department", value: user?.departmentId ? `Dept ${user.departmentId}` : "Engineering" },
      { label: "Position", value: user?.position || "Senior Developer" },
      { label: "Join Date", value: user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Jan 15, 2022" },
      { label: "Employment Type", value: "Full-time" },
      { label: "Reporting Manager", value: user?.managerId ? `Manager ${user.managerId}` : "Sarah Johnson" },
    ],
  };

  const handleSaveProfile = () => {
    if (!editData.firstName || !editData.lastName || !editData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setProfileData(prev => ({
      ...prev,
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      phone: editData.phone,
      address: editData.address
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
    setShowEditDialog(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image under 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          photoUrl: reader.result as string
        }));
        toast({
          title: "Photo Updated",
          description: "Your profile photo has been updated successfully."
        });
        setShowPhotoDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">My Profile</h1>
            <p className="text-slate-500 mt-1">View and manage your personal information</p>
          </div>
          <Button className="gap-2" onClick={() => setShowEditDialog(true)} data-testid="button-edit-profile">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={profileData.photoUrl} alt={`${profileData.firstName} ${profileData.lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full" 
                  onClick={() => setShowPhotoDialog(true)}
                  data-testid="button-change-photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900" data-testid="text-full-name">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-slate-500">{user?.position || "Senior Developer"}</p>
              <Badge className="mt-2" variant="secondary">{user?.departmentId ? `Department ${user.departmentId}` : "Engineering"}</Badge>
              
              <div className="mt-6 pt-6 border-t space-y-3 text-left">
                {profileInfo.personalInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm" data-testid={`text-personal-info-${index}`}>
                    <div className="text-slate-400">{info.icon}</div>
                    <span className="text-slate-600">{info.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                Employment Information
              </CardTitle>
              <CardDescription>Your employment details and work information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileInfo.employmentInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-slate-50"
                  >
                    <p className="text-sm text-slate-500">{info.label}</p>
                    <p className="font-medium text-slate-900 mt-1">{info.value}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-elevate cursor-pointer" data-testid="card-leave-balance">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-sm text-slate-500">Leave Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-elevate cursor-pointer" data-testid="card-attendance">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">98%</p>
                  <p className="text-sm text-slate-500">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-elevate cursor-pointer" data-testid="card-documents">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-sm text-slate-500">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  value={editData.firstName}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  value={editData.lastName}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  data-testid="input-last-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                data-testid="input-address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} data-testid="button-save-profile">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData.photoUrl} />
                <AvatarFallback className="text-4xl">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label>Upload New Photo</Label>
              <Input 
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                data-testid="input-photo"
              />
              <p className="text-sm text-slate-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
