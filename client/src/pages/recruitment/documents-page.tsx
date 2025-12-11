import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileArchive, Upload, Search, Eye, Download, CheckCircle, Clock, AlertCircle, FileText, Image } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RecruitmentDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const requiredDocs = [
    { name: "Aadhar Card", description: "Government ID proof", mandatory: true },
    { name: "PAN Card", description: "Tax identification", mandatory: true },
    { name: "Passport Photo", description: "Recent photograph", mandatory: true },
    { name: "Educational Certificates", description: "Highest qualification", mandatory: true },
    { name: "Previous Employment Letter", description: "Experience certificate", mandatory: false },
    { name: "Bank Details", description: "Salary account", mandatory: true },
    { name: "Address Proof", description: "Current residence", mandatory: true },
    { name: "Medical Certificate", description: "Fitness certificate", mandatory: false },
  ];

  const pendingDocuments = [
    { candidate: "Rajesh Kumar", document: "PAN Card", submittedDate: "-", status: "Pending" },
    { candidate: "Rajesh Kumar", document: "Medical Certificate", submittedDate: "-", status: "Pending" },
    { candidate: "Priya Sharma", document: "Previous Employment Letter", submittedDate: "-", status: "Pending" },
    { candidate: "Priya Sharma", document: "Address Proof", submittedDate: "-", status: "Pending" },
    { candidate: "Amit Singh", document: "All Documents", submittedDate: "-", status: "Not Started" },
  ];

  const submittedDocuments = [
    { candidate: "Sneha Patel", document: "Aadhar Card", submittedDate: "Jan 25, 2024", status: "Verified" },
    { candidate: "Sneha Patel", document: "PAN Card", submittedDate: "Jan 25, 2024", status: "Verified" },
    { candidate: "Rajesh Kumar", document: "Aadhar Card", submittedDate: "Jan 26, 2024", status: "Under Review" },
    { candidate: "Rajesh Kumar", document: "Passport Photo", submittedDate: "Jan 26, 2024", status: "Verified" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-700";
      case "Under Review": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Not Started": return "bg-slate-100 text-slate-700";
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Document Portal</h1>
            <p className="text-slate-500 mt-1">Manage joining documents for new employees</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileArchive className="h-5 w-5 text-teal-600" />
                Required Documents
              </CardTitle>
              <CardDescription>Checklist for new joinees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requiredDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                    data-testid={`row-required-doc-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.description}</p>
                      </div>
                    </div>
                    {doc.mandatory && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending" data-testid="tab-pending">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending ({pendingDocuments.length})
                  </TabsTrigger>
                  <TabsTrigger value="submitted" data-testid="tab-submitted">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submitted ({submittedDocuments.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                  <div className="space-y-3">
                    {pendingDocuments.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                        data-testid={`row-pending-${index}`}
                      >
                        <div>
                          <p className="font-medium">{doc.candidate}</p>
                          <p className="text-sm text-slate-500">{doc.document}</p>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="submitted" className="mt-4">
                  <div className="space-y-3">
                    {submittedDocuments.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                        data-testid={`row-submitted-${index}`}
                      >
                        <div>
                          <p className="font-medium">{doc.candidate}</p>
                          <p className="text-sm text-slate-500">{doc.document} • {doc.submittedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
