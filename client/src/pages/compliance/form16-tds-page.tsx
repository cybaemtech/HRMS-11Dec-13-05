import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Calendar, IndianRupee, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Form16TdsPage() {
  const [selectedYear, setSelectedYear] = useState("2023-24");
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const tdsStats = [
    { title: "Total TDS Deducted", value: "₹45,67,000", status: "success", icon: <IndianRupee className="h-5 w-5" /> },
    { title: "Form 16 Generated", value: "142", status: "success", icon: <FileText className="h-5 w-5" /> },
    { title: "Pending Generation", value: "14", status: "warning", icon: <Clock className="h-5 w-5" /> },
    { title: "Filed with Dept", value: "128", status: "success", icon: <CheckCircle className="h-5 w-5" /> },
  ];

  const [employeeTds, setEmployeeTds] = useState([
    { id: 1, employee: "John Doe", pan: "ABCDE1234F", totalIncome: 1200000, tdsDeducted: 120000, form16: "Generated" },
    { id: 2, employee: "Jane Smith", pan: "FGHIJ5678K", totalIncome: 980000, tdsDeducted: 85000, form16: "Generated" },
    { id: 3, employee: "Mike Johnson", pan: "LMNOP9012Q", totalIncome: 1500000, tdsDeducted: 180000, form16: "Pending" },
    { id: 4, employee: "Sarah Wilson", pan: "RSTUV3456W", totalIncome: 850000, tdsDeducted: 65000, form16: "Generated" },
    { id: 5, employee: "Rahul Sharma", pan: "WXYZ7890A", totalIncome: 720000, tdsDeducted: 52000, form16: "Pending" },
    { id: 6, employee: "Priya Patel", pan: "BCDGH4567E", totalIncome: 1100000, tdsDeducted: 98000, form16: "Generated" },
    { id: 7, employee: "Amit Kumar", pan: "EFGIJ1234K", totalIncome: 680000, tdsDeducted: 45000, form16: "Pending" },
    { id: 8, employee: "Neha Gupta", pan: "HIJKL8901M", totalIncome: 1350000, tdsDeducted: 145000, form16: "Generated" },
    { id: 9, employee: "Raj Verma", pan: "KLMNO5678P", totalIncome: 920000, tdsDeducted: 78000, form16: "Pending" },
    { id: 10, employee: "Pooja Singh", pan: "NOPQR2345S", totalIncome: 1050000, tdsDeducted: 92000, form16: "Generated" },
  ]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employeeTds;
    const query = searchQuery.toLowerCase();
    return employeeTds.filter(
      emp => 
        emp.employee.toLowerCase().includes(query) || 
        emp.pan.toLowerCase().includes(query)
    );
  }, [employeeTds, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const generateForm16PDF = (employee: typeof employeeTds[0]) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    
    doc.setFillColor(0, 128, 128);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("FORM NO. 16", 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text("[See rule 31(1)(a)]", 105, 22, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Certificate under section 203 of the Income-tax Act, 1961", 105, 40, { align: 'center' });
    doc.text(`for Tax Deducted at Source on Salary - FY ${selectedYear}`, 105, 48, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 60);
    
    doc.setFontSize(12);
    doc.text("Part A - Details of Employer and Employee", 14, 75);
    doc.setDrawColor(0, 128, 128);
    doc.line(14, 78, 196, 78);
    
    autoTable(doc, {
      startY: 82,
      head: [],
      body: [
        ['Name of the Deductor (Employer)', 'HRMS Connect Pvt. Ltd.'],
        ['TAN of the Deductor', 'MUMH12345F'],
        ['Address of the Deductor', '123 Business Park, Mumbai, Maharashtra 400001'],
        ['Name of the Employee', employee.employee],
        ['PAN of the Employee', employee.pan],
        ['Assessment Year', selectedYear === '2023-24' ? '2024-25' : selectedYear === '2022-23' ? '2023-24' : '2022-23'],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 70 },
        1: { cellWidth: 100 },
      },
    });
    
    const partAEndY = (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 140;
    
    doc.setFontSize(12);
    doc.text("Part B - Details of Salary Paid and Tax Deducted", 14, partAEndY + 15);
    doc.line(14, partAEndY + 18, 196, partAEndY + 18);
    
    const basicSalary = Math.round(employee.totalIncome * 0.5);
    const hra = Math.round(employee.totalIncome * 0.2);
    const allowances = Math.round(employee.totalIncome * 0.2);
    const bonus = Math.round(employee.totalIncome * 0.1);
    
    autoTable(doc, {
      startY: partAEndY + 22,
      head: [['Particulars', 'Amount (Rs.)']],
      body: [
        ['1. Gross Salary', `₹${employee.totalIncome.toLocaleString()}`],
        ['   a) Basic Salary', `₹${basicSalary.toLocaleString()}`],
        ['   b) House Rent Allowance', `₹${hra.toLocaleString()}`],
        ['   c) Other Allowances', `₹${allowances.toLocaleString()}`],
        ['   d) Bonus/Incentive', `₹${bonus.toLocaleString()}`],
        ['2. Less: Standard Deduction u/s 16(ia)', '₹50,000'],
        ['3. Net Taxable Income', `₹${(employee.totalIncome - 50000).toLocaleString()}`],
        ['4. Tax Payable', `₹${employee.tdsDeducted.toLocaleString()}`],
        ['5. Less: Rebate u/s 87A', '₹0'],
        ['6. Tax Deducted at Source', `₹${employee.tdsDeducted.toLocaleString()}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 10 },
    });
    
    const partBEndY = (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 220;
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("This is a computer-generated certificate and does not require a signature.", 105, partBEndY + 20, { align: 'center' });
    
    doc.save(`Form16_${employee.employee.replace(/\s+/g, '_')}_${selectedYear}.pdf`);
  };

  const handleGenerateForm16 = async (index: number) => {
    setGeneratingIndex(index);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const employee = employeeTds.find((_, i) => i === index);
    if (employee) {
      generateForm16PDF(employee);
      setEmployeeTds(prev => prev.map((emp, i) => 
        i === index ? { ...emp, form16: "Generated" } : emp
      ));
      toast({
        title: "Form 16 Generated",
        description: `Form 16 for ${employee.employee} has been generated and downloaded.`,
      });
    }
    
    setGeneratingIndex(null);
  };

  const handleDownloadForm16 = (employee: typeof employeeTds[0]) => {
    generateForm16PDF(employee);
    toast({
      title: "Form 16 Downloaded",
      description: `Form 16 for ${employee.employee} has been downloaded.`,
    });
  };

  const handleGenerateAllForm16 = async () => {
    const pendingEmployees = employeeTds.filter(emp => emp.form16 === "Pending");
    
    if (pendingEmployees.length === 0) {
      toast({
        title: "No Pending Form 16",
        description: "All Form 16 have already been generated.",
      });
      return;
    }

    setGeneratingAll(true);
    
    for (const employee of pendingEmployees) {
      await new Promise(resolve => setTimeout(resolve, 500));
      generateForm16PDF(employee);
    }
    
    setEmployeeTds(prev => prev.map(emp => ({ ...emp, form16: "Generated" })));
    
    toast({
      title: "All Form 16 Generated",
      description: `${pendingEmployees.length} Form 16 certificates have been generated and downloaded.`,
    });
    
    setGeneratingAll(false);
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Form 16 & TDS Management</h1>
            <p className="text-slate-500 mt-1">Manage TDS deductions and Form 16 generation</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32" data-testid="select-year">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
                <SelectItem value="2021-22">2021-22</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="gap-2" 
              onClick={handleGenerateAllForm16}
              disabled={generatingAll}
              data-testid="button-generate-all"
            >
              {generatingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate All Form 16
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tdsStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-stat-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${stat.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Employee TDS Details</CardTitle>
                <CardDescription>TDS deductions and Form 16 status for FY {selectedYear}</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search employee or PAN..."
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600">PAN</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Total Income</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">TDS Deducted</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Form 16</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No employees found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((row, index) => (
                      <tr key={row.id} className="border-b hover:bg-slate-50" data-testid={`row-tds-${index}`}>
                        <td className="py-3 px-4 font-medium">{row.employee}</td>
                        <td className="py-3 px-4 font-mono text-sm">{row.pan}</td>
                        <td className="py-3 px-4">₹{row.totalIncome.toLocaleString()}</td>
                        <td className="py-3 px-4">₹{row.tdsDeducted.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(row.form16)}>{row.form16}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {row.form16 === "Generated" ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1" 
                                onClick={() => handleDownloadForm16(row)}
                                data-testid={`button-download-${index}`}
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                className="gap-1" 
                                onClick={() => handleGenerateForm16(employeeTds.findIndex(e => e.id === row.id))}
                                disabled={generatingIndex !== null}
                                data-testid={`button-generate-${index}`}
                              >
                                {generatingIndex === employeeTds.findIndex(e => e.id === row.id) ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-3 w-3" />
                                    Generate
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
