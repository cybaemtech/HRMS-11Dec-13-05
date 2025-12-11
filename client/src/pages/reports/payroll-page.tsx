import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Download, Calendar, TrendingUp, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PayrollReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");

  const payrollStats = [
    { title: "Total Payroll", value: "₹45,60,000", icon: <IndianRupee className="h-5 w-5" />, color: "bg-teal-50 text-teal-600" },
    { title: "Net Disbursed", value: "₹38,25,000", icon: <Wallet className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Total Deductions", value: "₹7,35,000", icon: <TrendingUp className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "Employees Paid", value: "156", icon: <Users className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const departmentPayroll = [
    { department: "Engineering", employees: 45, gross: 1850000, deductions: 296000, net: 1554000 },
    { department: "Sales", employees: 32, gross: 1120000, deductions: 179200, net: 940800 },
    { department: "Marketing", employees: 18, gross: 720000, deductions: 115200, net: 604800 },
    { department: "HR", employees: 12, gross: 480000, deductions: 76800, net: 403200 },
    { department: "Finance", employees: 15, gross: 600000, deductions: 96000, net: 504000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Payroll Reports</h1>
            <p className="text-slate-500 mt-1">Comprehensive payroll analysis and summaries</p>
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
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {payrollStats.map((stat, index) => (
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
              <IndianRupee className="h-5 w-5 text-teal-600" />
              Department-wise Payroll Summary
            </CardTitle>
            <CardDescription>Payroll breakdown by department for {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employees</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Gross Salary</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Deductions</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentPayroll.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-payroll-${index}`}>
                      <td className="py-3 px-4 font-medium">{dept.department}</td>
                      <td className="py-3 px-4">{dept.employees}</td>
                      <td className="py-3 px-4">{formatCurrency(dept.gross)}</td>
                      <td className="py-3 px-4 text-red-600">{formatCurrency(dept.deductions)}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(dept.net)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4">122</td>
                    <td className="py-3 px-4">{formatCurrency(departmentPayroll.reduce((sum, d) => sum + d.gross, 0))}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(departmentPayroll.reduce((sum, d) => sum + d.deductions, 0))}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(departmentPayroll.reduce((sum, d) => sum + d.net, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
