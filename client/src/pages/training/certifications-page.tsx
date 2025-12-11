import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Plus, Search, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CertificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const certStats = [
    { title: "Total Certifications", value: "186", icon: <Award className="h-5 w-5" /> },
    { title: "Active", value: "142", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Expiring Soon", value: "28", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Expired", value: "16", icon: <AlertCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const certifications = [
    { employee: "John Doe", certification: "AWS Solutions Architect", issuer: "Amazon", issueDate: "Jan 2023", expiryDate: "Jan 2026", status: "Active" },
    { employee: "Jane Smith", certification: "Google Analytics", issuer: "Google", issueDate: "Mar 2023", expiryDate: "Mar 2024", status: "Expiring Soon" },
    { employee: "Mike Johnson", certification: "PMP", issuer: "PMI", issueDate: "Jun 2022", expiryDate: "Jun 2025", status: "Active" },
    { employee: "Sarah Wilson", certification: "SHRM-CP", issuer: "SHRM", issueDate: "Sep 2021", expiryDate: "Sep 2024", status: "Active" },
    { employee: "Tom Brown", certification: "CFA Level 1", issuer: "CFA Institute", issueDate: "Dec 2020", expiryDate: "Dec 2023", status: "Expired" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Expiring Soon": return "bg-yellow-100 text-yellow-700";
      case "Expired": return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Certifications</h1>
            <p className="text-slate-500 mt-1">Track employee certifications and renewals</p>
          </div>
          <Button className="gap-2" data-testid="button-add-cert">
            <Plus className="h-4 w-4" />
            Add Certification
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certStats.map((stat, index) => (
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
                  <Award className="h-5 w-5 text-teal-600" />
                  Employee Certifications
                </CardTitle>
                <CardDescription>All certifications and their validity status</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Certification</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Issuer</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Expiry Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certifications.map((cert, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-cert-${index}`}>
                      <td className="py-3 px-4 font-medium">{cert.employee}</td>
                      <td className="py-3 px-4">{cert.certification}</td>
                      <td className="py-3 px-4 text-slate-600">{cert.issuer}</td>
                      <td className="py-3 px-4 text-slate-600">{cert.issueDate}</td>
                      <td className="py-3 px-4 text-slate-600">{cert.expiryDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                          <Download className="h-4 w-4" />
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
