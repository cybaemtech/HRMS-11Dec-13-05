import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Plus, Search, Download, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WarningLettersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const letterStats = [
    { title: "Total Issued", value: "24", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "This Year", value: "8", icon: <FileText className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "First Warning", value: "18", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-orange-50 text-orange-600" },
    { title: "Final Warning", value: "6", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const letters = [
    { employee: "John Smith", department: "Engineering", reason: "Repeated tardiness", type: "First Warning", issueDate: "Jan 15, 2024", status: "Issued" },
    { employee: "Mike Davis", department: "Sales", reason: "Policy violation", type: "First Warning", issueDate: "Jan 10, 2024", status: "Acknowledged" },
    { employee: "Sarah Brown", department: "Marketing", reason: "Unprofessional conduct", type: "Final Warning", issueDate: "Dec 20, 2023", status: "Acknowledged" },
    { employee: "Tom Wilson", department: "Operations", reason: "Attendance issues", type: "First Warning", issueDate: "Dec 15, 2023", status: "Issued" },
    { employee: "Lisa Chen", department: "Finance", reason: "Performance concerns", type: "First Warning", issueDate: "Nov 28, 2023", status: "Acknowledged" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "First Warning": return "bg-yellow-100 text-yellow-700";
      case "Final Warning": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Acknowledged": return "bg-green-100 text-green-700";
      case "Issued": return "bg-blue-100 text-blue-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Warning Letters</h1>
            <p className="text-slate-500 mt-1">Issue and manage disciplinary warning letters</p>
          </div>
          <Button className="gap-2" data-testid="button-issue-warning">
            <Plus className="h-4 w-4" />
            Issue Warning
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {letterStats.map((stat, index) => (
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Warning Letters
                </CardTitle>
                <CardDescription>All disciplinary warning letters issued</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map((letter, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-letter-${index}`}>
                      <td className="py-3 px-4 font-medium">{letter.employee}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.department}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.reason}</td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(letter.type)}>{letter.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{letter.issueDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                            <Download className="h-4 w-4" />
                          </Button>
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
