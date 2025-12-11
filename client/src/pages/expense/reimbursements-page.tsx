import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Download, IndianRupee, CheckCircle, Clock, Calendar, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ReimbursementsPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");

  const reimbursementStats = [
    { title: "Total Pending", value: "₹2,45,000", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Paid This Month", value: "₹8,75,000", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Total Employees", value: "45", icon: <Wallet className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Processing", value: "12", icon: <Building2 className="h-5 w-5" />, color: "bg-purple-50 text-purple-600" },
  ];

  const reimbursements = [
    { employee: "John Doe", category: "Travel", claimAmount: 25000, approvedAmount: 22500, status: "Pending", dueDate: "Jan 30, 2024" },
    { employee: "Jane Smith", category: "Equipment", claimAmount: 15000, approvedAmount: 15000, status: "Paid", paidDate: "Jan 25, 2024" },
    { employee: "Mike Johnson", category: "Meals", claimAmount: 8500, approvedAmount: 8000, status: "Processing", dueDate: "Feb 5, 2024" },
    { employee: "Sarah Wilson", category: "Training", claimAmount: 35000, approvedAmount: 35000, status: "Paid", paidDate: "Jan 20, 2024" },
    { employee: "Tom Brown", category: "Travel", claimAmount: 18500, approvedAmount: 17000, status: "Pending", dueDate: "Feb 10, 2024" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Reimbursements</h1>
            <p className="text-slate-500 mt-1">Track and process expense reimbursements</p>
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
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reimbursementStats.map((stat, index) => (
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
              <Wallet className="h-5 w-5 text-teal-600" />
              Reimbursement Status
            </CardTitle>
            <CardDescription>Track payment status for approved claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Claim Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Approved Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reimbursements.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-reimbursement-${index}`}>
                      <td className="py-3 px-4 font-medium">{item.employee}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td className="py-3 px-4">₹{item.claimAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-medium">₹{item.approvedAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.status === "Paid" ? item.paidDate : `Due: ${item.dueDate}`}
                      </td>
                      <td className="py-3 px-4">
                        {item.status === "Pending" && (
                          <Button size="sm" data-testid={`button-process-${index}`}>Process</Button>
                        )}
                        {item.status === "Processing" && (
                          <Button size="sm" data-testid={`button-complete-${index}`}>Mark Paid</Button>
                        )}
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
