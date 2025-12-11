import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, MapPin, Calendar, Clock, CheckCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function TravelRequestsPage() {
  const travelStats = [
    { title: "Total Requests", value: "28", icon: <Truck className="h-5 w-5" /> },
    { title: "Approved", value: "18", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "8", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "This Month", value: "12", icon: <Calendar className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const travelRequests = [
    { employee: "John Doe", destination: "Mumbai → Delhi", purpose: "Client Meeting", startDate: "Feb 5, 2024", endDate: "Feb 7, 2024", status: "Approved" },
    { employee: "Jane Smith", destination: "Bangalore → Chennai", purpose: "Training Workshop", startDate: "Feb 10, 2024", endDate: "Feb 12, 2024", status: "Pending" },
    { employee: "Mike Johnson", destination: "Pune → Hyderabad", purpose: "Sales Conference", startDate: "Feb 15, 2024", endDate: "Feb 18, 2024", status: "Approved" },
    { employee: "Sarah Wilson", destination: "Delhi → Kolkata", purpose: "HR Summit", startDate: "Feb 20, 2024", endDate: "Feb 22, 2024", status: "Pending" },
    { employee: "Tom Brown", destination: "Mumbai → Goa", purpose: "Team Offsite", startDate: "Feb 25, 2024", endDate: "Feb 28, 2024", status: "Pending" },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Travel Requests</h1>
            <p className="text-slate-500 mt-1">Manage business travel requests and approvals</p>
          </div>
          <Button className="gap-2" data-testid="button-new-request">
            <Plus className="h-4 w-4" />
            New Travel Request
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {travelStats.map((stat, index) => (
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
              <Truck className="h-5 w-5 text-teal-600" />
              Travel Requests
            </CardTitle>
            <CardDescription>All travel requests and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {travelRequests.map((request, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  data-testid={`row-request-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{request.employee}</h3>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {request.startDate} - {request.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Purpose: {request.purpose}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1" data-testid={`button-view-${index}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {request.status === "Pending" && (
                        <>
                          <Button size="sm" data-testid={`button-approve-${index}`}>Approve</Button>
                          <Button size="sm" variant="outline" data-testid={`button-reject-${index}`}>Reject</Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
