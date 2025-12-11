import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Settings, Save, IndianRupee, Percent, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SalaryStructurePage() {
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(20);
  const [daPercent, setDaPercent] = useState(10);

  const salaryComponents = [
    { name: "Basic Salary", type: "Earning", percentage: basicPercent, taxable: true },
    { name: "House Rent Allowance", type: "Earning", percentage: hraPercent, taxable: false },
    { name: "Dearness Allowance", type: "Earning", percentage: daPercent, taxable: true },
    { name: "Special Allowance", type: "Earning", percentage: 30 - (hraPercent + daPercent - 30), taxable: true },
    { name: "PF Contribution (Employee)", type: "Deduction", percentage: 12, taxable: false },
    { name: "ESI Contribution", type: "Deduction", percentage: 0.75, taxable: false },
    { name: "Professional Tax", type: "Deduction", percentage: 0, fixed: 200, taxable: false },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Salary Structure (CTC Breakup)</h1>
            <p className="text-slate-500 mt-1">Configure salary components and their percentages</p>
          </div>
          <Button className="gap-2" data-testid="button-save-structure">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal-600" />
                Salary Components
              </CardTitle>
              <CardDescription>Configure the percentage breakdown of CTC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Basic Salary</label>
                    <Badge variant="secondary">{basicPercent}%</Badge>
                  </div>
                  <Slider
                    value={[basicPercent]}
                    onValueChange={([v]) => setBasicPercent(v)}
                    max={60}
                    min={30}
                    step={1}
                    data-testid="slider-basic"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">HRA</label>
                    <Badge variant="secondary">{hraPercent}%</Badge>
                  </div>
                  <Slider
                    value={[hraPercent]}
                    onValueChange={([v]) => setHraPercent(v)}
                    max={50}
                    min={10}
                    step={1}
                    data-testid="slider-hra"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Dearness Allowance</label>
                    <Badge variant="secondary">{daPercent}%</Badge>
                  </div>
                  <Slider
                    value={[daPercent]}
                    onValueChange={([v]) => setDaPercent(v)}
                    max={20}
                    min={0}
                    step={1}
                    data-testid="slider-da"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-teal-600" />
                Sample Calculation
              </CardTitle>
              <CardDescription>For CTC of ₹10,00,000</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Basic</span>
                  <span className="font-medium">₹{((1000000 * basicPercent) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>HRA</span>
                  <span className="font-medium">₹{((1000000 * hraPercent) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>DA</span>
                  <span className="font-medium">₹{((1000000 * daPercent) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Special Allowance</span>
                  <span className="font-medium">₹{((1000000 * (100 - basicPercent - hraPercent - daPercent)) / 100).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span>PF (12%)</span>
                    <span className="font-medium text-red-600">-₹{((1000000 * basicPercent * 0.12) / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Salary Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Component</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Percentage/Fixed</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Taxable</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.map((comp, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50" data-testid={`row-component-${index}`}>
                      <td className="py-3 px-4 font-medium">{comp.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant={comp.type === "Earning" ? "default" : "destructive"}>
                          {comp.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {comp.fixed ? `₹${comp.fixed}` : `${comp.percentage}%`}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={comp.taxable ? "secondary" : "outline"}>
                          {comp.taxable ? "Yes" : "No"}
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
