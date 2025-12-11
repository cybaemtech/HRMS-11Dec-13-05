import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Download, Calendar, TrendingUp, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LeaveReportPage() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const leaveStats = [
    { title: "Total Leave Taken", value: "456", icon: <CalendarDays className="h-5 w-5" />, color: "bg-teal-50 text-teal-600" },
    { title: "Pending Requests", value: "12", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Avg. Leave/Employee", value: "8.5", icon: <Users className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Leave Balance", value: "1,245", icon: <TrendingUp className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
  ];

  const leaveTypeData = [
    { type: "Casual Leave", taken: 156, balance: 312, utilized: 33 },
    { type: "Sick Leave", taken: 89, balance: 267, utilized: 25 },
    { type: "Earned Leave", taken: 134, balance: 445, utilized: 23 },
    { type: "WFH", taken: 67, balance: 178, utilized: 27 },
    { type: "Maternity/Paternity", taken: 10, balance: 45, utilized: 18 },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Leave Reports</h1>
            <p className="text-slate-500 mt-1">Leave utilization analysis and trends</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32" data-testid="select-year">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveStats.map((stat, index) => (
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
              <CalendarDays className="h-5 w-5 text-teal-600" />
              Leave Type Summary
            </CardTitle>
            <CardDescription>Leave utilization by type for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Leave Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Taken</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Utilization</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypeData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-leave-${index}`}>
                      <td className="py-3 px-4 font-medium">{item.type}</td>
                      <td className="py-3 px-4">{item.taken} days</td>
                      <td className="py-3 px-4">{item.balance} days</td>
                      <td className="py-3 px-4">{item.utilized}%</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${item.utilized}%` }}
                          />
                        </div>
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
