import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, getMonth, getYear, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { 
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  CalendarX,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Banknote,
  Receipt,
  CreditCard,
  Download,
  CalendarClock,
  CalendarDays,
  Timer,
  Hourglass,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { User, Department, LeaveRequest, Attendance, PaymentRecord, LeaveBalance } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || "0");
  
  // State for attendance month selection
  const [selectedAttendanceMonth, setSelectedAttendanceMonth] = useState(format(new Date(), 'yyyy-MM'));
  
  // Fetch employee data
  const { data: employee, isLoading: isLoadingEmployee } = useQuery<User>({
    queryKey: [`/api/employees/${employeeId}`],
    enabled: !!employeeId,
  });

  // Fetch departments data
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  // Fetch employee's leave requests (server-side filtered for security)
  const { data: leaveRequests = [] } = useQuery<LeaveRequest[]>({
    queryKey: [`/api/leave-requests?userId=${employeeId}`],
    enabled: !!employeeId,
  });

  // Fetch employee's attendance records for selected month (server-side filtered)
  const { data: attendanceRecords = [] } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance', employeeId, selectedAttendanceMonth],
    queryFn: async () => {
      const response = await fetch(`/api/attendance?userId=${employeeId}&month=${selectedAttendanceMonth}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }
      const data = await response.json();
      // Sort by date descending (most recent first)
      return data.sort((a: Attendance, b: Attendance) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    },
    enabled: !!employeeId,
  });

  // Fetch all available months for the dropdown (server-side filtered by user)
  const { data: allUserAttendance = [] } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance', employeeId],
    queryFn: async () => {
      const response = await fetch(`/api/attendance?userId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }
      return response.json();
    },
    enabled: !!employeeId,
  });

  // Calculate monthly attendance statistics
  const getMonthlyAttendanceStats = (records: Attendance[]) => {
    let totalWorkingHours = 0;
    let totalWorkingDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let lateDays = 0;

    records.forEach(record => {
      // Calculate working hours
      if (record.checkInTime && record.checkOutTime) {
        const hours = (new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60 * 60);
        totalWorkingHours += hours;
      }

      // Count attendance status
      totalWorkingDays++;
      switch (record.status) {
        case 'present':
          presentDays++;
          break;
        case 'absent':
          absentDays++;
          break;
        case 'halfday':
          halfDays++;
          break;
        case 'late':
          lateDays++;
          break;
      }
    });

    return {
      totalWorkingHours,
      formattedWorkingHours: totalWorkingHours.toFixed(1),
      totalWorkingDays,
      presentDays,
      absentDays,
      halfDays,
      lateDays
    };
  };

  // Get available months from attendance data
  const getAvailableMonths = () => {
    const months = new Set<string>();
    allUserAttendance.forEach(record => {
      if (record.date) {
        const monthKey = format(new Date(record.date), 'yyyy-MM');
        months.add(monthKey);
      }
    });
    // Add current month if not present
    months.add(format(new Date(), 'yyyy-MM'));
    return Array.from(months).sort().reverse(); // Most recent first
  };

  const availableMonths = getAvailableMonths();
  const monthlyStats = getMonthlyAttendanceStats(attendanceRecords);

  // Fetch employee's payment records (server-side filtered for security)
  const { data: paymentRecords = [] } = useQuery<PaymentRecord[]>({
    queryKey: [`/api/payment-records`, employeeId],
    queryFn: async () => {
      const response = await fetch(`/api/payment-records?employeeId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment records');
      }
      const data = await response.json();
      // Sort by creation date descending (most recent first)
      return data.sort((a: PaymentRecord, b: PaymentRecord) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    },
    enabled: !!employeeId,
  });

  // Calculate salary breakdown using the new formula
  const getSalaryBreakdown = (monthlyCTC: number) => {
    const grossSalary = (monthlyCTC / 30) * 25; // Monthly CTC ÷ 30 × 25 payable days
    const basicSalary = grossSalary * 0.5; // 50% of Gross
    const hra = basicSalary * 0.5; // 50% of Basic
    const specialAllowance = grossSalary - basicSalary - hra; // Balance
    const epf = basicSalary * 0.12; // 12% of Basic
    const esic = grossSalary * 0.0075; // 0.75% of Gross
    const professionalTax = 200; // Fixed ₹200
    const totalDeductions = epf + esic + professionalTax;
    const netSalary = grossSalary - totalDeductions;
    
    return {
      monthlyCTC,
      grossSalary,
      basicSalary,
      hra,
      specialAllowance,
      epf,
      esic,
      professionalTax,
      totalDeductions,
      netSalary
    };
  };

  // Create consolidated monthly payment history
  const getMonthlyPaymentHistory = () => {
    // Normalize month format function - converts various formats to "MMMM yyyy"
    const normalizeMonth = (monthStr: string): string => {
      if (!monthStr || monthStr === 'Unknown') return 'Unknown';
      try {
        // Try to parse the date and format it consistently
        const date = new Date(monthStr);
        if (!isNaN(date.getTime())) {
          return format(date, 'MMMM yyyy');
        }
        // If it's already in "MMMM yyyy" format, return as is
        return monthStr;
      } catch {
        return monthStr;
      }
    };

    // Group payment records by normalized month
    const monthlyGroups: { [key: string]: PaymentRecord[] } = {};
    
    paymentRecords.forEach(payment => {
      const normalizedMonth = normalizeMonth(payment.month || 'Unknown');
      if (!monthlyGroups[normalizedMonth]) {
        monthlyGroups[normalizedMonth] = [];
      }
      monthlyGroups[normalizedMonth].push(payment);
    });

    // Convert to consolidated monthly records
    const monthlyPayments = Object.entries(monthlyGroups)
      .filter(([month]) => month !== 'Unknown') // Filter out unknown months
      .map(([month, records]) => {
        // Check if any payment in this month is paid
        const hasPaidPayment = records.some(record => record.paymentStatus === 'paid');
        const hasAnyPayment = records.length > 0;
        
        // Get the latest payment record for this month (for reference data)
        const latestRecord = records[0];
        
        // Calculate monthly totals
        const totalGrossAmount = records.reduce((sum, record) => {
          const breakdown = getSalaryBreakdown(record.amount);
          return sum + Math.round(breakdown.grossSalary);
        }, 0);
        
        const totalNetAmount = records.reduce((sum, record) => {
          const breakdown = getSalaryBreakdown(record.amount);
          return sum + Math.round(breakdown.netSalary);
        }, 0);

        // Determine overall payment status for the month
        let paymentStatus: string;
        if (hasPaidPayment) {
          paymentStatus = 'paid';
        } else if (hasAnyPayment) {
          paymentStatus = 'pending';
        } else {
          paymentStatus = 'not_generated';
        }

        // Get payment date (use the first paid record's date if any, otherwise the latest record's date)
        const paidRecord = records.find(r => r.paymentStatus === 'paid');
        const paymentDate = paidRecord?.paymentDate || latestRecord?.paymentDate;

        return {
          month,
          paymentStatus,
          grossAmount: Math.round(totalGrossAmount / records.length), // Average for display
          netAmount: Math.round(totalNetAmount / records.length), // Average for display
          paymentDate,
          paymentMode: paidRecord?.paymentMode || latestRecord?.paymentMode,
          referenceNo: paidRecord?.referenceNo || latestRecord?.referenceNo,
          records, // Keep original records for detailed payslip generation
          latestRecord // For payslip generation
        };
      });

    // Generate complete timeline from earliest payment record to current month
    const currentDate = new Date();
    const allMonths = [];
    
    if (monthlyPayments.length === 0) {
      // If no payment records, just show current year up to current month
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      for (let i = 0; i <= currentMonth; i++) {
        const monthDate = new Date(currentYear, i, 1);
        const monthKey = format(monthDate, 'MMMM yyyy');
        allMonths.push({
          month: monthKey,
          paymentStatus: 'not_generated',
          grossAmount: Math.round(getSalaryBreakdown(employee?.salary || 0).grossSalary),
          netAmount: Math.round(getSalaryBreakdown(employee?.salary || 0).netSalary),
          paymentDate: null,
          paymentMode: null,
          referenceNo: null,
          records: [],
          latestRecord: null
        });
      }
    } else {
      // Find the earliest and latest months from payment records
      const paymentDates = monthlyPayments.map(mp => new Date(mp.month)).filter(date => !isNaN(date.getTime()));
      const earliestDate = paymentDates.length > 0 ? new Date(Math.min(...paymentDates.map(d => d.getTime()))) : new Date();
      const latestDate = new Date(Math.max(...paymentDates.map(d => d.getTime()), currentDate.getTime()));
      
      // Generate all months from earliest to latest/current
      let iterDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
      const endDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
      
      while (iterDate <= endDate) {
        const monthKey = format(iterDate, 'MMMM yyyy');
        
        // Check if we already have this month in payment records
        const existingMonth = monthlyPayments.find(mp => mp.month === monthKey);
        if (existingMonth) {
          allMonths.push(existingMonth);
        } else {
          // Add missing month with "Not Generated" status
          allMonths.push({
            month: monthKey,
            paymentStatus: 'not_generated',
            grossAmount: Math.round(getSalaryBreakdown(employee?.salary || 0).grossSalary),
            netAmount: Math.round(getSalaryBreakdown(employee?.salary || 0).netSalary),
            paymentDate: null,
            paymentMode: null,
            referenceNo: null,
            records: [],
            latestRecord: null
          });
        }
        
        // Move to next month
        iterDate = new Date(iterDate.getFullYear(), iterDate.getMonth() + 1, 1);
      }
    }

    // Sort by month (most recent first)
    return allMonths.sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const monthlyPaymentHistory = getMonthlyPaymentHistory();

  // Fetch employee's leave balance with segmented query key for proper cache invalidation
  const { data: leaveBalance, isLoading: isLoadingLeaveBalance, error: leaveBalanceError, refetch: refetchLeaveBalance } = useQuery<LeaveBalance>({
    queryKey: ['/api/employees/leave-balance', employeeId],
    queryFn: async () => {
      const response = await fetch(`/api/employees/${employeeId}/leave-balance`);
      if (!response.ok) {
        throw new Error('Failed to fetch leave balance');
      }
      return response.json();
    },
    enabled: !!employeeId,
    retry: (failureCount, error) => {
      // Don't retry on auth errors or not found
      if (error instanceof Error) {
        const status = (error as any).status;
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch organization settings for professional payslip
  const { data: orgSettings } = useQuery<{
    organizationName?: string;
    organizationAddress?: string;
    [key: string]: any;
  }>({
    queryKey: ["/api/settings/system"],
  });

  if (isLoadingEmployee) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!employee) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Not Found</h2>
            <p className="text-gray-600 mb-4">The employee you're looking for doesn't exist or has been removed.</p>
            <Link href="/payroll">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payroll
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const department = departments.find(dept => dept.id === employee.departmentId);

  const salaryBreakdown = getSalaryBreakdown(employee.salary || 0);

  // Generate professional payslip PDF
  const generatePayslipPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const currentMonthYear = format(currentDate, 'MMMM yyyy');
    
    // Get the most recent payment record to determine the actual payroll month
    const latestPayment = paymentRecords[0];
    const payrollMonth = latestPayment?.month || currentMonthYear;
    
    // Professional currency formatter
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Generate unique payslip ID
    const payslipId = `PS${employee.id?.toString().padStart(4, '0')}${format(currentDate, 'yyMM')}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    // Professional header with organization data
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(orgSettings?.organizationName || "Organization Name", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(orgSettings?.organizationAddress || "Organization Address", 105, 28, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SALARY SLIP", 105, 40, { align: "center" });
    
    // Header box
    doc.rect(15, 15, 180, 30);
    
    // Payslip details section
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Payslip ID: ${payslipId}`, 20, 55);
    doc.text(`Pay Period: ${payrollMonth}`, 20, 62);
    doc.text(`Generated on: ${format(currentDate, 'dd/MM/yyyy HH:mm')}`, 140, 55);
    doc.text(`Payment Status: ${latestPayment?.paymentStatus || 'Pending'}`, 140, 62);
    
    // Employee details section with professional styling
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYEE INFORMATION", 20, 80);
    doc.line(20, 83, 100, 83);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${employee.firstName} ${employee.lastName}`, 20, 95);
    doc.text(`Employee ID: ${employee.employeeId || employee.id}`, 20, 102);
    doc.text(`Position: ${employee.position || 'N/A'}`, 20, 109);
    doc.text(`Department: ${department?.name || 'N/A'}`, 20, 116);
    
    // Company details section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYER INFORMATION", 110, 80);
    doc.line(110, 83, 190, 83);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Join Date: ${employee.joinDate ? format(new Date(employee.joinDate), 'dd/MM/yyyy') : 'N/A'}`, 110, 95);
    doc.text(`PAN: ${(employee as any).panNumber || 'N/A'}`, 110, 102);
    doc.text(`UAN: ${(employee as any).uanNumber || 'N/A'}`, 110, 109);
    doc.text(`Working Days: 25`, 110, 116);
    
    // Salary breakdown table with professional styling
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SALARY BREAKDOWN", 20, 135);
    doc.line(20, 138, 190, 138);
    
    // Enhanced salary table with better formatting
    const salaryData = [
      ["EARNINGS", "AMOUNT", "DEDUCTIONS", "AMOUNT"],
      ["Basic Salary", formatCurrency(Math.round(salaryBreakdown.basicSalary)), "EPF (12%)", formatCurrency(Math.round(salaryBreakdown.epf))],
      ["House Rent Allowance", formatCurrency(Math.round(salaryBreakdown.hra)), "ESIC (0.75%)", formatCurrency(Math.round(salaryBreakdown.esic))],
      ["Special Allowance", formatCurrency(Math.round(salaryBreakdown.specialAllowance)), "Professional Tax", formatCurrency(salaryBreakdown.professionalTax)],
      ["", "", "", ""],
      ["GROSS SALARY", formatCurrency(Math.round(salaryBreakdown.grossSalary)), "TOTAL DEDUCTIONS", formatCurrency(Math.round(salaryBreakdown.totalDeductions))],
    ];
    
    autoTable(doc, {
      startY: 145,
      head: [salaryData[0]],
      body: salaryData.slice(1),
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left', cellWidth: 45 },
        1: { halign: 'right', cellWidth: 35 },
        2: { fontStyle: 'bold', halign: 'left', cellWidth: 45 },
        3: { halign: 'right', cellWidth: 35 }
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });
    
    // Net salary section with emphasis - use dynamic positioning from autoTable
    const tableEndY = (doc as any).lastAutoTable?.finalY ?? 160;
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginBottom = 20;
    
    // Ensure content stays within page bounds
    let finalY = tableEndY + 15;
    if (finalY + 60 > pageHeight - marginBottom) {
      doc.addPage();
      finalY = 30; // Reset to top of new page
    }
    doc.setFillColor(46, 125, 50);
    doc.rect(15, finalY - 5, 180, 20, 'F');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("NET SALARY (Take Home Amount)", 20, finalY + 5);
    doc.text(formatCurrency(Math.round(salaryBreakdown.netSalary)), 190, finalY + 5, { align: "right" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Professional footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("This is a computer-generated payslip and does not require physical signature.", 105, finalY + 30, { align: "center" });
    doc.text("For any payroll queries, please contact the HR department.", 105, finalY + 36, { align: "center" });
    doc.text(`Generated by ${orgSettings?.organizationName || "HR System"} Payroll System`, 105, finalY + 42, { align: "center" });
    
    // Page border
    doc.rect(10, 10, 190, 277);
    
    // Save the PDF with professional naming
    doc.save(`${orgSettings?.organizationName || 'Organization'}_Payslip_${employee.firstName}_${employee.lastName}_${payrollMonth.replace(' ', '_')}.pdf`);
  };

  // Calculate leave statistics
  const approvedLeaves = leaveRequests.filter(req => req.status === 'approved').length;
  const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
  const rejectedLeaves = leaveRequests.filter(req => req.status === 'rejected').length;
  const totalLeaveDays = leaveRequests
    .filter(req => req.status === 'approved')
    .reduce((total, req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return total + diffDays;
    }, 0);

  // Helper function to calculate leave days properly (handles halfday)
  const calculateLeaveDays = (leave: LeaveRequest) => {
    if (leave.type === 'halfday') {
      return 0.5;
    }
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Group leave requests by month-year with proper multi-month handling
  const groupLeavesByMonth = () => {
    const grouped: { [key: string]: Array<{ leave: LeaveRequest; daysInMonth: number }> } = {};
    
    // Sort leave requests by startDate first for consistent processing
    const sortedLeaves = [...leaveRequests].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    sortedLeaves.forEach(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const totalDays = calculateLeaveDays(leave);
      
      // Handle single day or single month leaves
      if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        const monthYear = format(startDate, 'MMMM yyyy');
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push({ leave, daysInMonth: totalDays });
      } else {
        // Handle multi-month leaves - distribute days across months
        let currentDate = new Date(startDate);
        let remainingDays = totalDays;
        
        while (currentDate <= endDate) {
          const monthYear = format(currentDate, 'MMMM yyyy');
          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          const monthEndDate = endDate < lastDayOfMonth ? endDate : lastDayOfMonth;
          
          const daysInThisMonth = Math.ceil((monthEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const allocatedDays = Math.min(daysInThisMonth, remainingDays);
          
          if (!grouped[monthYear]) {
            grouped[monthYear] = [];
          }
          grouped[monthYear].push({ leave, daysInMonth: allocatedDays });
          
          remainingDays -= allocatedDays;
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
      }
    });
    
    // Sort months chronologically (newest first)
    const sortedEntries = Object.entries(grouped).sort((a, b) => {
      const [monthYearA] = a;
      const [monthYearB] = b;
      const dateA = new Date(monthYearA);
      const dateB = new Date(monthYearB);
      return dateB.getTime() - dateA.getTime();
    });
    
    return sortedEntries;
  };

  const monthlyLeaveData = groupLeavesByMonth();

  // Calculate monthly statistics with proper day allocation and status breakdown
  const getMonthlyStats = (monthData: Array<{ leave: LeaveRequest; daysInMonth: number }>) => {
    let approvedDays = 0;
    let pendingDays = 0;
    let rejectedDays = 0;
    let totalRequests = monthData.length;

    const leaveTypeStats = {} as { [key: string]: { days: number; requests: number } };

    monthData.forEach(({ leave, daysInMonth }) => {
      // Accumulate days by status
      if (leave.status === 'approved') {
        approvedDays += daysInMonth;
      } else if (leave.status === 'pending') {
        pendingDays += daysInMonth;
      } else if (leave.status === 'rejected') {
        rejectedDays += daysInMonth;
      }

      // Accumulate by leave type
      if (!leaveTypeStats[leave.type]) {
        leaveTypeStats[leave.type] = { days: 0, requests: 0 };
      }
      leaveTypeStats[leave.type].days += daysInMonth;
      leaveTypeStats[leave.type].requests += 1;
    });

    const totalDays = approvedDays + pendingDays + rejectedDays;

    return {
      totalDays,
      approvedDays,
      pendingDays,
      rejectedDays,
      totalRequests,
      leaveTypeStats
    };
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Professional Executive Header */}
        <motion.div 
          className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Link href="/payroll">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Payroll
                      </Button>
                    </motion.div>
                  </Link>
                  <div>
                    <motion.h1 
                      className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      Employee Details
                    </motion.h1>
                    <motion.p 
                      className="text-blue-100 text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      Comprehensive view of employee information, payroll, and leave records
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Employee Profile Section */}
        <div className="px-6 pb-8">
          <motion.div 
            className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 rounded-xl p-8 border border-indigo-200/50 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-start space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="h-24 w-24 ring-4 ring-indigo-100 ring-offset-4">
                  <AvatarImage src={employee.photoUrl || undefined} alt={`${employee.firstName} ${employee.lastName}`} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-3xl font-bold text-slate-900">{employee.firstName} {employee.lastName}</h3>
                  <Badge 
                    variant={employee.isActive ? "default" : "secondary"}
                    className={employee.isActive 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1" 
                      : "bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1"
                    }
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xl text-indigo-600 font-semibold mb-6">{employee.position || 'Position not set'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div 
                    className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200/50"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(255 255 255 / 0.8)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-600">{employee.email}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200/50"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(255 255 255 / 0.8)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Phone</p>
                      <p className="text-sm text-slate-600">{employee.phoneNumber || 'Not provided'}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200/50"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(255 255 255 / 0.8)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Department</p>
                      <p className="text-sm text-slate-600">{department?.name || 'Not assigned'}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200/50"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(255 255 255 / 0.8)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Join Date</p>
                      <p className="text-sm text-slate-600">
                        {employee.joinDate ? format(new Date(employee.joinDate), 'MMM dd, yyyy') : 'Not set'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leave Balance Card Section */}
          <motion.div 
            className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 rounded-xl p-8 border border-emerald-200/50 shadow-lg backdrop-blur-sm mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Leave Balance</h3>
                <p className="text-emerald-600 font-medium">Current leave status and accruals</p>
              </div>
            </div>

            {isLoadingLeaveBalance ? (
              <div className="space-y-6">
                {/* Enhanced Loading Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/60 rounded-xl p-6 border border-slate-200/50 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
                <div className="bg-white/60 rounded-xl p-6 border border-slate-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-3 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-18" />
                  </div>
                </div>
              </div>
            ) : leaveBalanceError ? (
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Failed to Load Leave Balance</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {(() => {
                      const status = (leaveBalanceError as any)?.status;
                      if (status === 401) {
                        return "You are not authorized to view this information. Please log in again.";
                      }
                      if (status === 403) {
                        return "You don't have permission to view this employee's leave balance.";
                      }
                      if (status === 404) {
                        return "Employee leave balance data not found. This may indicate the employee hasn't been assigned any leave policies.";
                      }
                      return "Unable to load leave balance information. Please check your connection and try again.";
                    })()}
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => refetchLeaveBalance()}
                    className="flex items-center space-x-2"
                    data-testid="button-retry-leave-balance"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry</span>
                  </Button>
                </div>
              </div>
            ) : leaveBalance ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Remaining Balance - Prominent */}
                <motion.div
                  className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6 border border-emerald-200/50 shadow-lg backdrop-blur-sm col-span-1 md:col-span-2 lg:col-span-1"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  data-testid="card-leave-remaining"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">Remaining Leave</h4>
                    <div className="p-2 bg-emerald-200 rounded-lg">
                      <CalendarClock className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-700" data-testid="text-remaining-days">
                    {(leaveBalance?.remainingBalance ?? 0).toFixed(1)} days
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Available to use</p>
                </motion.div>

                {/* Used This Year */}
                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 border border-orange-200/50 shadow-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  data-testid="card-leave-used"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">Used This Year</h4>
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <CalendarX className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-700" data-testid="text-used-days">
                    {(leaveBalance?.takenThisYear ?? 0).toFixed(1)} days
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Out of {(leaveBalance?.totalTaken ?? 0).toFixed(1)} total</p>
                </motion.div>

                {/* Pending Requests */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200/50 shadow-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  data-testid="card-leave-pending"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">Pending Requests</h4>
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700" data-testid="text-pending-days">
                    {(leaveBalance?.pendingRequests ?? 0).toFixed(1)} days
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Awaiting approval</p>
                </motion.div>

                {/* Accrued This Year */}
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200/50 shadow-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  data-testid="card-leave-accrued"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">Accrued This Year</h4>
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-700" data-testid="text-accrued-days">
                    {(leaveBalance?.accruedThisYear ?? 0).toFixed(1)} days
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Out of {(leaveBalance?.totalAccrued ?? 0).toFixed(1)} total</p>
                </motion.div>
              </div>
            ) : (
              <div className="text-center p-8">
                <CalendarX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">No Leave Balance Data</h4>
                <p className="text-gray-600 mb-4">
                  This employee may not have any leave policies assigned or their leave balance hasn't been calculated yet.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => refetchLeaveBalance()}
                  className="flex items-center space-x-2"
                  data-testid="button-refresh-leave-balance"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            )}

            {/* Progress Bar and Additional Info */}
            {leaveBalance && (
              <motion.div
                className="mt-8 p-6 bg-white/60 rounded-xl border border-slate-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                data-testid="section-leave-progress"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">Leave Usage Progress</h4>
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-600">
                      Next accrual: {format(new Date(leaveBalance.nextAccrualDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative w-full bg-gray-200 rounded-full h-3 mb-4" data-testid="progress-bar-leave">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100)}%` 
                    }}
                  ></div>
                  <div 
                    className="absolute top-0 bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-r-full transition-all duration-300"
                    style={{ 
                      left: `${Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100)}%`,
                      width: `${Math.min((leaveBalance.pendingRequests / leaveBalance.totalAccrued) * 100, 100 - Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100))}%` 
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>
                    <span className="inline-block w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2"></span>
                    Used: {((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100).toFixed(1)}%
                  </span>
                  <span>
                    <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-2"></span>
                    Pending: {((leaveBalance.pendingRequests / leaveBalance.totalAccrued) * 100).toFixed(1)}%
                  </span>
                  <span>
                    <span className="inline-block w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mr-2"></span>
                    Available: {((leaveBalance.remainingBalance / leaveBalance.totalAccrued) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <p className="text-xs text-slate-500 text-center">
                    As of {format(new Date(leaveBalance.asOfDate), 'MMMM dd, yyyy')} • 
                    Leave accrues at 1.5 days per month • 
                    Balance calculated from join date
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Professional Tabs Section */}
        <div className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Tabs defaultValue="payroll" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-100 to-blue-50 p-1 rounded-xl border border-slate-200/50 shadow-sm">
                <TabsTrigger 
                  value="payroll" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg"
                >
                  Payroll Details
                </TabsTrigger>
                <TabsTrigger 
                  value="leave" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg"
                >
                  Leave Management
                </TabsTrigger>
                <TabsTrigger 
                  value="attendance" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg"
                >
                  Attendance Records
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg"
                >
                  Payment History
                </TabsTrigger>
              </TabsList>

              {/* Professional Payroll Tab */}
              <TabsContent value="payroll" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Monthly CTC</h4>
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₹{salaryBreakdown.monthlyCTC.toLocaleString()}</div>
                    <p className="text-xs text-slate-600 mt-1">Total cost to company</p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Gross Salary</h4>
                      <div className="p-2 bg-green-200 rounded-lg">
                        <Banknote className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()}</div>
                    <p className="text-xs text-slate-600 mt-1">For 25 payable days</p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Total Deductions</h4>
                      <div className="p-2 bg-orange-200 rounded-lg">
                        <Receipt className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₹{Math.round(salaryBreakdown.totalDeductions).toLocaleString()}</div>
                    <p className="text-xs text-slate-600 mt-1">EPF + ESIC + Prof. Tax</p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 border border-emerald-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Net Salary</h4>
                      <div className="p-2 bg-emerald-200 rounded-lg">
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">₹{Math.round(salaryBreakdown.netSalary).toLocaleString()}</div>
                    <p className="text-xs text-slate-600 mt-1">Take home amount</p>
                  </motion.div>
                </div>

                {/* Professional Detailed Salary Breakdown */}
                <motion.div 
                  className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-xl p-8 border border-indigo-200/50 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">💰 Salary Structure & Calculation</h3>
                    <p className="text-slate-600">Detailed breakdown of salary components as per company policy</p>
                  </div>
                <div className="space-y-6">
                  {/* Step 1: Gross Salary */}
                  <div>
                    <h4 className="font-semibold mb-2">Step 1: Gross Salary</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Monthly CTC (divided) = ₹{salaryBreakdown.monthlyCTC.toLocaleString()} ÷ 30 × 25 days = ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">👉 (Because salary is calculated for 25 payable days out of 30 days).</p>
                  </div>

                  {/* Step 2: Earnings Breakup */}
                  <div>
                    <h4 className="font-semibold mb-3">Step 2: Earnings Breakup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium">Basic Salary (50% of Gross):</p>
                        <p className="text-sm text-muted-foreground">= 50% × ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()} = ₹{Math.round(salaryBreakdown.basicSalary).toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="font-medium">HRA (50% of Basic):</p>
                        <p className="text-sm text-muted-foreground">= 50% × ₹{Math.round(salaryBreakdown.basicSalary).toLocaleString()} = ₹{Math.round(salaryBreakdown.hra).toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="font-medium">Special Allowance (Balance):</p>
                        <p className="text-sm text-muted-foreground">= ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()} – (₹{Math.round(salaryBreakdown.basicSalary).toLocaleString()} + ₹{Math.round(salaryBreakdown.hra).toLocaleString()}) = ₹{Math.round(salaryBreakdown.specialAllowance).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <p className="font-medium text-green-800">✅ Total Earnings = ₹{Math.round(salaryBreakdown.basicSalary).toLocaleString()} + ₹{Math.round(salaryBreakdown.hra).toLocaleString()} + ₹{Math.round(salaryBreakdown.specialAllowance).toLocaleString()} = ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Step 3: Deductions */}
                  <div>
                    <h4 className="font-semibold mb-3">Step 3: Deductions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="font-medium">EPF (12% of Basic):</p>
                        <p className="text-sm text-muted-foreground">= 12% × ₹{Math.round(salaryBreakdown.basicSalary).toLocaleString()} = ₹{Math.round(salaryBreakdown.epf).toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="font-medium">ESIC (0.75% of Gross Salary):</p>
                        <p className="text-sm text-muted-foreground">= 0.75% × ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()} = ₹{Math.round(salaryBreakdown.esic).toLocaleString()}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="font-medium">Professional Tax (Fixed):</p>
                        <p className="text-sm text-muted-foreground">= ₹{salaryBreakdown.professionalTax}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="font-medium text-red-800">✅ Total Deductions = ₹{Math.round(salaryBreakdown.epf).toLocaleString()} + ₹{Math.round(salaryBreakdown.esic).toLocaleString()} + ₹{salaryBreakdown.professionalTax} = ₹{Math.round(salaryBreakdown.totalDeductions).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Step 4: Net Salary */}
                  <div>
                    <h4 className="font-semibold mb-2">Step 4: Net Salary (Take Home)</h4>
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <p className="font-medium">= Gross Salary – Total Deductions</p>
                      <p className="text-sm text-muted-foreground">= ₹{Math.round(salaryBreakdown.grossSalary).toLocaleString()} – ₹{Math.round(salaryBreakdown.totalDeductions).toLocaleString()}</p>
                      <p className="text-xl font-bold text-green-600 mt-2">= ₹{Math.round(salaryBreakdown.netSalary).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Payslip Download Section */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">📄 Generate Payslip</h4>
                        <p className="text-sm text-slate-600">Download a professional payslip document with complete salary breakdown</p>
                      </div>
                      <motion.button
                        onClick={generatePayslipPDF}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                        data-testid="button-download-payslip"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Payslip
                      </motion.button>
                    </div>
                  </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Professional Leave Management Tab */}
              <TabsContent value="leave" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Total Leave Days</h4>
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <CalendarX className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{totalLeaveDays}</div>
                    <p className="text-xs text-slate-600 mt-1">This year</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6 border border-emerald-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Approved</h4>
                      <div className="p-2 bg-emerald-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{approvedLeaves}</div>
                    <p className="text-xs text-slate-600 mt-1">Leave requests</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Pending</h4>
                      <div className="p-2 bg-orange-200 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{pendingLeaves}</div>
                    <p className="text-xs text-slate-600 mt-1">Awaiting approval</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 border border-red-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Rejected</h4>
                      <div className="p-2 bg-red-200 rounded-lg">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{rejectedLeaves}</div>
                    <p className="text-xs text-slate-600 mt-1">Leave requests</p>
                  </motion.div>
                </div>

                {/* Detailed Leave Balance Breakdown */}
                {isLoadingLeaveBalance ? (
                  <motion.div
                    className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-xl p-8 border border-emerald-200/50 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                      <p className="text-slate-600 ml-3">Loading detailed leave balance...</p>
                    </div>
                  </motion.div>
                ) : leaveBalance ? (
                  <motion.div 
                    className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-xl p-8 border border-emerald-200/50 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    data-testid="section-detailed-leave-balance"
                  >
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                          <Hourglass className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">📊 Detailed Leave Balance</h3>
                          <p className="text-emerald-600 font-medium">Comprehensive leave accrual and usage breakdown</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left Column - Balance Overview */}
                      <div className="space-y-4">
                        <div className="bg-white/80 rounded-xl p-6 border border-slate-200/50">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <CalendarDays className="h-5 w-5 text-emerald-600 mr-2" />
                            Leave Balance Overview
                          </h4>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                              <span className="text-sm font-medium text-slate-700">Total Accrued</span>
                              <span className="text-lg font-bold text-emerald-700" data-testid="text-total-accrued">
                                {leaveBalance.totalAccrued.toFixed(1)} days
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                              <span className="text-sm font-medium text-slate-700">Total Used</span>
                              <span className="text-lg font-bold text-orange-700" data-testid="text-total-used">
                                {leaveBalance.totalTaken.toFixed(1)} days
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <span className="text-sm font-medium text-slate-700">Pending Requests</span>
                              <span className="text-lg font-bold text-blue-700" data-testid="text-pending-requests">
                                {leaveBalance.pendingRequests.toFixed(1)} days
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-200">
                              <span className="text-base font-semibold text-slate-800">Remaining Balance</span>
                              <span className="text-xl font-bold text-emerald-800" data-testid="text-remaining-balance">
                                {leaveBalance.remainingBalance.toFixed(1)} days
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-6 border border-slate-200/50">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Timer className="h-5 w-5 text-purple-600 mr-2" />
                            Accrual Information
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Accrual Rate</span>
                              <span className="text-sm font-medium text-slate-800">1.5 days/month</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Next Accrual Date</span>
                              <span className="text-sm font-medium text-slate-800" data-testid="text-next-accrual">
                                {format(new Date(leaveBalance.nextAccrualDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Calculation Date</span>
                              <span className="text-sm font-medium text-slate-800">
                                {format(new Date(leaveBalance.asOfDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Current Year Analysis */}
                      <div className="space-y-4">
                        <div className="bg-white/80 rounded-xl p-6 border border-slate-200/50">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                            Current Year Analysis
                          </h4>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <span className="text-sm font-medium text-slate-700">Accrued This Year</span>
                              <span className="text-lg font-bold text-purple-700" data-testid="text-accrued-this-year">
                                {leaveBalance.accruedThisYear.toFixed(1)} days
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                              <span className="text-sm font-medium text-slate-700">Used This Year</span>
                              <span className="text-lg font-bold text-red-700" data-testid="text-used-this-year">
                                {leaveBalance.takenThisYear.toFixed(1)} days
                              </span>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex justify-between text-sm text-slate-600 mb-2">
                                <span>Year Usage Rate</span>
                                <span>{leaveBalance.accruedThisYear > 0 ? ((leaveBalance.takenThisYear / leaveBalance.accruedThisYear) * 100).toFixed(1) : 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-red-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(leaveBalance.accruedThisYear > 0 ? (leaveBalance.takenThisYear / leaveBalance.accruedThisYear) * 100 : 0, 100)}%` 
                                  }}
                                  data-testid="progress-year-usage"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-6 border border-slate-200/50">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                            Leave Balance Visualization
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm text-slate-600 mb-2">
                                <span>Overall Balance Usage</span>
                                <span>{leaveBalance.totalAccrued > 0 ? (((leaveBalance.totalTaken + leaveBalance.pendingRequests) / leaveBalance.totalAccrued) * 100).toFixed(1) : 0}%</span>
                              </div>
                              <div className="relative w-full bg-gray-200 rounded-full h-4 mb-2">
                                {/* Used portion */}
                                <div 
                                  className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-l-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100)}%` 
                                  }}
                                ></div>
                                {/* Pending portion */}
                                <div 
                                  className="absolute top-0 bg-gradient-to-r from-blue-400 to-indigo-500 h-4 transition-all duration-500"
                                  style={{ 
                                    left: `${Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100)}%`,
                                    width: `${Math.min((leaveBalance.pendingRequests / leaveBalance.totalAccrued) * 100, 100 - Math.min((leaveBalance.totalTaken / leaveBalance.totalAccrued) * 100, 100))}%` 
                                  }}
                                ></div>
                                {/* Available portion */}
                                <div 
                                  className="absolute top-0 bg-gradient-to-r from-emerald-400 to-green-500 h-4 rounded-r-full transition-all duration-500"
                                  style={{ 
                                    left: `${Math.min(((leaveBalance.totalTaken + leaveBalance.pendingRequests) / leaveBalance.totalAccrued) * 100, 100)}%`,
                                    width: `${100 - Math.min(((leaveBalance.totalTaken + leaveBalance.pendingRequests) / leaveBalance.totalAccrued) * 100, 100)}%` 
                                  }}
                                  data-testid="progress-available-balance"
                                ></div>
                              </div>
                              
                              <div className="flex justify-between text-xs text-slate-500">
                                <span className="flex items-center">
                                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-1"></span>
                                  Used ({leaveBalance.totalTaken.toFixed(1)})
                                </span>
                                <span className="flex items-center">
                                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-1"></span>
                                  Pending ({leaveBalance.pendingRequests.toFixed(1)})
                                </span>
                                <span className="flex items-center">
                                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-1"></span>
                                  Available ({leaveBalance.remainingBalance.toFixed(1)})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200/50 text-center">
                      <p className="text-xs text-slate-500">
                        💡 Leave balance is calculated from your join date with an accrual rate of 1.5 days per month worked. 
                        Balances are updated in real-time based on approved and pending leave requests.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="bg-gradient-to-br from-white via-slate-50/30 to-red-50/50 rounded-xl p-8 border border-red-200/50 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <div className="text-center p-8">
                      <CalendarX className="h-16 w-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Leave Balance Unavailable</h3>
                      <p className="text-slate-600">Unable to calculate leave balance. This may be due to missing join date or system error.</p>
                    </div>
                  </motion.div>
                )}

                {/* Month-wise Leave Summary */}
                <motion.div 
                  className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/50 rounded-xl p-8 border border-slate-200/50 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">📅 Monthly Leave Summary</h3>
                    <p className="text-slate-600">Leave data organized by month for better insights</p>
                  </div>
                  
                  {monthlyLeaveData.length > 0 ? (
                    <div className="space-y-6" data-testid="monthly-leave-data">
                      {monthlyLeaveData.map(([month, monthData], index) => {
                        const stats = getMonthlyStats(monthData);
                        return (
                          <motion.div
                            key={month}
                            className="bg-white/80 rounded-xl p-6 border border-slate-200/50 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-slate-800" data-testid={`month-${month}`}>
                                {month}
                              </h4>
                              <div className="text-sm text-slate-600">
                                {stats.totalRequests} request{stats.totalRequests !== 1 ? 's' : ''}
                              </div>
                            </div>

                            {/* Month Statistics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <div className="text-xs font-medium text-blue-600 mb-1">Total Days</div>
                                <div className="text-lg font-bold text-blue-700" data-testid={`total-days-${month}`}>
                                  {stats.totalDays}
                                </div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                <div className="text-xs font-medium text-green-600 mb-1">Approved Days</div>
                                <div className="text-lg font-bold text-green-700" data-testid={`approved-${month}`}>
                                  {stats.approvedDays}
                                </div>
                              </div>
                              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                                <div className="text-xs font-medium text-yellow-600 mb-1">Pending Days</div>
                                <div className="text-lg font-bold text-yellow-700" data-testid={`pending-${month}`}>
                                  {stats.pendingDays}
                                </div>
                              </div>
                              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                <div className="text-xs font-medium text-red-600 mb-1">Rejected Days</div>
                                <div className="text-lg font-bold text-red-700" data-testid={`rejected-${month}`}>
                                  {stats.rejectedDays}
                                </div>
                              </div>
                            </div>

                            {/* Leave Types Breakdown */}
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-slate-700 mb-2">Leave Types (Days)</h5>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(stats.leaveTypeStats).map(([type, typeStats]) => (
                                  <span
                                    key={type}
                                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                                    data-testid={`leave-type-${type}-${month}`}
                                  >
                                    {type}: {typeStats.days} days
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Monthly Leave Details */}
                            <div className="bg-slate-50 rounded-lg p-4 border">
                              <h5 className="text-sm font-semibold text-slate-700 mb-3">Leave Details</h5>
                              <div className="space-y-2">
                                {monthData.map(({ leave, daysInMonth }) => {
                                  const startDate = new Date(leave.startDate);
                                  const endDate = new Date(leave.endDate);
                                  
                                  return (
                                    <div 
                                      key={`${leave.id}-${month}`} 
                                      className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0"
                                      data-testid={`leave-detail-${leave.id}`}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <Badge
                                          variant={
                                            leave.status === 'approved' ? 'default' : 
                                            leave.status === 'pending' ? 'secondary' : 'destructive'
                                          }
                                          className="text-xs"
                                        >
                                          {leave.status}
                                        </Badge>
                                        <span className="text-sm font-medium text-slate-700">
                                          {leave.type}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm text-slate-600">
                                          {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd')}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {daysInMonth} day{daysInMonth !== 1 ? 's' : ''} in {month}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12" data-testid="no-leave-data">
                      <div className="text-slate-400 mb-4">
                        <CalendarX className="h-16 w-16 mx-auto" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-600 mb-2">No Leave Requests Found</h4>
                      <p className="text-slate-500">This employee hasn't submitted any leave requests yet.</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Professional Attendance Tab */}
              <TabsContent value="attendance" className="space-y-6">
                {/* Monthly Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Total Hours</h4>
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600" data-testid="total-hours">{monthlyStats.formattedWorkingHours}h</div>
                    <p className="text-xs text-slate-600 mt-1">Working hours this month</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Present Days</h4>
                      <div className="p-2 bg-green-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600" data-testid="present-days">{monthlyStats.presentDays}</div>
                    <p className="text-xs text-slate-600 mt-1">Days present</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 border border-red-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Absent Days</h4>
                      <div className="p-2 bg-red-200 rounded-lg">
                        <CalendarX className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600" data-testid="absent-days">{monthlyStats.absentDays}</div>
                    <p className="text-xs text-slate-600 mt-1">Days absent</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Half Days</h4>
                      <div className="p-2 bg-orange-200 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600" data-testid="half-days">{monthlyStats.halfDays}</div>
                    <p className="text-xs text-slate-600 mt-1">Half day leaves</p>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200/50 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Late Days</h4>
                      <div className="p-2 bg-purple-200 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600" data-testid="late-days">{monthlyStats.lateDays}</div>
                    <p className="text-xs text-slate-600 mt-1">Late arrivals</p>
                  </motion.div>
                </div>

                <motion.div 
                  className="bg-gradient-to-br from-white via-purple-50/30 to-violet-50/50 rounded-xl p-8 border border-purple-200/50 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">⏰ Monthly Attendance Records</h3>
                        <p className="text-slate-600">Attendance records organized by month with detailed statistics</p>
                      </div>
                      <div className="w-64">
                        <Select value={selectedAttendanceMonth} onValueChange={setSelectedAttendanceMonth} data-testid="month-selector">
                          <SelectTrigger className="bg-white border-slate-200">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMonths.map((month) => (
                              <SelectItem key={month} value={month}>
                                {format(new Date(month + '-01'), 'MMMM yyyy')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg border border-slate-200/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Hours Worked</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.length > 0 ? attendanceRecords.map((record) => {
                          const hoursWorked = record.checkInTime && record.checkOutTime
                            ? ((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60 * 60)).toFixed(1)
                            : '-';
                            
                          return (
                            <TableRow key={record.id} data-testid={`attendance-record-${record.id}`}>
                              <TableCell className="font-medium">
                                {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : '-'}
                              </TableCell>
                              <TableCell>
                                {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '-'}
                              </TableCell>
                              <TableCell>
                                {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    record.status === 'present' ? 'default' :
                                    record.status === 'halfday' ? 'secondary' : 
                                    record.status === 'late' ? 'outline' : 'destructive'
                                  }
                                  className={
                                    record.status === 'halfday' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                    record.status === 'late' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''
                                  }
                                >
                                  {record.status === 'halfday' ? 'Half Day' : 
                                   record.status === 'late' ? 'Late' :
                                   record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{hoursWorked} hrs</TableCell>
                            </TableRow>
                          );
                        }) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8" data-testid="no-attendance-records">
                              <div className="flex flex-col items-center space-y-2">
                                <Clock className="h-8 w-8 text-slate-400" />
                                <span>No attendance records found for {format(new Date(selectedAttendanceMonth + '-01'), 'MMMM yyyy')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Professional Payment History Tab */}
              <TabsContent value="payments" className="space-y-6">
                <motion.div 
                  className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 rounded-xl p-8 border border-orange-200/50 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">💳 Payment History</h3>
                        <p className="text-slate-600">Monthly salary payment records and payslip management</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Monthly CTC</div>
                          <div className="text-lg font-bold text-slate-900">₹{(employee.salary || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Net Salary</div>
                          <div className="text-lg font-bold text-emerald-600">₹{Math.round(salaryBreakdown.netSalary).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg border border-slate-200/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-slate-700">Month</TableHead>
                          <TableHead className="font-semibold text-slate-700">Gross Salary</TableHead>
                          <TableHead className="font-semibold text-slate-700">Net Amount</TableHead>
                          <TableHead className="font-semibold text-slate-700">Payment Status</TableHead>
                          <TableHead className="font-semibold text-slate-700">Payment Date</TableHead>
                          <TableHead className="font-semibold text-slate-700">Mode</TableHead>
                          <TableHead className="font-semibold text-slate-700">Reference No</TableHead>
                          <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyPaymentHistory.length > 0 ? monthlyPaymentHistory.map((monthlyPayment, index) => {
                          
                          return (
                            <TableRow key={`monthly-${monthlyPayment.month}-${index}`} data-testid={`monthly-payment-${index}`}>
                              <TableCell className="font-medium text-slate-900">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{monthlyPayment.month}</span>
                                  <span className="text-xs text-slate-500">Pay Period</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900">₹{monthlyPayment.grossAmount.toLocaleString()}</span>
                                  <span className="text-xs text-slate-500">Before deductions</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-emerald-700">₹{monthlyPayment.netAmount.toLocaleString()}</span>
                                  <span className="text-xs text-slate-500">Take-home amount</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={monthlyPayment.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                    className={
                                      monthlyPayment.paymentStatus === 'paid' 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                        : monthlyPayment.paymentStatus === 'pending'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                    }
                                    data-testid={`payment-status-${index}`}
                                  >
                                    {monthlyPayment.paymentStatus === 'paid' ? (
                                      <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Paid</span>
                                      </div>
                                    ) : monthlyPayment.paymentStatus === 'pending' ? (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Pending</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>Not Generated</span>
                                      </div>
                                    )}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-900">
                                    {monthlyPayment.paymentDate ? format(new Date(monthlyPayment.paymentDate), 'MMM dd, yyyy') : '-'}
                                  </span>
                                  {monthlyPayment.paymentDate && (
                                    <span className="text-xs text-slate-500">
                                      {format(new Date(monthlyPayment.paymentDate), 'EEEE')}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {monthlyPayment.paymentMode ? (
                                    <div className="flex items-center space-x-1">
                                      {monthlyPayment.paymentMode === 'bank_transfer' && <CreditCard className="h-4 w-4 text-blue-600" />}
                                      {monthlyPayment.paymentMode === 'cheque' && <Receipt className="h-4 w-4 text-purple-600" />}
                                      {monthlyPayment.paymentMode === 'cash' && <Banknote className="h-4 w-4 text-green-600" />}
                                      {monthlyPayment.paymentMode === 'upi' && <CreditCard className="h-4 w-4 text-orange-600" />}
                                      <span className="text-sm capitalize">
                                        {monthlyPayment.paymentMode?.replace('_', ' ') || '-'}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-500">-</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-mono text-sm text-slate-900">
                                    {monthlyPayment.referenceNo || '-'}
                                  </span>
                                  {monthlyPayment.referenceNo && (
                                    <span className="text-xs text-slate-500">Transaction ID</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => generatePayslipPDF()}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800"
                                    data-testid={`download-payslip-${index}`}
                                    disabled={monthlyPayment.paymentStatus === 'not_generated'}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <Download className="h-3 w-3" />
                                      <span className="hidden sm:inline text-xs">Download</span>
                                    </div>
                                  </Button>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          );
                        }) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-12" data-testid="no-monthly-payment-records">
                              <div className="flex flex-col items-center space-y-4">
                                <Receipt className="h-8 w-8 text-slate-400" />
                                <span>No payment records found for this employee</span>
                                <p className="text-sm text-slate-500 max-w-md">
                                  Payment records will appear here once salary payments are processed for this employee.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </TabsContent>

              {/* End of tabs content */}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}