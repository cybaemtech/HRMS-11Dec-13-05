import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Download, Calendar, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AttendanceReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const reportStats = [
    { title: "Average Attendance", value: "94.5%", icon: <Users className="h-5 w-5" />, color: "bg-teal-50 text-teal-600" },
    { title: "Total Working Days", value: "22", icon: <Calendar className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Late Arrivals", value: "45", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Absent Days", value: "28", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const departmentData = [
    { name: "Engineering", employees: 45, avgAttendance: 96.2, lateArrivals: 12, absences: 8 },
    { name: "Sales", employees: 32, avgAttendance: 93.5, lateArrivals: 18, absences: 10 },
    { name: "Marketing", employees: 18, avgAttendance: 95.1, lateArrivals: 6, absences: 4 },
    { name: "HR", employees: 12, avgAttendance: 97.8, lateArrivals: 3, absences: 2 },
    { name: "Finance", employees: 15, avgAttendance: 94.9, lateArrivals: 6, absences: 4 },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Attendance Reports</h1>
            <p className="text-slate-500 mt-1">Comprehensive attendance analysis and trends</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40" data-testid="select-month">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January 2024">January 2024</SelectItem>
                <SelectItem value="December 2023">December 2023</SelectItem>
                <SelectItem value="November 2023">November 2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40" data-testid="select-department">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportStats.map((stat, index) => (
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
              <ClipboardList className="h-5 w-5 text-teal-600" />
              Department-wise Attendance Summary
            </CardTitle>
            <CardDescription>Attendance breakdown by department for {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employees</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Avg. Attendance</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Late Arrivals</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Absences</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-dept-${index}`}>
                      <td className="py-3 px-4 font-medium">{dept.name}</td>
                      <td className="py-3 px-4">{dept.employees}</td>
                      <td className="py-3 px-4">
                        <span className={dept.avgAttendance >= 95 ? "text-green-600" : "text-yellow-600"}>
                          {dept.avgAttendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4">{dept.lateArrivals}</td>
                      <td className="py-3 px-4">{dept.absences}</td>
                      <td className="py-3 px-4">
                        <Badge variant={dept.avgAttendance >= 95 ? "default" : "secondary"}>
                          {dept.avgAttendance >= 95 ? "Excellent" : "Good"}
                        </Badge>
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
