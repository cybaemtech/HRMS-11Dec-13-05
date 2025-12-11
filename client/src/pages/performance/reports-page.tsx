import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, Calendar, TrendingUp, Users, Star, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PerformanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2023");

  const reportCards = [
    { title: "Department Performance", description: "Compare performance across departments", icon: <Users className="h-6 w-6" /> },
    { title: "Rating Distribution", description: "Distribution of performance ratings", icon: <Star className="h-6 w-6" /> },
    { title: "Goal Achievement", description: "Track goal completion rates", icon: <TrendingUp className="h-6 w-6" /> },
    { title: "Top Performers", description: "Identify high-performing employees", icon: <Award className="h-6 w-6" /> },
  ];

  const departmentPerformance = [
    { department: "Engineering", avgRating: 4.3, goalCompletion: 85, employees: 45 },
    { department: "Marketing", avgRating: 4.1, goalCompletion: 78, employees: 22 },
    { department: "Sales", avgRating: 4.5, goalCompletion: 92, employees: 35 },
    { department: "HR", avgRating: 4.2, goalCompletion: 88, employees: 12 },
    { department: "Finance", avgRating: 4.0, goalCompletion: 82, employees: 18 },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Performance Reports</h1>
            <p className="text-slate-500 mt-1">Analytics and insights on employee performance</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-28" data-testid="select-period">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover-elevate cursor-pointer" data-testid={`card-report-${index}`}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-teal-50 text-teal-600 w-fit mb-4">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-500">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              Department Performance Summary
            </CardTitle>
            <CardDescription>Performance metrics by department for {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employees</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Avg Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Goal Completion</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentPerformance.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-dept-${index}`}>
                      <td className="py-3 px-4 font-medium">{dept.department}</td>
                      <td className="py-3 px-4 text-slate-600">{dept.employees}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          {dept.avgRating.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={dept.goalCompletion >= 85 ? "default" : "secondary"}>
                          {dept.goalCompletion}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" data-testid={`button-view-${index}`}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
