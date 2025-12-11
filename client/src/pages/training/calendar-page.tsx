import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, Users, MapPin, Video } from "lucide-react";
import { motion } from "framer-motion";

export default function TrainingCalendarPage() {
  const trainingStats = [
    { title: "Upcoming Sessions", value: "12", icon: <Calendar className="h-5 w-5" /> },
    { title: "This Month", value: "8", icon: <Clock className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Total Enrolled", value: "245", icon: <Users className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Online Sessions", value: "6", icon: <Video className="h-5 w-5" />, color: "bg-purple-50 text-purple-600" },
  ];

  const trainingSessions = [
    { title: "Leadership Skills Workshop", date: "Feb 5, 2024", time: "10:00 AM - 4:00 PM", type: "In-Person", location: "Conference Room A", enrolled: 25, capacity: 30 },
    { title: "Advanced Excel Training", date: "Feb 8, 2024", time: "2:00 PM - 5:00 PM", type: "Online", location: "Zoom", enrolled: 45, capacity: 50 },
    { title: "Project Management Fundamentals", date: "Feb 12, 2024", time: "9:00 AM - 1:00 PM", type: "In-Person", location: "Training Hall", enrolled: 18, capacity: 20 },
    { title: "Communication Skills", date: "Feb 15, 2024", time: "11:00 AM - 3:00 PM", type: "Online", location: "MS Teams", enrolled: 32, capacity: 40 },
    { title: "Data Analytics Basics", date: "Feb 20, 2024", time: "10:00 AM - 5:00 PM", type: "In-Person", location: "IT Lab", enrolled: 15, capacity: 15 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Training Calendar</h1>
            <p className="text-slate-500 mt-1">View and manage upcoming training sessions</p>
          </div>
          <Button className="gap-2" data-testid="button-add-training">
            <Plus className="h-4 w-4" />
            Schedule Training
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trainingStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.color || "bg-teal-50 text-teal-600"}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Upcoming Training Sessions
            </CardTitle>
            <CardDescription>Scheduled training programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingSessions.map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  data-testid={`row-session-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{session.title}</h3>
                        <Badge variant={session.type === "Online" ? "secondary" : "default"}>
                          {session.type === "Online" ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                          {session.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.enrolled}/{session.capacity} enrolled
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-view-${index}`}>
                        View Details
                      </Button>
                      {session.enrolled < session.capacity && (
                        <Button size="sm" data-testid={`button-enroll-${index}`}>
                          Enroll
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
