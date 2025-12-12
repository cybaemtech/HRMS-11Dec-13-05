import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, Plus, CheckCircle, Clock, XCircle, IndianRupee, Search, Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export default function TrainingRequestsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [formData, setFormData] = useState({
    employee: "",
    training: "",
    provider: "",
    cost: "",
    description: "",
    justification: ""
  });

  const [requests, setRequests] = useState([
    { id: 1, employee: "John Doe", training: "Advanced Python Programming", provider: "Coursera", cost: 15000, requestDate: "Jan 20, 2024", status: "Pending", description: "Complete Python mastery course", justification: "Required for AI project development" },
    { id: 2, employee: "Jane Smith", training: "Digital Marketing Masterclass", provider: "Udemy", cost: 8000, requestDate: "Jan 18, 2024", status: "Approved", description: "Comprehensive digital marketing course", justification: "To lead upcoming marketing campaigns" },
    { id: 3, employee: "Mike Johnson", training: "Sales Negotiation Workshop", provider: "In-house", cost: 0, requestDate: "Jan 15, 2024", status: "Approved", description: "Internal sales training", justification: "Q1 sales skill enhancement" },
    { id: 4, employee: "Sarah Wilson", training: "HR Analytics Certification", provider: "LinkedIn Learning", cost: 12000, requestDate: "Jan 10, 2024", status: "Rejected", description: "HR analytics and reporting", justification: "To improve HR decision making", rejectReason: "Budget constraints for Q1" },
    { id: 5, employee: "Tom Brown", training: "Financial Modeling", provider: "CFI", cost: 25000, requestDate: "Jan 22, 2024", status: "Pending", description: "Advanced financial modeling course", justification: "Required for financial analysis role" },
  ]);

  const requestStats = [
    { title: "Total Requests", value: requests.length.toString(), icon: <BookOpen className="h-5 w-5" /> },
    { title: "Approved", value: requests.filter(r => r.status === "Approved").length.toString(), icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { title: "Pending", value: requests.filter(r => r.status === "Pending").length.toString(), icon: <Clock className="h-5 w-5" />, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { title: "Rejected", value: requests.filter(r => r.status === "Rejected").length.toString(), icon: <XCircle className="h-5 w-5" />, color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.training.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Rejected": return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const handleAddRequest = () => {
    if (!formData.employee || !formData.training || !formData.provider) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const newRequest = {
      id: requests.length + 1,
      employee: formData.employee,
      training: formData.training,
      provider: formData.provider,
      cost: parseInt(formData.cost) || 0,
      requestDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending",
      description: formData.description,
      justification: formData.justification
    };
    setRequests([...requests, newRequest]);
    setShowAddDialog(false);
    resetForm();
    toast({ title: "Success", description: "Training request submitted successfully" });
  };

  const handleApprove = (request: any) => {
    const updatedRequests = requests.map(r =>
      r.id === request.id ? { ...r, status: "Approved" } : r
    );
    setRequests(updatedRequests);
    toast({ title: "Success", description: `Training request for ${request.employee} approved` });
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    if (!rejectReason.trim()) {
      toast({ title: "Error", description: "Please provide a rejection reason", variant: "destructive" });
      return;
    }
    const updatedRequests = requests.map(r =>
      r.id === selectedRequest.id ? { ...r, status: "Rejected", rejectReason } : r
    );
    setRequests(updatedRequests);
    setShowRejectDialog(false);
    setRejectReason("");
    setSelectedRequest(null);
    toast({ title: "Success", description: `Training request rejected` });
  };

  const handleEditRequest = () => {
    if (!selectedRequest) return;
    const updatedRequests = requests.map(r =>
      r.id === selectedRequest.id ? {
        ...r,
        employee: formData.employee,
        training: formData.training,
        provider: formData.provider,
        cost: parseInt(formData.cost) || 0,
        description: formData.description,
        justification: formData.justification
      } : r
    );
    setRequests(updatedRequests);
    setShowEditDialog(false);
    resetForm();
    toast({ title: "Success", description: "Training request updated successfully" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Training Requests Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    const totalCost = filteredRequests.reduce((sum, r) => sum + r.cost, 0);
    doc.text(`Total Requests: ${filteredRequests.length}`, 20, 40);
    doc.text(`Total Cost: Rs. ${totalCost.toLocaleString()}`, 20, 48);

    let yPos = 65;
    filteredRequests.forEach((request, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${request.training}`, 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.text(`   Employee: ${request.employee} | Provider: ${request.provider}`, 20, yPos);
      yPos += 6;
      doc.text(`   Cost: Rs. ${request.cost.toLocaleString()} | Status: ${request.status} | Date: ${request.requestDate}`, 20, yPos);
      yPos += 10;
    });

    doc.save("training-requests-report.pdf");
    toast({ title: "Success", description: "Report exported successfully" });
  };

  const resetForm = () => {
    setFormData({ employee: "", training: "", provider: "", cost: "", description: "", justification: "" });
  };

  const openEditDialog = (request: any) => {
    setSelectedRequest(request);
    setFormData({
      employee: request.employee,
      training: request.training,
      provider: request.provider,
      cost: request.cost.toString(),
      description: request.description || "",
      justification: request.justification || ""
    });
    setShowEditDialog(true);
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">Training Requests</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage employee training requests and approvals</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="gap-2" onClick={handleExportPDF} data-testid="button-export">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="gap-2" data-testid="button-new-request" onClick={() => { resetForm(); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
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
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  Training Requests
                </CardTitle>
                <CardDescription>All training requests and their approval status</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
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
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Training</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Provider</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Request Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-500">No training requests found</td></tr>
                  ) : (
                    filteredRequests.map((request, index) => (
                      <tr key={request.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" data-testid={`row-request-${index}`}>
                        <td className="py-3 px-4 font-medium">{request.employee}</td>
                        <td className="py-3 px-4">{request.training}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{request.provider}</td>
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
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{request.requestDate}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            <Button size="icon" variant="ghost" data-testid={`button-view-${index}`} onClick={() => { setSelectedRequest(request); setShowViewDialog(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button size="sm" data-testid={`button-approve-${index}`} onClick={() => handleApprove(request)}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`button-reject-${index}`} onClick={() => { setSelectedRequest(request); setShowRejectDialog(true); }}>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === "Pending" && (
                              <Button size="icon" variant="ghost" data-testid={`button-edit-${index}`} onClick={() => openEditDialog(request)}>
                                <Edit className="h-4 w-4" />
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

      {/* Add Request Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Training Request</DialogTitle>
            <DialogDescription>Submit a new training request for approval</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee Name *</Label>
              <Input value={formData.employee} onChange={(e) => setFormData({...formData, employee: e.target.value})} placeholder="Employee name" data-testid="input-employee" />
            </div>
            <div>
              <Label>Training Program *</Label>
              <Input value={formData.training} onChange={(e) => setFormData({...formData, training: e.target.value})} placeholder="Training course/program name" data-testid="input-training" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider *</Label>
                <Input value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} placeholder="Training provider" data-testid="input-provider" />
              </div>
              <div>
                <Label>Cost (Rs.)</Label>
                <Input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} placeholder="0 for free" data-testid="input-cost" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief description of the training..." data-testid="input-description" />
            </div>
            <div>
              <Label>Business Justification</Label>
              <Textarea value={formData.justification} onChange={(e) => setFormData({...formData, justification: e.target.value})} placeholder="Why is this training needed?" data-testid="input-justification" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRequest} data-testid="button-submit-request">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.training}</DialogTitle>
            <DialogDescription>Training request details</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Employee</p>
                  <p className="font-medium">{selectedRequest.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Provider</p>
                  <p className="font-medium">{selectedRequest.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Cost</p>
                  <p className="font-medium flex items-center gap-1">
                    {selectedRequest.cost > 0 ? <><IndianRupee className="h-3 w-3" />{selectedRequest.cost.toLocaleString()}</> : "Free"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Request Date</p>
                <p className="font-medium">{selectedRequest.requestDate}</p>
              </div>
              {selectedRequest.description && (
                <div>
                  <p className="text-sm text-slate-500">Description</p>
                  <p className="font-medium">{selectedRequest.description}</p>
                </div>
              )}
              {selectedRequest.justification && (
                <div>
                  <p className="text-sm text-slate-500">Business Justification</p>
                  <p className="font-medium">{selectedRequest.justification}</p>
                </div>
              )}
              {selectedRequest.rejectReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Rejection Reason:</p>
                  <p className="text-red-700 dark:text-red-300">{selectedRequest.rejectReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Request Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Training Request</DialogTitle>
            <DialogDescription>Update the training request details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee Name *</Label>
              <Input value={formData.employee} onChange={(e) => setFormData({...formData, employee: e.target.value})} data-testid="input-edit-employee" />
            </div>
            <div>
              <Label>Training Program *</Label>
              <Input value={formData.training} onChange={(e) => setFormData({...formData, training: e.target.value})} data-testid="input-edit-training" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider *</Label>
                <Input value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} />
              </div>
              <div>
                <Label>Cost (Rs.)</Label>
                <Input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <Label>Business Justification</Label>
              <Textarea value={formData.justification} onChange={(e) => setFormData({...formData, justification: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditRequest} data-testid="button-update-request">Update Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Training Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting "{selectedRequest?.training}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Reason *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                data-testid="input-reject-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRejectDialog(false); setRejectReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} data-testid="button-confirm-reject">Reject Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
