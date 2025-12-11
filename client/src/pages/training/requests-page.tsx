import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, CheckCircle, Clock, XCircle, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function TrainingRequestsPage() {
  const requestStats = [
    { title: "Total Requests", value: "45", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Approved", value: "28", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "12", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Rejected", value: "5", icon: <XCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const requests = [
    { employee: "John Doe", training: "Advanced Python Programming", provider: "Coursera", cost: 15000, requestDate: "Jan 20, 2024", status: "Pending" },
    { employee: "Jane Smith", training: "Digital Marketing Masterclass", provider: "Udemy", cost: 8000, requestDate: "Jan 18, 2024", status: "Approved" },
    { employee: "Mike Johnson", training: "Sales Negotiation Workshop", provider: "In-house", cost: 0, requestDate: "Jan 15, 2024", status: "Approved" },
    { employee: "Sarah Wilson", training: "HR Analytics Certification", provider: "LinkedIn Learning", cost: 12000, requestDate: "Jan 10, 2024", status: "Rejected" },
    { employee: "Tom Brown", training: "Financial Modeling", provider: "CFI", cost: 25000, requestDate: "Jan 22, 2024", status: "Pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Training Requests</h1>
            <p className="text-slate-500 mt-1">Manage employee training requests and approvals</p>
          </div>
          <Button className="gap-2" data-testid="button-new-request">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {requestStats.map((stat, index) => (
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
              <BookOpen className="h-5 w-5 text-teal-600" />
              Training Requests
            </CardTitle>
            <CardDescription>All training requests and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Training</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Provider</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Request Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-request-${index}`}>
                      <td className="py-3 px-4 font-medium">{request.employee}</td>
                      <td className="py-3 px-4">{request.training}</td>
                      <td className="py-3 px-4 text-slate-600">{request.provider}</td>
                      <td className="py-3 px-4">
                        {request.cost > 0 ? (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {request.cost.toLocaleString()}
                          </span>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{request.requestDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {request.status === "Pending" ? (
                          <div className="flex gap-2">
                            <Button size="sm" data-testid={`button-approve-${index}`}>Approve</Button>
                            <Button size="sm" variant="outline" data-testid={`button-reject-${index}`}>Reject</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" data-testid={`button-view-${index}`}>View</Button>
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
