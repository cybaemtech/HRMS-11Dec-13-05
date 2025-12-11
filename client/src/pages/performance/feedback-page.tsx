import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Plus, Users, MessageSquare, Star, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  const feedbackStats = [
    { title: "Active Reviews", value: "24", icon: <MessageSquare className="h-5 w-5" /> },
    { title: "Completed", value: "156", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending Response", value: "18", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Avg Rating", value: "4.3", icon: <Star className="h-5 w-5" />, color: "bg-amber-50 text-amber-600" },
  ];

  const feedbackRequests = [
    { 
      employee: "John Doe", 
      department: "Engineering", 
      reviewers: ["Manager", "Peers", "Direct Reports"], 
      responsesReceived: 8,
      totalReviewers: 10,
      status: "In Progress"
    },
    { 
      employee: "Jane Smith", 
      department: "Marketing", 
      reviewers: ["Manager", "Peers"], 
      responsesReceived: 5,
      totalReviewers: 5,
      status: "Completed"
    },
    { 
      employee: "Mike Johnson", 
      department: "Sales", 
      reviewers: ["Manager", "Peers", "Direct Reports"], 
      responsesReceived: 3,
      totalReviewers: 12,
      status: "In Progress"
    },
    { 
      employee: "Sarah Wilson", 
      department: "HR", 
      reviewers: ["Manager", "Peers"], 
      responsesReceived: 0,
      totalReviewers: 6,
      status: "Not Started"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Not Started": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">360° Feedback</h1>
            <p className="text-slate-500 mt-1">Collect comprehensive feedback from multiple sources</p>
          </div>
          <Button className="gap-2" data-testid="button-new-review">
            <Plus className="h-4 w-4" />
            New 360° Review
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feedbackStats.map((stat, index) => (
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
              <Award className="h-5 w-5 text-teal-600" />
              Active 360° Reviews
            </CardTitle>
            <CardDescription>Track feedback collection progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackRequests.map((feedback, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  data-testid={`row-feedback-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{feedback.employee}</h3>
                        <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{feedback.department}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {feedback.reviewers.map((reviewer, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{reviewer}</Badge>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Responses: {feedback.responsesReceived}/{feedback.totalReviewers}</span>
                          <span className="font-medium">{Math.round((feedback.responsesReceived / feedback.totalReviewers) * 100)}%</span>
                        </div>
                        <Progress value={(feedback.responsesReceived / feedback.totalReviewers) * 100} className="h-2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-view-${index}`}>
                        View Results
                      </Button>
                      {feedback.status !== "Completed" && (
                        <Button size="sm" data-testid={`button-remind-${index}`}>
                          Send Reminder
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
