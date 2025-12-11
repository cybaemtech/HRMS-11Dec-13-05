import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, FileArchive, Upload, Award, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function MyDocumentsPage() {
  const documentCategories = [
    { name: "Tax Documents", count: 4, icon: <FileText className="h-5 w-5" /> },
    { name: "HR Letters", count: 3, icon: <FileArchive className="h-5 w-5" /> },
    { name: "Certificates", count: 2, icon: <Award className="h-5 w-5" /> },
    { name: "Policies", count: 5, icon: <FileCheck className="h-5 w-5" /> },
  ];

  const documents = [
    { name: "Form 16 - FY 2022-23", category: "Tax Documents", uploadedDate: "Jun 15, 2023", size: "2.4 MB" },
    { name: "Appointment Letter", category: "HR Letters", uploadedDate: "Jan 10, 2022", size: "856 KB" },
    { name: "Salary Certificate", category: "HR Letters", uploadedDate: "Dec 5, 2023", size: "520 KB" },
    { name: "Form 16 - FY 2021-22", category: "Tax Documents", uploadedDate: "Jun 12, 2022", size: "2.1 MB" },
    { name: "AWS Certification", category: "Certificates", uploadedDate: "Mar 20, 2023", size: "1.2 MB" },
    { name: "Employee Handbook", category: "Policies", uploadedDate: "Jan 1, 2022", size: "4.5 MB" },
    { name: "Leave Policy", category: "Policies", uploadedDate: "Jan 1, 2024", size: "1.1 MB" },
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">My Documents</h1>
            <p className="text-slate-500 mt-1">Access and download your personal documents</p>
          </div>
          <Button variant="outline" className="gap-2" data-testid="button-upload">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documentCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover-elevate cursor-pointer" data-testid={`card-category-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
                      {category.icon}
                    </div>
                    <Badge variant="secondary">{category.count} files</Badge>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{category.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileArchive className="h-5 w-5 text-teal-600" />
              All Documents
            </CardTitle>
            <CardDescription>Your personal and company documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  data-testid={`row-document-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white border">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.category} • {doc.uploadedDate} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" data-testid={`button-view-${index}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" data-testid={`button-download-${index}`}>
                      <Download className="h-4 w-4" />
                    </Button>
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
