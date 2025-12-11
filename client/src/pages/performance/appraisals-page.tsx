import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calendar, Star, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AppraisalsPage() {
  const [selectedCycle, setSelectedCycle] = useState("Q4 2023");

  const appraisalStats = [
    { title: "Total Employees", value: "156", icon: <Users className="h-5 w-5" /> },
    { title: "Completed", value: "128", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "28", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Avg Rating", value: "4.2", icon: <Star className="h-5 w-5" />, color: "bg-amber-50 text-amber-600" },
  ];

  const appraisals = [
    { employee: "John Doe", department: "Engineering", manager: "Sarah Wilson", selfRating: 4.5, managerRating: 4.2, status: "Completed" },
    { employee: "Jane Smith", department: "Marketing", manager: "Mike Johnson", selfRating: 4.0, managerRating: null, status: "Manager Review" },
    { employee: "Amit Singh", department: "Sales", manager: "Priya Sharma", selfRating: null, managerRating: null, status: "Self Review" },
    { employee: "Sneha Patel", department: "HR", manager: "Tom Brown", selfRating: 4.3, managerRating: 4.5, status: "Completed" },
    { employee: "Rajesh Kumar", department: "Finance", manager: "Lisa Chen", selfRating: 3.8, managerRating: 4.0, status: "Completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Manager Review": return "bg-blue-100 text-blue-700";
      case "Self Review": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const renderRating = (rating: number | null) => {
    if (rating === null) return <span className="text-slate-400">-</span>;
    return (
      <span className="flex items-center gap-1">
        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
        {rating.toFixed(1)}
      </span>
    );
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Performance Appraisals</h1>
            <p className="text-slate-500 mt-1">Manage employee performance reviews and ratings</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
              <SelectTrigger className="w-32" data-testid="select-cycle">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q4 2023">Q4 2023</SelectItem>
                <SelectItem value="Q3 2023">Q3 2023</SelectItem>
                <SelectItem value="Q2 2023">Q2 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" data-testid="button-new-cycle">
              <TrendingUp className="h-4 w-4" />
              New Appraisal Cycle
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appraisalStats.map((stat, index) => (
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
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Appraisal Status - {selectedCycle}
            </CardTitle>
            <CardDescription>Employee performance review status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Manager</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Self Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Manager Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appraisals.map((appraisal, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-appraisal-${index}`}>
                      <td className="py-3 px-4 font-medium">{appraisal.employee}</td>
                      <td className="py-3 px-4 text-slate-600">{appraisal.department}</td>
                      <td className="py-3 px-4 text-slate-600">{appraisal.manager}</td>
                      <td className="py-3 px-4">{renderRating(appraisal.selfRating)}</td>
                      <td className="py-3 px-4">{renderRating(appraisal.managerRating)}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(appraisal.status)}>{appraisal.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" className="gap-1" data-testid={`button-view-${index}`}>
                          <FileText className="h-3 w-3" />
                          View
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
