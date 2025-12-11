import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Plus, Search, Download, Eye, IndianRupee, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function IncrementLettersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const letterStats = [
    { title: "Total Increments", value: "45", icon: <TrendingUp className="h-5 w-5" /> },
    { title: "Avg Increment", value: "12.5%", icon: <Percent className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Total Value", value: "₹18.5L", icon: <IndianRupee className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "This Quarter", value: "28", icon: <TrendingUp className="h-5 w-5" />, color: "bg-purple-50 text-purple-600" },
  ];

  const letters = [
    { employee: "John Doe", department: "Engineering", currentSalary: 1500000, newSalary: 1725000, increment: 15, effectiveDate: "Apr 1, 2024", status: "Generated" },
    { employee: "Jane Smith", department: "Marketing", currentSalary: 1200000, newSalary: 1344000, increment: 12, effectiveDate: "Apr 1, 2024", status: "Generated" },
    { employee: "Mike Johnson", department: "Sales", currentSalary: 1000000, newSalary: 1120000, increment: 12, effectiveDate: "Apr 1, 2024", status: "Pending" },
    { employee: "Sarah Wilson", department: "HR", currentSalary: 900000, newSalary: 990000, increment: 10, effectiveDate: "Apr 1, 2024", status: "Generated" },
    { employee: "Tom Brown", department: "Finance", currentSalary: 1100000, newSalary: 1232000, increment: 12, effectiveDate: "Apr 1, 2024", status: "Pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Increment Letters</h1>
            <p className="text-slate-500 mt-1">Generate and manage salary increment letters</p>
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
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  Increment Letters
                </CardTitle>
                <CardDescription>All increment letters and their status</CardDescription>
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Current CTC</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">New CTC</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Increment</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Effective</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map((letter, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-letter-${index}`}>
                      <td className="py-3 px-4 font-medium">{letter.employee}</td>
                      <td className="py-3 px-4 text-slate-600">{letter.department}</td>
                      <td className="py-3 px-4">{formatSalary(letter.currentSalary)}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatSalary(letter.newSalary)}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {letter.increment}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{letter.effectiveDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {letter.status === "Generated" ? (
                            <>
                              <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                                <Download className="h-4 w-4" />
                              </Button>
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
