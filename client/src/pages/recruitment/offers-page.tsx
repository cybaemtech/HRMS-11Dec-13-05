import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileSignature, Plus, Search, Send, Eye, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function OfferLettersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const offerStats = [
    { title: "Total Offers", value: "24", icon: <FileSignature className="h-5 w-5" /> },
    { title: "Accepted", value: "18", icon: <CheckCircle className="h-5 w-5" />, color: "text-green-600 bg-green-50" },
    { title: "Pending", value: "4", icon: <Clock className="h-5 w-5" />, color: "text-yellow-600 bg-yellow-50" },
    { title: "Declined", value: "2", icon: <XCircle className="h-5 w-5" />, color: "text-red-600 bg-red-50" },
  ];

  const offers = [
    { candidate: "Rajesh Kumar", position: "Senior Developer", department: "Engineering", ctc: 1800000, sentDate: "Jan 15, 2024", status: "Accepted" },
    { candidate: "Priya Sharma", position: "Marketing Manager", department: "Marketing", ctc: 1200000, sentDate: "Jan 18, 2024", status: "Pending" },
    { candidate: "Amit Singh", position: "Sales Executive", department: "Sales", ctc: 800000, sentDate: "Jan 20, 2024", status: "Pending" },
    { candidate: "Sneha Patel", position: "HR Executive", department: "HR", ctc: 700000, sentDate: "Jan 22, 2024", status: "Accepted" },
    { candidate: "Vikram Malhotra", position: "Finance Analyst", department: "Finance", ctc: 1000000, sentDate: "Jan 10, 2024", status: "Declined" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Declined": return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Offer Letters</h1>
            <p className="text-slate-500 mt-1">Create and manage offer letters for candidates</p>
          </div>
          <Button className="gap-2" data-testid="button-create-offer">
            <Plus className="h-4 w-4" />
            Create Offer Letter
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offerStats.map((stat, index) => (
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
                <CardTitle>Offer Letters</CardTitle>
                <CardDescription>All offer letters and their status</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search candidate..."
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">CTC</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Sent Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-offer-${index}`}>
                      <td className="py-3 px-4 font-medium">{offer.candidate}</td>
                      <td className="py-3 px-4 text-slate-600">{offer.position}</td>
                      <td className="py-3 px-4 text-slate-600">{offer.department}</td>
                      <td className="py-3 px-4 font-medium">₹{(offer.ctc / 100000).toFixed(1)} LPA</td>
                      <td className="py-3 px-4 text-slate-600">{offer.sentDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(offer.status)}>{offer.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {offer.status === "Pending" && (
                            <Button size="icon" variant="ghost" data-testid={`button-resend-${index}`}>
                              <Send className="h-4 w-4" />
                            </Button>
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
