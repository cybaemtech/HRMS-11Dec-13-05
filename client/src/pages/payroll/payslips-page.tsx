import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Mail, Printer, CheckCircle, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PayslipsPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");
  const [searchQuery, setSearchQuery] = useState("");

  const payslipStats = [
    { title: "Total Payslips", value: "156", icon: <FileText className="h-5 w-5" /> },
    { title: "Generated", value: "142", icon: <CheckCircle className="h-5 w-5" /> },
    { title: "Pending", value: "14", icon: <Clock className="h-5 w-5" /> },
    { title: "Emailed", value: "128", icon: <Mail className="h-5 w-5" /> },
  ];

  const payslips = [
    { employee: "John Doe", empId: "EMP001", department: "Engineering", netPay: 85000, status: "Generated", emailed: true },
    { employee: "Jane Smith", empId: "EMP002", department: "Marketing", netPay: 72000, status: "Generated", emailed: true },
    { employee: "Mike Johnson", empId: "EMP003", department: "Sales", netPay: 68000, status: "Pending", emailed: false },
    { employee: "Sarah Wilson", empId: "EMP004", department: "HR", netPay: 75000, status: "Generated", emailed: false },
    { employee: "Tom Brown", empId: "EMP005", department: "Finance", netPay: 92000, status: "Generated", emailed: true },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Payslip Generation</h1>
            <p className="text-slate-500 mt-1">Generate and distribute monthly payslips</p>
          </div>
          <div className="flex gap-2">
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
            <Button variant="outline" className="gap-2" data-testid="button-email-all">
              <Mail className="h-4 w-4" />
              Email All
            </Button>
            <Button className="gap-2" data-testid="button-generate-all">
              <FileText className="h-4 w-4" />
              Generate All
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {payslipStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
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
                <CardTitle>Payslips - {selectedMonth}</CardTitle>
                <CardDescription>Monthly payslip generation and distribution status</CardDescription>
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Emp ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Net Pay</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Emailed</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-payslip-${index}`}>
                      <td className="py-3 px-4 font-medium">{payslip.employee}</td>
                      <td className="py-3 px-4 text-slate-600">{payslip.empId}</td>
                      <td className="py-3 px-4 text-slate-600">{payslip.department}</td>
                      <td className="py-3 px-4 font-medium">₹{payslip.netPay.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant={payslip.status === "Generated" ? "default" : "secondary"}>
                          {payslip.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {payslip.emailed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-slate-400" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" data-testid={`button-print-${index}`}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" data-testid={`button-email-${index}`}>
                            <Mail className="h-4 w-4" />
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
