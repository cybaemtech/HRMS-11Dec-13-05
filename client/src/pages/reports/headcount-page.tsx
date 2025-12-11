import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Download, TrendingUp, TrendingDown, Building2, UserPlus, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HeadcountReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4 2023");

  const headcountStats = [
    { title: "Total Headcount", value: "156", change: "+12", icon: <Users className="h-5 w-5" /> },
    { title: "New Hires", value: "18", icon: <UserPlus className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Separations", value: "6", icon: <UserMinus className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
    { title: "Growth Rate", value: "8.3%", icon: <TrendingUp className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const departmentData = [
    { department: "Engineering", headcount: 45, newHires: 8, separations: 2, growth: 15.4 },
    { department: "Marketing", headcount: 22, newHires: 3, separations: 1, growth: 10.0 },
    { department: "Sales", headcount: 35, newHires: 4, separations: 2, growth: 6.1 },
    { department: "HR", headcount: 12, newHires: 1, separations: 0, growth: 9.1 },
    { department: "Finance", headcount: 18, newHires: 1, separations: 1, growth: 0.0 },
    { department: "Operations", headcount: 24, newHires: 1, separations: 0, growth: 4.3 },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Headcount Report</h1>
            <p className="text-slate-500 mt-1">Employee headcount analysis by department</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32" data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q4 2023">Q4 2023</SelectItem>
                <SelectItem value="Q3 2023">Q3 2023</SelectItem>
                <SelectItem value="Q2 2023">Q2 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {headcountStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${stat.color || "bg-teal-50 text-teal-600"}`}>
                      {stat.icon}
                    </div>
                    {stat.change && (
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-600" />
              Department Headcount - {selectedPeriod}
            </CardTitle>
            <CardDescription>Headcount breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Headcount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">New Hires</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Separations</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-dept-${index}`}>
                      <td className="py-3 px-4 font-medium">{dept.department}</td>
                      <td className="py-3 px-4">{dept.headcount}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-green-600">
                          <UserPlus className="h-4 w-4" />
                          {dept.newHires}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-red-600">
                          <UserMinus className="h-4 w-4" />
                          {dept.separations}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={dept.growth > 0 ? "default" : "secondary"} className="gap-1">
                          {dept.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {dept.growth}%
                        </Badge>
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
