import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, IndianRupee, CheckCircle, Clock, Eye, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function ExpenseClaimsPage() {
  const claimStats = [
    { title: "Total Claims", value: "₹4,85,000", icon: <IndianRupee className="h-5 w-5" /> },
    { title: "Approved", value: "₹3,45,000", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Pending", value: "₹1,40,000", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "This Month", value: "32", icon: <Receipt className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  ];

  const claims = [
    { employee: "John Doe", category: "Travel", description: "Client meeting travel", amount: 12500, date: "Jan 25, 2024", status: "Pending", receipts: 3 },
    { employee: "Jane Smith", category: "Meals", description: "Team lunch", amount: 4500, date: "Jan 24, 2024", status: "Approved", receipts: 1 },
    { employee: "Mike Johnson", category: "Equipment", description: "Laptop accessories", amount: 8000, date: "Jan 22, 2024", status: "Approved", receipts: 2 },
    { employee: "Sarah Wilson", category: "Training", description: "Conference registration", amount: 25000, date: "Jan 20, 2024", status: "Pending", receipts: 1 },
    { employee: "Tom Brown", category: "Travel", description: "Site visit expenses", amount: 18500, date: "Jan 18, 2024", status: "Rejected", receipts: 4 },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Expense Claims</h1>
            <p className="text-slate-500 mt-1">Submit and manage expense reimbursement claims</p>
          </div>
          <Button className="gap-2" data-testid="button-new-claim">
            <Plus className="h-4 w-4" />
            New Claim
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {claimStats.map((stat, index) => (
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
              <Receipt className="h-5 w-5 text-teal-600" />
              Expense Claims
            </CardTitle>
            <CardDescription>All expense claims and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Receipts</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-claim-${index}`}>
                      <td className="py-3 px-4 font-medium">{claim.employee}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{claim.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{claim.description}</td>
                      <td className="py-3 px-4 font-medium">₹{claim.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-600">{claim.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="gap-1">
                          <Upload className="h-3 w-3" />
                          {claim.receipts}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {claim.status === "Pending" && (
                            <>
                              <Button size="sm" data-testid={`button-approve-${index}`}>Approve</Button>
                              <Button size="sm" variant="outline" data-testid={`button-reject-${index}`}>Reject</Button>
                            </>
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
