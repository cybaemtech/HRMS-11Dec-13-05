import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, CheckCircle, XCircle, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function MyAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");

  const attendanceStats = [
    { title: "Present Days", value: "22", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Absent Days", value: "1", icon: <XCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "Leave Days", value: "2", icon: <Calendar className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Avg Work Hours", value: "8.5h", icon: <Clock className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const attendance = [
    { date: "Jan 26, 2024", day: "Friday", checkIn: "9:00 AM", checkOut: "6:15 PM", hours: "9h 15m", status: "Present" },
    { date: "Jan 25, 2024", day: "Thursday", checkIn: "9:05 AM", checkOut: "6:30 PM", hours: "9h 25m", status: "Present" },
    { date: "Jan 24, 2024", day: "Wednesday", checkIn: "8:55 AM", checkOut: "6:00 PM", hours: "9h 5m", status: "Present" },
    { date: "Jan 23, 2024", day: "Tuesday", checkIn: "-", checkOut: "-", hours: "-", status: "Leave" },
    { date: "Jan 22, 2024", day: "Monday", checkIn: "9:10 AM", checkOut: "6:20 PM", hours: "9h 10m", status: "Present" },
    { date: "Jan 19, 2024", day: "Friday", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: "9h 0m", status: "Present" },
    { date: "Jan 18, 2024", day: "Thursday", checkIn: "-", checkOut: "-", hours: "-", status: "Absent" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-700";
      case "Absent": return "bg-red-100 text-red-700";
      case "Leave": return "bg-yellow-100 text-yellow-700";
      case "Holiday": return "bg-blue-100 text-blue-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">My Attendance</h1>
            <p className="text-slate-500 mt-1">View your attendance records</p>
          </div>
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {attendanceStats.map((stat, index) => (
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
              <Clock className="h-5 w-5 text-teal-600" />
              Attendance Log - {selectedMonth}
            </CardTitle>
            <CardDescription>Daily attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Day</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Check In</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Check Out</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-attendance-${index}`}>
                      <td className="py-3 px-4 font-medium">{record.date}</td>
                      <td className="py-3 px-4 text-slate-600">{record.day}</td>
                      <td className="py-3 px-4">
                        {record.checkIn !== "-" && (
                          <span className="flex items-center gap-1 text-green-600">
                            <LogIn className="h-4 w-4" />
                            {record.checkIn}
                          </span>
                        )}
                        {record.checkIn === "-" && "-"}
                      </td>
                      <td className="py-3 px-4">
                        {record.checkOut !== "-" && (
                          <span className="flex items-center gap-1 text-red-600">
                            <LogOut className="h-4 w-4" />
                            {record.checkOut}
                          </span>
                        )}
                        {record.checkOut === "-" && "-"}
                      </td>
                      <td className="py-3 px-4">{record.hours}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
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
