import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AssetTrackingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const assetCategories = [
    { name: "Laptops", total: 85, active: 78, maintenance: 5, disposed: 2 },
    { name: "Monitors", total: 120, active: 115, maintenance: 3, disposed: 2 },
    { name: "Phones", total: 45, active: 42, maintenance: 2, disposed: 1 },
    { name: "Accessories", total: 200, active: 185, maintenance: 8, disposed: 7 },
  ];

  const recentActivity = [
    { asset: "MacBook Pro M3", action: "Allocated", employee: "John Doe", date: "Jan 25, 2024", type: "allocation" },
    { asset: "iPhone 14", action: "Returned", employee: "Jane Smith", date: "Jan 24, 2024", type: "return" },
    { asset: "Dell Monitor", action: "Under Repair", employee: "-", date: "Jan 23, 2024", type: "maintenance" },
    { asset: "Logitech Mouse", action: "Disposed", employee: "-", date: "Jan 22, 2024", type: "disposal" },
    { asset: "ThinkPad X1", action: "Allocated", employee: "Mike Johnson", date: "Jan 21, 2024", type: "allocation" },
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case "allocation": return "bg-green-100 text-green-700";
      case "return": return "bg-blue-100 text-blue-700";
      case "maintenance": return "bg-yellow-100 text-yellow-700";
      case "disposal": return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Asset Tracking</h1>
            <p className="text-slate-500 mt-1">Monitor and track all company assets</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="monitors">Monitors</SelectItem>
                <SelectItem value="phones">Phones</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" data-testid="button-add-asset">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assetCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover-elevate cursor-pointer" data-testid={`card-category-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    <Badge variant="outline">{category.total} total</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                      <span>{category.active}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-3 w-3" /> Maintenance
                      </span>
                      <span>{category.maintenance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" /> Disposed
                      </span>
                      <span>{category.disposed}</span>
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
              <BarChart3 className="h-5 w-5 text-teal-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest asset movements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                  data-testid={`row-activity-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white border">
                      <Package className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{activity.asset}</p>
                      <p className="text-sm text-slate-500">
                        {activity.employee !== "-" ? `${activity.employee} • ` : ""}{activity.date}
                      </p>
                    </div>
                  </div>
                  <Badge className={getActionColor(activity.type)}>{activity.action}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
