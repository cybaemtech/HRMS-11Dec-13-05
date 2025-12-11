import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Box, Plus, Search, Laptop, Smartphone, Monitor, Keyboard, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AssetAllocationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const assetStats = [
    { title: "Total Assets", value: "245", icon: <Box className="h-5 w-5" /> },
    { title: "Allocated", value: "198", icon: <Users className="h-5 w-5" />, color: "bg-green-50 text-green-600" },
    { title: "Available", value: "35", icon: <Box className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
    { title: "Under Repair", value: "12", icon: <Box className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600" },
  ];

  const assets = [
    { assetId: "LAP-001", type: "Laptop", name: "MacBook Pro 14\"", allocatedTo: "John Doe", department: "Engineering", allocatedDate: "Jan 15, 2023", status: "Active" },
    { assetId: "MON-012", type: "Monitor", name: "Dell 27\" 4K", allocatedTo: "Jane Smith", department: "Marketing", allocatedDate: "Feb 20, 2023", status: "Active" },
    { assetId: "PHN-005", type: "Phone", name: "iPhone 14 Pro", allocatedTo: "Mike Johnson", department: "Sales", allocatedDate: "Mar 10, 2023", status: "Active" },
    { assetId: "KEY-020", type: "Keyboard", name: "Logitech MX Keys", allocatedTo: "Sarah Wilson", department: "HR", allocatedDate: "Apr 5, 2023", status: "Active" },
    { assetId: "LAP-015", type: "Laptop", name: "ThinkPad X1 Carbon", allocatedTo: "-", department: "-", allocatedDate: "-", status: "Available" },
  ];

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Laptop": return <Laptop className="h-5 w-5" />;
      case "Monitor": return <Monitor className="h-5 w-5" />;
      case "Phone": return <Smartphone className="h-5 w-5" />;
      case "Keyboard": return <Keyboard className="h-5 w-5" />;
      default: return <Box className="h-5 w-5" />;
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Asset Allocation</h1>
            <p className="text-slate-500 mt-1">Manage asset allocation to employees</p>
          </div>
          <Button className="gap-2" data-testid="button-allocate-asset">
            <Plus className="h-4 w-4" />
            Allocate Asset
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assetStats.map((stat, index) => (
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
                  <Box className="h-5 w-5 text-teal-600" />
                  Asset Allocations
                </CardTitle>
                <CardDescription>All assets and their allocation status</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets..."
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Asset ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Allocated To</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-asset-${index}`}>
                      <td className="py-3 px-4 font-mono text-sm">{asset.assetId}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2">
                          {getAssetIcon(asset.type)}
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{asset.name}</td>
                      <td className="py-3 px-4">{asset.allocatedTo}</td>
                      <td className="py-3 px-4 text-slate-600">{asset.department}</td>
                      <td className="py-3 px-4 text-slate-600">{asset.allocatedDate}</td>
                      <td className="py-3 px-4">
                        <Badge variant={asset.status === "Active" ? "default" : "secondary"}>
                          {asset.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {asset.status === "Available" ? (
                          <Button size="sm" data-testid={`button-allocate-${index}`}>Allocate</Button>
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
