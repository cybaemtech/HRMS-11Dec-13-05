import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Search, Mail, Printer, CheckCircle, Clock, Calendar, IndianRupee, Building2, CreditCard, Eye, Send, Filter, BanknoteIcon, ArrowRightLeft, Users, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export default function PayslipsPage() {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState("January 2024");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showBankTransferDialog, setShowBankTransferDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; title: string; message: string } | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [selectedTransfers, setSelectedTransfers] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [payslips, setPayslips] = useState([
    { id: 1, employee: "John Doe", empId: "EMP001", department: "Engineering", email: "john.doe@company.com", basicPay: 50000, hra: 20000, allowances: 15000, deductions: 8000, tax: 7000, pf: 6000, netPay: 85000, status: "Generated", emailed: true, bankName: "HDFC Bank", accountNo: "XXXX1234", ifsc: "HDFC0001234" },
    { id: 2, employee: "Jane Smith", empId: "EMP002", department: "Marketing", email: "jane.smith@company.com", basicPay: 45000, hra: 18000, allowances: 12000, deductions: 6000, tax: 5000, pf: 5400, netPay: 72000, status: "Generated", emailed: true, bankName: "ICICI Bank", accountNo: "XXXX5678", ifsc: "ICIC0005678" },
    { id: 3, employee: "Mike Johnson", empId: "EMP003", department: "Sales", email: "mike.johnson@company.com", basicPay: 42000, hra: 16800, allowances: 11000, deductions: 5000, tax: 4200, pf: 5040, netPay: 68000, status: "Pending", emailed: false, bankName: "SBI", accountNo: "XXXX9012", ifsc: "SBIN0009012" },
    { id: 4, employee: "Sarah Wilson", empId: "EMP004", department: "HR", email: "sarah.wilson@company.com", basicPay: 48000, hra: 19200, allowances: 13000, deductions: 7000, tax: 5760, pf: 5760, netPay: 75000, status: "Generated", emailed: false, bankName: "Axis Bank", accountNo: "XXXX3456", ifsc: "UTIB0003456" },
    { id: 5, employee: "Tom Brown", empId: "EMP005", department: "Finance", email: "tom.brown@company.com", basicPay: 55000, hra: 22000, allowances: 18000, deductions: 9000, tax: 8800, pf: 6600, netPay: 92000, status: "Generated", emailed: true, bankName: "Kotak Bank", accountNo: "XXXX7890", ifsc: "KKBK0007890" },
    { id: 6, employee: "Emily Davis", empId: "EMP006", department: "Engineering", email: "emily.davis@company.com", basicPay: 52000, hra: 20800, allowances: 14000, deductions: 7500, tax: 7280, pf: 6240, netPay: 88000, status: "Pending", emailed: false, bankName: "HDFC Bank", accountNo: "XXXX2345", ifsc: "HDFC0002345" },
  ]);

  const [bankTransfers, setBankTransfers] = useState([
    { id: 1, employee: "John Doe", empId: "EMP001", bankName: "HDFC Bank", accountNo: "XXXX1234", ifsc: "HDFC0001234", amount: 85000, status: "Completed", transferDate: "Jan 28, 2024", reference: "TXN001234" },
    { id: 2, employee: "Jane Smith", empId: "EMP002", bankName: "ICICI Bank", accountNo: "XXXX5678", ifsc: "ICIC0005678", amount: 72000, status: "Completed", transferDate: "Jan 28, 2024", reference: "TXN001235" },
    { id: 3, employee: "Sarah Wilson", empId: "EMP004", bankName: "Axis Bank", accountNo: "XXXX3456", ifsc: "UTIB0003456", amount: 75000, status: "Pending", transferDate: "", reference: "" },
    { id: 4, employee: "Tom Brown", empId: "EMP005", bankName: "Kotak Bank", accountNo: "XXXX7890", ifsc: "KKBK0007890", amount: 92000, status: "Completed", transferDate: "Jan 28, 2024", reference: "TXN001236" },
  ]);

  const payslipStats = [
    { title: "Total Payslips", value: payslips.length.toString(), icon: <FileText className="h-5 w-5" /> },
    { title: "Generated", value: payslips.filter(p => p.status === "Generated").length.toString(), icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { title: "Pending", value: payslips.filter(p => p.status === "Pending").length.toString(), icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { title: "Emailed", value: payslips.filter(p => p.emailed).length.toString(), icon: <Mail className="h-5 w-5" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  ];

  const transferStats = [
    { title: "Total Transfers", value: bankTransfers.length.toString(), icon: <ArrowRightLeft className="h-5 w-5" /> },
    { title: "Completed", value: bankTransfers.filter(t => t.status === "Completed").length.toString(), icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { title: "Pending", value: bankTransfers.filter(t => t.status === "Pending").length.toString(), icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { title: "Total Amount", value: `₹${(bankTransfers.filter(t => t.status === "Completed").reduce((sum, t) => sum + t.amount, 0) / 100000).toFixed(1)}L`, icon: <IndianRupee className="h-5 w-5" />, color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
  ];

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payslip.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payslip.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "generated" && payslip.status === "Generated") ||
                          (statusFilter === "pending" && payslip.status === "Pending") ||
                          (statusFilter === "emailed" && payslip.emailed) ||
                          (statusFilter === "not-emailed" && !payslip.emailed);
    return matchesSearch && matchesStatus;
  });

  const handleGeneratePayslip = (payslip: any) => {
    const updatedPayslips = payslips.map(p =>
      p.id === payslip.id ? { ...p, status: "Generated" } : p
    );
    setPayslips(updatedPayslips);
    toast({ title: "Success", description: `Payslip generated for ${payslip.employee}` });
  };

  const handleGenerateAll = () => {
    const pendingCount = payslips.filter(p => p.status === "Pending").length;
    if (pendingCount === 0) {
      toast({ title: "Info", description: "All payslips are already generated" });
      return;
    }
    setConfirmAction({
      type: "generateAll",
      title: "Generate All Payslips",
      message: `This will generate payslips for ${pendingCount} pending employee(s). Continue?`
    });
    setShowConfirmDialog(true);
  };

  const handleEmailPayslip = (payslip: any) => {
    if (payslip.status === "Pending") {
      toast({ title: "Error", description: "Please generate payslip first before emailing", variant: "destructive" });
      return;
    }
    setSelectedPayslip(payslip);
    setShowEmailDialog(true);
  };

  const confirmEmailPayslip = () => {
    if (!selectedPayslip) return;
    const updatedPayslips = payslips.map(p =>
      p.id === selectedPayslip.id ? { ...p, emailed: true } : p
    );
    setPayslips(updatedPayslips);
    setShowEmailDialog(false);
    toast({ title: "Success", description: `Payslip emailed to ${selectedPayslip.email}` });
  };

  const handleEmailAll = () => {
    const generatedNotEmailed = payslips.filter(p => p.status === "Generated" && !p.emailed).length;
    if (generatedNotEmailed === 0) {
      toast({ title: "Info", description: "All generated payslips have been emailed" });
      return;
    }
    setConfirmAction({
      type: "emailAll",
      title: "Email All Payslips",
      message: `This will email payslips to ${generatedNotEmailed} employee(s). Continue?`
    });
    setShowConfirmDialog(true);
  };

  const executeConfirmAction = () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      if (confirmAction.type === "generateAll") {
        const updatedPayslips = payslips.map(p =>
          p.status === "Pending" ? { ...p, status: "Generated" } : p
        );
        setPayslips(updatedPayslips);
        toast({ title: "Success", description: "All pending payslips have been generated" });
      } else if (confirmAction.type === "emailAll") {
        const updatedPayslips = payslips.map(p =>
          p.status === "Generated" && !p.emailed ? { ...p, emailed: true } : p
        );
        setPayslips(updatedPayslips);
        toast({ title: "Success", description: "All payslips have been emailed" });
      } else if (confirmAction.type === "processTransfers") {
        const updatedTransfers = bankTransfers.map(t =>
          selectedTransfers.includes(t.id) ? {
            ...t,
            status: "Completed",
            transferDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            reference: `TXN${Date.now().toString().slice(-6)}`
          } : t
        );
        setBankTransfers(updatedTransfers);
        setSelectedTransfers([]);
        toast({ title: "Success", description: `${selectedTransfers.length} bank transfer(s) processed successfully` });
      }
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }, 1000);
  };

  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
    setShowViewDialog(true);
  };

  const handleDownloadPayslip = (payslip: any) => {
    const doc = new jsPDF();
    
    doc.setFillColor(0, 128, 128);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("ASN HR Consultancy & Services", 105, 18, { align: "center" });
    doc.setFontSize(14);
    doc.text("Payslip", 105, 30, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth}`, 20, 55);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 55);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 65, 180, 30, "F");
    doc.setFontSize(11);
    doc.text(`Employee Name: ${payslip.employee}`, 20, 75);
    doc.text(`Employee ID: ${payslip.empId}`, 120, 75);
    doc.text(`Department: ${payslip.department}`, 20, 85);
    doc.text(`Email: ${payslip.email}`, 120, 85);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Earnings", 20, 110);
    doc.text("Deductions", 120, 110);
    doc.setFont("helvetica", "normal");
    
    doc.line(15, 115, 100, 115);
    doc.line(115, 115, 195, 115);
    
    doc.setFontSize(10);
    doc.text("Basic Pay:", 20, 125);
    doc.text(`₹${payslip.basicPay.toLocaleString()}`, 80, 125, { align: "right" });
    doc.text("HRA:", 20, 135);
    doc.text(`₹${payslip.hra.toLocaleString()}`, 80, 135, { align: "right" });
    doc.text("Other Allowances:", 20, 145);
    doc.text(`₹${payslip.allowances.toLocaleString()}`, 80, 145, { align: "right" });
    
    doc.text("Provident Fund:", 120, 125);
    doc.text(`₹${payslip.pf.toLocaleString()}`, 180, 125, { align: "right" });
    doc.text("Income Tax:", 120, 135);
    doc.text(`₹${payslip.tax.toLocaleString()}`, 180, 135, { align: "right" });
    doc.text("Other Deductions:", 120, 145);
    doc.text(`₹${payslip.deductions.toLocaleString()}`, 180, 145, { align: "right" });
    
    const totalEarnings = payslip.basicPay + payslip.hra + payslip.allowances;
    const totalDeductions = payslip.pf + payslip.tax + payslip.deductions;
    
    doc.line(15, 155, 100, 155);
    doc.line(115, 155, 195, 155);
    
    doc.setFont("helvetica", "bold");
    doc.text("Total Earnings:", 20, 165);
    doc.text(`₹${totalEarnings.toLocaleString()}`, 80, 165, { align: "right" });
    doc.text("Total Deductions:", 120, 165);
    doc.text(`₹${totalDeductions.toLocaleString()}`, 180, 165, { align: "right" });
    
    doc.setFillColor(0, 128, 128);
    doc.rect(15, 175, 180, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Net Pay:", 25, 185);
    doc.text(`₹${payslip.netPay.toLocaleString()}`, 180, 185, { align: "right" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Bank Details:", 20, 205);
    doc.text(`Bank: ${payslip.bankName}`, 20, 215);
    doc.text(`Account: ${payslip.accountNo}`, 80, 215);
    doc.text(`IFSC: ${payslip.ifsc}`, 140, 215);
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("This is a computer-generated document and does not require a signature.", 105, 280, { align: "center" });
    
    doc.save(`Payslip_${payslip.empId}_${selectedMonth.replace(" ", "_")}.pdf`);
    toast({ title: "Success", description: "Payslip downloaded successfully" });
  };

  const handlePrintPayslip = (payslip: any) => {
    handleDownloadPayslip(payslip);
    toast({ title: "Info", description: "Payslip downloaded for printing" });
  };

  const handleSelectTransfer = (id: number) => {
    if (selectedTransfers.includes(id)) {
      setSelectedTransfers(selectedTransfers.filter(t => t !== id));
    } else {
      setSelectedTransfers([...selectedTransfers, id]);
    }
  };

  const handleSelectAllPending = () => {
    const pendingIds = bankTransfers.filter(t => t.status === "Pending").map(t => t.id);
    if (pendingIds.every(id => selectedTransfers.includes(id))) {
      setSelectedTransfers(selectedTransfers.filter(id => !pendingIds.includes(id)));
    } else {
      setSelectedTransfers(Array.from(new Set([...selectedTransfers, ...pendingIds])));
    }
  };

  const handleProcessTransfers = () => {
    if (selectedTransfers.length === 0) {
      toast({ title: "Error", description: "Please select transfers to process", variant: "destructive" });
      return;
    }
    setConfirmAction({
      type: "processTransfers",
      title: "Process Bank Transfers",
      message: `This will process ${selectedTransfers.length} bank transfer(s). Continue?`
    });
    setShowConfirmDialog(true);
  };

  const handleViewTransfer = (transfer: any) => {
    setSelectedPayslip(transfer);
    setShowBankTransferDialog(true);
  };

  const handleExportTransfers = () => {
    const doc = new jsPDF();
    
    doc.setFillColor(0, 128, 128);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Bank Transfer Report", 105, 20, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth}`, 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 45);
    
    const completed = bankTransfers.filter(t => t.status === "Completed");
    const pending = bankTransfers.filter(t => t.status === "Pending");
    const totalAmount = completed.reduce((sum, t) => sum + t.amount, 0);
    
    doc.text(`Total Transfers: ${bankTransfers.length}`, 20, 60);
    doc.text(`Completed: ${completed.length}`, 80, 60);
    doc.text(`Pending: ${pending.length}`, 140, 60);
    doc.text(`Total Amount Transferred: ₹${totalAmount.toLocaleString()}`, 20, 70);
    
    let yPos = 90;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Employee", 20, yPos);
    doc.text("Bank", 70, yPos);
    doc.text("Amount", 120, yPos);
    doc.text("Status", 160, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPos += 10;
    
    bankTransfers.forEach((transfer) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(transfer.employee, 20, yPos);
      doc.text(transfer.bankName, 70, yPos);
      doc.text(`₹${transfer.amount.toLocaleString()}`, 120, yPos);
      doc.text(transfer.status, 160, yPos);
      yPos += 8;
    });
    
    doc.save(`Bank_Transfers_${selectedMonth.replace(" ", "_")}.pdf`);
    toast({ title: "Success", description: "Bank transfer report exported" });
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">Payslip Generation & Bank Transfers</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Generate payslips and process salary transfers</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40" data-testid="select-month">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January 2024">January 2024</SelectItem>
                <SelectItem value="December 2023">December 2023</SelectItem>
                <SelectItem value="November 2023">November 2023</SelectItem>
                <SelectItem value="October 2023">October 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <Tabs defaultValue="payslips" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="payslips" className="gap-2" data-testid="tab-payslips">
              <FileText className="h-4 w-4" />
              Payslips
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-2" data-testid="tab-transfers">
              <BanknoteIcon className="h-4 w-4" />
              Bank Transfers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payslips" className="space-y-6">
            <div className="flex gap-2 justify-end flex-wrap">
              <Button variant="outline" className="gap-2" onClick={handleEmailAll} data-testid="button-email-all">
                <Mail className="h-4 w-4" />
                Email All
              </Button>
              <Button className="gap-2" onClick={handleGenerateAll} data-testid="button-generate-all">
                <FileText className="h-4 w-4" />
                Generate All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {payslipStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card data-testid={`card-stat-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color || "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
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
                      <FileText className="h-5 w-5 text-teal-600" />
                      Payslips - {selectedMonth}
                    </CardTitle>
                    <CardDescription>Monthly payslip generation and distribution status</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search employee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        data-testid="input-search"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="generated">Generated</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="emailed">Emailed</SelectItem>
                        <SelectItem value="not-emailed">Not Emailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Emp ID</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Net Pay</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Emailed</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayslips.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-slate-500">No payslips found</td></tr>
                      ) : (
                        filteredPayslips.map((payslip, index) => (
                          <tr key={payslip.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" data-testid={`row-payslip-${index}`}>
                            <td className="py-3 px-4 font-medium">{payslip.employee}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payslip.empId}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payslip.department}</td>
                            <td className="py-3 px-4 font-medium flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {payslip.netPay.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={payslip.status === "Generated" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"}>
                                {payslip.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {payslip.emailed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-slate-400" />
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                {payslip.status === "Pending" ? (
                                  <Button size="sm" onClick={() => handleGeneratePayslip(payslip)} data-testid={`button-generate-${index}`}>
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Generate
                                  </Button>
                                ) : (
                                  <>
                                    <Button size="icon" variant="ghost" onClick={() => handleViewPayslip(payslip)} data-testid={`button-view-${index}`}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDownloadPayslip(payslip)} data-testid={`button-download-${index}`}>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handlePrintPayslip(payslip)} data-testid={`button-print-${index}`}>
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleEmailPayslip(payslip)} data-testid={`button-email-${index}`}>
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                  </>
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
          </TabsContent>

          <TabsContent value="transfers" className="space-y-6">
            <div className="flex gap-2 justify-end flex-wrap">
              <Button variant="outline" className="gap-2" onClick={handleExportTransfers} data-testid="button-export-transfers">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button className="gap-2" onClick={handleProcessTransfers} disabled={selectedTransfers.length === 0} data-testid="button-process-transfers">
                <Send className="h-4 w-4" />
                Process Selected ({selectedTransfers.length})
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {transferStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card data-testid={`card-transfer-stat-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color || "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
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
                      <BanknoteIcon className="h-5 w-5 text-teal-600" />
                      Bank Transfers - {selectedMonth}
                    </CardTitle>
                    <CardDescription>Salary bank transfers and processing status</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSelectAllPending} data-testid="button-select-all-pending">
                    <Users className="h-4 w-4 mr-2" />
                    Select All Pending
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Select</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Bank</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Account</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankTransfers.map((transfer, index) => (
                        <tr key={transfer.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" data-testid={`row-transfer-${index}`}>
                          <td className="py-3 px-4">
                            {transfer.status === "Pending" && (
                              <input
                                type="checkbox"
                                checked={selectedTransfers.includes(transfer.id)}
                                onChange={() => handleSelectTransfer(transfer.id)}
                                className="h-4 w-4 rounded border-slate-300"
                                data-testid={`checkbox-transfer-${index}`}
                              />
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{transfer.employee}</p>
                              <p className="text-sm text-slate-500">{transfer.empId}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              {transfer.bankName}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-mono text-sm">{transfer.accountNo}</p>
                              <p className="text-xs text-slate-500">{transfer.ifsc}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {transfer.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={transfer.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"}>
                              {transfer.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="icon" variant="ghost" onClick={() => handleViewTransfer(transfer)} data-testid={`button-view-transfer-${index}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Payslip Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip Details - {selectedMonth}</DialogTitle>
            <DialogDescription>Employee payslip breakdown</DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Employee Name</p>
                  <p className="font-medium">{selectedPayslip.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employee ID</p>
                  <p className="font-medium">{selectedPayslip.empId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-medium">{selectedPayslip.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{selectedPayslip.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Basic Pay</span>
                      <span className="font-medium">₹{selectedPayslip.basicPay?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">HRA</span>
                      <span className="font-medium">₹{selectedPayslip.hra?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Other Allowances</span>
                      <span className="font-medium">₹{selectedPayslip.allowances?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total Earnings</span>
                      <span className="text-green-600">₹{((selectedPayslip.basicPay || 0) + (selectedPayslip.hra || 0) + (selectedPayslip.allowances || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Provident Fund</span>
                      <span className="font-medium">₹{selectedPayslip.pf?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Income Tax</span>
                      <span className="font-medium">₹{selectedPayslip.tax?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Other Deductions</span>
                      <span className="font-medium">₹{selectedPayslip.deductions?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total Deductions</span>
                      <span className="text-red-600">₹{((selectedPayslip.pf || 0) + (selectedPayslip.tax || 0) + (selectedPayslip.deductions || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Net Pay</span>
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">₹{selectedPayslip.netPay?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Bank Details
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Bank Name</p>
                    <p className="font-medium">{selectedPayslip.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Account Number</p>
                    <p className="font-medium font-mono">{selectedPayslip.accountNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">IFSC Code</p>
                    <p className="font-medium font-mono">{selectedPayslip.ifsc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            <Button onClick={() => { handleDownloadPayslip(selectedPayslip); setShowViewDialog(false); }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Payslip Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Email Payslip</DialogTitle>
            <DialogDescription>Send payslip to employee via email</DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPayslip.employee}</p>
                    <p className="text-sm text-slate-500">{selectedPayslip.email}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The payslip for {selectedMonth} will be sent to the above email address as a PDF attachment.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
            <Button onClick={confirmEmailPayslip} data-testid="button-confirm-email">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bank Transfer Details Dialog */}
      <Dialog open={showBankTransferDialog} onOpenChange={setShowBankTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Transfer Details</DialogTitle>
            <DialogDescription>Transfer information and status</DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Employee</p>
                  <p className="font-medium">{selectedPayslip.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employee ID</p>
                  <p className="font-medium">{selectedPayslip.empId}</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{selectedPayslip.bankName}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Account Number</p>
                    <p className="font-mono">{selectedPayslip.accountNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">IFSC Code</p>
                    <p className="font-mono">{selectedPayslip.ifsc}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-medium text-lg flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {selectedPayslip.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className={selectedPayslip.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {selectedPayslip.status}
                  </Badge>
                </div>
              </div>
              {selectedPayslip.status === "Completed" && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500">Transfer Date</p>
                    <p className="font-medium">{selectedPayslip.transferDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Reference</p>
                    <p className="font-mono text-sm">{selectedPayslip.reference}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBankTransferDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>{confirmAction?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowConfirmDialog(false); setConfirmAction(null); }} disabled={isProcessing}>Cancel</Button>
            <Button onClick={executeConfirmAction} disabled={isProcessing} data-testid="button-confirm-action">
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
