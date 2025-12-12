import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
<<<<<<< HEAD
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
=======
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Department, insertUserSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface EmployeeFormProps {
  employee?: User;
  departments: Department[];
  onSuccess: () => void;
}

<<<<<<< HEAD
export function EmployeeForm({
  employee,
  departments,
  onSuccess,
}: EmployeeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!employee;

=======
export function EmployeeForm({ employee, departments, onSuccess }: EmployeeFormProps) {
  const { toast } = useToast();
  const isEditing = !!employee;
  
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
  // Create form schema extending the insertUserSchema
  // Password is required for new employees but optional when editing
  const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
<<<<<<< HEAD
    password: isEditing
      ? z
          .string()
          .min(6, "Password must be at least 6 characters")
          .optional()
          .or(z.literal(""))
=======
    password: isEditing 
      ? z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal(''))
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
      : z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
<<<<<<< HEAD
    role: z.enum(["admin", "hr", "manager", "employee"]),
=======
    role: z.enum(['admin', 'hr', 'manager', 'employee']),
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
    departmentId: z.number().nullable(),
    position: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().default(true),
  });
<<<<<<< HEAD

  type FormValues = z.infer<typeof formSchema>;

=======
  
  type FormValues = z.infer<typeof formSchema>;
  
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: employee?.username || "",
      password: "",
      email: employee?.email || "",
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      role: employee?.role || "employee",
      departmentId: employee?.departmentId || null,
      position: employee?.position || "",
      phoneNumber: employee?.phoneNumber || "",
      address: employee?.address || "",
      isActive: employee?.isActive ?? true,
    },
  });
<<<<<<< HEAD

=======
  
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
  // Create or update employee mutation
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Remove empty password when editing
      if (isEditing && !values.password) {
        const { password, ...dataWithoutPassword } = values;
        return await apiRequest(
<<<<<<< HEAD
          "PUT",
          `/api/employees/${employee.id}`,
          dataWithoutPassword,
        );
      }

      if (isEditing) {
        return await apiRequest("PUT", `/api/employees/${employee.id}`, values);
=======
          "PUT", 
          `/api/employees/${employee.id}`, 
          dataWithoutPassword
        );
      }
      
      if (isEditing) {
        return await apiRequest(
          "PUT", 
          `/api/employees/${employee.id}`, 
          values
        );
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
      } else {
        return await apiRequest("POST", "/api/register", values);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Employee updated" : "Employee created",
<<<<<<< HEAD
        description: isEditing
          ? "Employee information has been updated successfully."
          : "New employee has been created successfully.",
      });
      // Invalidate all employee-related queries to ensure data syncs between admin and employee views
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] }); // Admin employee list
      if (isEditing && employee?.id) {
        queryClient.invalidateQueries({
          queryKey: ["/api/employees", employee.id],
        }); // Specific employee
        queryClient.invalidateQueries({
          queryKey: [`/api/employees/${employee.id}`],
        }); // Employee detail page
      }
      queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // Current user (if they're viewing their own profile)
=======
        description: isEditing 
          ? "Employee information has been updated successfully." 
          : "New employee has been created successfully.",
      });
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
<<<<<<< HEAD

=======
  
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
<<<<<<< HEAD
              <h3 className="text-lg font-medium text-slate-900">
                Personal Information
              </h3>
              <p className="text-sm text-slate-500">
                Basic details about the employee
              </p>
            </div>

=======
              <h3 className="text-lg font-medium text-slate-900">Personal Information</h3>
              <p className="text-sm text-slate-500">Basic details about the employee</p>
            </div>
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel className="text-sm font-medium text-slate-700">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
=======
                    <FormLabel className="text-sm font-medium text-slate-700">First Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter first name" 
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<<<<<<< HEAD

=======
              
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Last Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
=======
                    <FormLabel className="text-sm font-medium text-slate-700">Last Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter last name" 
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
=======
                  <FormLabel className="text-sm font-medium text-slate-700">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<<<<<<< HEAD

=======
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
=======
                  <FormLabel className="text-sm font-medium text-slate-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<<<<<<< HEAD

=======
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address"
                      className="min-h-[80px] resize-none border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
=======
                  <FormLabel className="text-sm font-medium text-slate-700">Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter full address" 
                      className="min-h-[80px] resize-none border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
<<<<<<< HEAD
              <h3 className="text-lg font-medium text-slate-900">
                Account Information
              </h3>
              <p className="text-sm text-slate-500">
                Login credentials and access details
              </p>
            </div>

=======
              <h3 className="text-lg font-medium text-slate-900">Account Information</h3>
              <p className="text-sm text-slate-500">Login credentials and access details</p>
            </div>
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Username *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
=======
                    <FormLabel className="text-sm font-medium text-slate-700">Username *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter username" 
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<<<<<<< HEAD

=======
              
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      {isEditing ? "New Password (optional)" : "Password *"}
                    </FormLabel>
                    <FormControl>
<<<<<<< HEAD
                      <Input
                        type="password"
                        placeholder={
                          isEditing
                            ? "Leave blank to keep current"
                            : "Enter password"
                        }
=======
                      <Input 
                        type="password" 
                        placeholder={isEditing ? "Leave blank to keep current" : "Enter password"} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                        className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Organization Information Section */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
<<<<<<< HEAD
              <h3 className="text-lg font-medium text-slate-900">
                Organization Details
              </h3>
              <p className="text-sm text-slate-500">
                Role, department, and position information
              </p>
            </div>

=======
              <h3 className="text-lg font-medium text-slate-900">Organization Details</h3>
              <p className="text-sm text-slate-500">Role, department, and position information</p>
            </div>
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Role *
                    </FormLabel>
                    <Select
                      value={field.value}
=======
                    <FormLabel className="text-sm font-medium text-slate-700">Role *</FormLabel>
                    <Select 
                      value={field.value} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
<<<<<<< HEAD

=======
              
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Department
                    </FormLabel>
                    <Select
                      value={field.value?.toString() || "none"}
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? null : parseInt(value),
                        )
                      }
=======
                    <FormLabel className="text-sm font-medium text-slate-700">Department</FormLabel>
                    <Select 
                      value={field.value?.toString() || "none"} 
                      onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Department</SelectItem>
                        {departments.map((department) => (
<<<<<<< HEAD
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
=======
                          <SelectItem key={department.id} value={department.id.toString()}>
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Position/Job Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter position or job title"
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
=======
                  <FormLabel className="text-sm font-medium text-slate-700">Position/Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter position or job title" 
                      className="h-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      {...field} 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<<<<<<< HEAD

=======
            
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
            {isEditing && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 bg-slate-50">
                      <div className="space-y-1">
<<<<<<< HEAD
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Account Status
                        </FormLabel>
                        <p className="text-xs text-slate-500">
                          {field.value
                            ? "Employee account is active"
                            : "Employee account is disabled"}
=======
                        <FormLabel className="text-sm font-medium text-slate-700">Account Status</FormLabel>
                        <p className="text-xs text-slate-500">
                          {field.value ? "Employee account is active" : "Employee account is disabled"}
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>
<<<<<<< HEAD

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
=======
          
          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t border-slate-200">
            <Button 
              type="button" 
              variant="outline" 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              onClick={onSuccess}
              className="w-full sm:w-auto h-10 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
<<<<<<< HEAD
            <Button
=======
            <Button 
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              type="submit"
              className="w-full sm:w-auto h-10 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              disabled={mutation.isPending}
            >
<<<<<<< HEAD
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
=======
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
>>>>>>> b6842dc769db9515d23115028c02d6ffc14d7b9c
              {isEditing ? "Update Employee" : "Create Employee"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
