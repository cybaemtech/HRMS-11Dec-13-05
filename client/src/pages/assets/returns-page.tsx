import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Plus, CheckCircle, Clock, AlertCircle, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function AssetReturnsPage() {
  const returnStats = [
    { title: "Pending Returns", value: "12", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Processed Today", value: "5", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "This Month", value: "28", icon: <FileCheck className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Overdue", value: "3", icon: <AlertCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600" },
  ];

  const pendingReturns = [
    { employee: "John Doe", asset: "MacBook Pro 14\"", assetId: "LAP-001", reason: "Resignation", dueDate: "Jan 30, 2024", status: "Pending" },
    { employee: "Jane Smith", asset: "iPhone 14 Pro", assetId: "PHN-012", reason: "Upgrade", dueDate: "Jan 28, 2024", status: "Overdue" },
    { employee: "Mike Johnson", asset: "Dell Monitor 27\"", assetId: "MON-008", reason: "Department Transfer", dueDate: "Feb 5, 2024", status: "Pending" },
    { employee: "Sarah Wilson", asset: "Logitech Keyboard", assetId: "KEY-015", reason: "Replacement", dueDate: "Feb 1, 2024", status: "Pending" },
  ];

  const recentReturns = [
    { employee: "Tom Brown", asset: "ThinkPad X1", assetId: "LAP-022", returnDate: "Jan 25, 2024", condition: "Good" },
    { employee: "Lisa Chen", asset: "HP Monitor", assetId: "MON-045", returnDate: "Jan 24, 2024", condition: "Good" },
    { employee: "David Kim", asset: "Webcam Pro", assetId: "CAM-008", returnDate: "Jan 23, 2024", condition: "Damaged" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Overdue": return "bg-red-100 text-red-700";
      case "Completed": return "bg-green-100 text-green-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Asset Returns</h1>
            <p className="text-slate-500 mt-1">Process and track asset returns</p>
          </div>
          <Button className="gap-2" data-testid="button-new-return">
            <Plus className="h-4 w-4" />
            New Return Request
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {returnStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Pending Returns
              </CardTitle>
              <CardDescription>Assets awaiting return</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingReturns.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-slate-50"
                    data-testid={`row-pending-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{item.employee}</p>
                        <p className="text-sm text-slate-600">{item.asset} ({item.assetId})</p>
                        <p className="text-xs text-slate-500 mt-1">Reason: {item.reason} • Due: {item.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        <Button size="sm" data-testid={`button-process-${index}`}>Process</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recent Returns
              </CardTitle>
              <CardDescription>Recently processed returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReturns.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                    data-testid={`row-recent-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border">
                        <Package className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.asset}</p>
                        <p className="text-sm text-slate-500">{item.employee} • {item.returnDate}</p>
                      </div>
                    </div>
                    <Badge variant={item.condition === "Good" ? "default" : "destructive"}>
                      {item.condition}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
