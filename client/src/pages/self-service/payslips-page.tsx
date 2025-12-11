import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Eye, IndianRupee, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function MyPayslipsPage() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const payslipStats = [
    { title: "Current Month", value: "₹85,000", icon: <IndianRupee className="h-5 w-5" /> },
    { title: "YTD Earnings", value: "₹1,70,000", icon: <TrendingUp className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Tax Deducted", value: "₹15,000", icon: <IndianRupee className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "Total Payslips", value: "12", icon: <FileText className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const payslips = [
    { month: "January 2024", grossPay: 100000, deductions: 15000, netPay: 85000, status: "Paid" },
    { month: "December 2023", grossPay: 100000, deductions: 15000, netPay: 85000, status: "Paid" },
    { month: "November 2023", grossPay: 100000, deductions: 15000, netPay: 85000, status: "Paid" },
    { month: "October 2023", grossPay: 100000, deductions: 15000, netPay: 85000, status: "Paid" },
    { month: "September 2023", grossPay: 100000, deductions: 15000, netPay: 85000, status: "Paid" },
    { month: "August 2023", grossPay: 95000, deductions: 14000, netPay: 81000, status: "Paid" },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">My Payslips</h1>
            <p className="text-slate-500 mt-1">View and download your monthly payslips</p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-28" data-testid="select-year">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
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
              <FileText className="h-5 w-5 text-teal-600" />
              Payslip History
            </CardTitle>
            <CardDescription>Your monthly payslips for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Month</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Gross Pay</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Deductions</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Net Pay</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-payslip-${index}`}>
                      <td className="py-3 px-4 font-medium">{payslip.month}</td>
                      <td className="py-3 px-4">₹{payslip.grossPay.toLocaleString()}</td>
                      <td className="py-3 px-4 text-red-600">-₹{payslip.deductions.toLocaleString()}</td>
                      <td className="py-3 px-4 font-medium text-green-600">₹{payslip.netPay.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{payslip.status}</Badge>
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
