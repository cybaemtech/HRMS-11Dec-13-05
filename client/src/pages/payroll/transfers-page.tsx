import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Download, Upload, CheckCircle, Clock, AlertCircle, IndianRupee, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function BankTransfersPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024");

  const transferStats = [
    { title: "Total Amount", value: "₹1,25,45,000", icon: <IndianRupee className="h-5 w-5" /> },
    { title: "Completed", value: "142", icon: <CheckCircle className="h-5 w-5" /> },
    { title: "Pending", value: "8", icon: <Clock className="h-5 w-5" /> },
    { title: "Failed", value: "2", icon: <AlertCircle className="h-5 w-5" /> },
  ];

  const transfers = [
    { employee: "John Doe", bank: "HDFC Bank", account: "****4521", amount: 85000, status: "Completed", date: "Jan 28, 2024" },
    { employee: "Jane Smith", bank: "ICICI Bank", account: "****7832", amount: 72000, status: "Completed", date: "Jan 28, 2024" },
    { employee: "Mike Johnson", bank: "SBI", account: "****2145", amount: 68000, status: "Pending", date: "-" },
    { employee: "Sarah Wilson", bank: "Axis Bank", account: "****9876", amount: 75000, status: "Failed", date: "-" },
    { employee: "Tom Brown", bank: "HDFC Bank", account: "****3654", amount: 92000, status: "Completed", date: "Jan 28, 2024" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Failed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Failed": return <AlertCircle className="h-4 w-4" />;
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Bank Transfers</h1>
            <p className="text-slate-500 mt-1">RTGS/NEFT bank transfer management</p>
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
            <Button variant="outline" className="gap-2" data-testid="button-download-file">
              <Download className="h-4 w-4" />
              Bank File
            </Button>
            <Button className="gap-2" data-testid="button-initiate-transfer">
              <Upload className="h-4 w-4" />
              Initiate Transfer
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {transferStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      stat.title === "Failed" ? "bg-red-50 text-red-600" : 
                      stat.title === "Pending" ? "bg-yellow-50 text-yellow-600" : 
                      "bg-teal-50 text-teal-600"
                    }`}>
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
              <Building2 className="h-5 w-5 text-teal-600" />
              Transfer Details - {selectedMonth}
            </CardTitle>
            <CardDescription>Bank transfer status for all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Bank</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Account</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-transfer-${index}`}>
                      <td className="py-3 px-4 font-medium">{transfer.employee}</td>
                      <td className="py-3 px-4 text-slate-600">{transfer.bank}</td>
                      <td className="py-3 px-4 font-mono">{transfer.account}</td>
                      <td className="py-3 px-4 font-medium">₹{transfer.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(transfer.status)} gap-1`}>
                          {getStatusIcon(transfer.status)}
                          {transfer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{transfer.date}</td>
                      <td className="py-3 px-4">
                        {transfer.status === "Failed" && (
                          <Button size="sm" variant="outline" data-testid={`button-retry-${index}`}>Retry</Button>
                        )}
                        {transfer.status === "Completed" && (
                          <Button size="sm" variant="ghost" data-testid={`button-receipt-${index}`}>
                            <FileText className="h-4 w-4" />
                          </Button>
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
