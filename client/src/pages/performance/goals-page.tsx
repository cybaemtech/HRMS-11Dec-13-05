import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function GoalsPage() {
  const goalStats = [
    { title: "Total Goals", value: "48", icon: <Target className="h-5 w-5" />, color: "bg-teal-50 text-teal-600" },
    { title: "Completed", value: "22", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "In Progress", value: "18", icon: <TrendingUp className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Overdue", value: "8", icon: <AlertCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const goals = [
    { title: "Increase Sales by 20%", kpi: "Revenue Growth", owner: "Sales Team", progress: 75, dueDate: "Mar 31, 2024", status: "On Track" },
    { title: "Launch New Product Feature", kpi: "Product Delivery", owner: "Engineering", progress: 45, dueDate: "Feb 28, 2024", status: "At Risk" },
    { title: "Improve Customer Satisfaction", kpi: "NPS Score", owner: "Support Team", progress: 90, dueDate: "Jan 31, 2024", status: "Completed" },
    { title: "Reduce Operational Costs", kpi: "Cost Reduction", owner: "Operations", progress: 60, dueDate: "Apr 30, 2024", status: "On Track" },
    { title: "Employee Training Program", kpi: "Training Completion", owner: "HR Team", progress: 30, dueDate: "Mar 15, 2024", status: "Behind" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "On Track": return "bg-blue-100 text-blue-700";
      case "At Risk": return "bg-yellow-100 text-yellow-700";
      case "Behind": return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Goals & KPIs</h1>
            <p className="text-slate-500 mt-1">Set and track organizational goals and key performance indicators</p>
          </div>
          <Button className="gap-2" data-testid="button-add-goal">
            <Plus className="h-4 w-4" />
            Add New Goal
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goalStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
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
              <Target className="h-5 w-5 text-teal-600" />
              Active Goals
            </CardTitle>
            <CardDescription>Track progress on organizational objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  data-testid={`row-goal-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                        <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                        <span>KPI: {goal.kpi}</span>
                        <span>Owner: {goal.owner}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {goal.dueDate}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-${index}`}>
                      View Details
                    </Button>
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
