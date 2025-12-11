import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Download, CheckCircle, Clock, AlertTriangle, FileBarChart, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ComplianceReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2023-24");

  const complianceStats = [
    { title: "Compliant", value: "18", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "3", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Overdue", value: "1", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "Total Filings", value: "22", icon: <FileBarChart className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const complianceItems = [
    { name: "PF Monthly Return", frequency: "Monthly", lastFiled: "Jan 15, 2024", nextDue: "Feb 15, 2024", status: "Compliant" },
    { name: "ESI Monthly Return", frequency: "Monthly", lastFiled: "Jan 12, 2024", nextDue: "Feb 11, 2024", status: "Compliant" },
    { name: "Professional Tax", frequency: "Monthly", lastFiled: "Jan 5, 2024", nextDue: "Feb 5, 2024", status: "Pending" },
    { name: "TDS Quarterly Return", frequency: "Quarterly", lastFiled: "Oct 15, 2023", nextDue: "Jan 15, 2024", status: "Overdue" },
    { name: "Form 16 Issuance", frequency: "Annual", lastFiled: "Jun 10, 2023", nextDue: "Jun 15, 2024", status: "Compliant" },
    { name: "Labour Welfare Fund", frequency: "Bi-Annual", lastFiled: "Dec 31, 2023", nextDue: "Jun 30, 2024", status: "Compliant" },
    { name: "Gratuity Return", frequency: "Annual", lastFiled: "Dec 15, 2023", nextDue: "Dec 15, 2024", status: "Compliant" },
    { name: "Annual Returns", frequency: "Annual", lastFiled: "Jan 31, 2023", nextDue: "Jan 31, 2024", status: "Pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Overdue": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant": return <CheckCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Overdue": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Compliance Reports</h1>
            <p className="text-slate-500 mt-1">Track statutory compliance status</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28" data-testid="select-year">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
                <SelectItem value="2021-22">2021-22</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceStats.map((stat, index) => (
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
              <Scale className="h-5 w-5 text-teal-600" />
              Compliance Status - FY {selectedYear}
            </CardTitle>
            <CardDescription>All statutory filings and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Compliance Item</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Frequency</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Last Filed</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Next Due</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceItems.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-compliance-${index}`}>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{item.frequency}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.lastFiled}</td>
                      <td className="py-3 px-4 text-slate-600">{item.nextDue}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(item.status)} gap-1`}>
                          {getStatusIcon(item.status)}
                          {item.status}
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
