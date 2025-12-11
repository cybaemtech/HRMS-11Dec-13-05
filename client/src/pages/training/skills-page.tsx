import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Plus, Search, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SkillMatrixPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const skillCategories = [
    { name: "Technical Skills", count: 45, avgProficiency: 72 },
    { name: "Soft Skills", count: 28, avgProficiency: 68 },
    { name: "Leadership", count: 15, avgProficiency: 58 },
    { name: "Domain Expertise", count: 32, avgProficiency: 75 },
  ];

  const employeeSkills = [
    { employee: "John Doe", department: "Engineering", skills: [
      { name: "React", level: 4 },
      { name: "Node.js", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "AWS", level: 2 },
    ]},
    { employee: "Jane Smith", department: "Marketing", skills: [
      { name: "Digital Marketing", level: 5 },
      { name: "SEO", level: 4 },
      { name: "Analytics", level: 3 },
      { name: "Content Strategy", level: 4 },
    ]},
    { employee: "Mike Johnson", department: "Sales", skills: [
      { name: "Negotiation", level: 5 },
      { name: "CRM", level: 4 },
      { name: "Presentation", level: 4 },
      { name: "Lead Generation", level: 3 },
    ]},
  ];

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= level ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
          />
        ))}
      </div>
    );
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
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">Skill Matrix</h1>
            <p className="text-slate-500 mt-1">Track and manage employee skills and competencies</p>
          </div>
          <Button className="gap-2" data-testid="button-add-skill">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-category-${index}`}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{category.count} skills mapped</p>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Avg Proficiency</span>
                      <span className="font-medium">{category.avgProficiency}%</span>
                    </div>
                    <Progress value={category.avgProficiency} className="h-2" />
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
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  Employee Skills
                </CardTitle>
                <CardDescription>Skill proficiency by employee</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeSkills.map((employee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-50"
                  data-testid={`row-employee-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{employee.employee}</h3>
                      <p className="text-sm text-slate-500 mb-3">{employee.department}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {employee.skills.map((skill, i) => (
                          <div key={i} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {renderSkillLevel(skill.level)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-${index}`}>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      View Progress
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
