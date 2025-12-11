import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileSignature, Plus, Search, Download, Eye, Send, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AppointmentLettersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const letterStats = [
    { title: "Total Generated", value: "186", icon: <FileSignature className="h-5 w-5" /> },
    { title: "This Month", value: "12", icon: <FileText className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Sent", value: "172", icon: <Send className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "14", icon: <FileText className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
  ];

  const letters = [
    { employee: "John Doe", position: "Senior Developer", department: "Engineering", joinDate: "Feb 1, 2024", generatedDate: "Jan 20, 2024", status: "Sent" },
    { employee: "Jane Smith", position: "Marketing Manager", department: "Marketing", joinDate: "Feb 5, 2024", generatedDate: "Jan 22, 2024", status: "Pending" },
    { employee: "Mike Johnson", position: "Sales Executive", department: "Sales", joinDate: "Feb 10, 2024", generatedDate: "Jan 25, 2024", status: "Sent" },
    { employee: "Sarah Wilson", position: "HR Executive", department: "HR", joinDate: "Jan 28, 2024", generatedDate: "Jan 15, 2024", status: "Sent" },
    { employee: "Tom Brown", position: "Finance Analyst", department: "Finance", joinDate: "Feb 15, 2024", generatedDate: "-", status: "Not Generated" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Not Generated": return "bg-slate-100 text-slate-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Appointment Letters</h1>
            <p className="text-slate-500 mt-1">Generate and manage employee appointment letters</p>
          </div>
          <Button className="gap-2" data-testid="button-generate-letter">
            <Plus className="h-4 w-4" />
            Generate Letter
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="h-5 w-5 text-teal-600" />
                  Appointment Letters
                </CardTitle>
                <CardDescription>All appointment letters and their status</CardDescription>
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Generated</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map((letter, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-letter-${index}`}>
                      <td className="py-3 px-4 font-medium">{letter.employee}</td>
                      <td className="py-3 px-4">{letter.position}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.department}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.joinDate}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.generatedDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {letter.status !== "Not Generated" ? (
                            <>
                              <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                                <Download className="h-4 w-4" />
                              </Button>
                              {letter.status === "Pending" && (
                                <Button size="icon" variant="ghost" data-testid={`button-send-${index}`}>
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button size="sm" data-testid={`button-generate-${index}`}>Generate</Button>
                          )}
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
