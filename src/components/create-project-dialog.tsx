// components/create-project-dialog.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Step 1 Schema - Create Repository
const step1Schema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional(),
});

// Step 2 Schema - Upload File and Set Timeline
const step2Schema = z
  .object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    desiredCommitCount: z
      .number()
      .min(1, "Must be at least 1 commit")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate < data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

export function CreateProjectDialog() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Step 1 Form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Step 2 Form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      desiredCommitCount: 10,
    },
  });

  // In your create-project-dialog.tsx - update handleFileChange
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log("📁 Frontend file selection:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });

    if (file) {
      // Match the same validation as backend
      const allowedMimeTypes = [
        "application/zip",
        "application/x-zip",
        "application/x-zip-compressed",
        "application/octet-stream",
      ];

      const isZipByMimeType = allowedMimeTypes.includes(file.type);
      const isZipByExtension = file.name.toLowerCase().endsWith(".zip");

      console.log("🔍 Frontend validation:", {
        isZipByMimeType,
        isZipByExtension,
        fileType: file.type,
      });

      if (isZipByMimeType || isZipByExtension) {
        setSelectedFile(file);
        toast.success("ZIP file selected successfully!");
      } else {
        toast.error(
          `Please select a valid ZIP file. Detected type: ${
            file.type || "unknown"
          }`
        );
        e.target.value = "";
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleStep1Submit = async (data: Step1Data) => {
    setIsLoading(true);
    try {
      // Call your backend API for step 1
      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setProjectId(result.data.id);
        setStep(2);
        toast.success("Project created successfully!");
      } else {
        if (result.code === "PLAN_LIMIT_EXCEEDED") {
          toast.error(result.error);
        } else {
          toast.error(result.error || "Failed to create project");
        }
      }
    } catch (error) {
      toast.error("Failed to create project");
      console.error("Step 1 error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (data: Step2Data) => {
    if (!selectedFile || !projectId) {
      toast.error("Please upload a file first");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔍 Debug - Project ID:", projectId);
      console.log("🔍 Debug - Project ID type:", typeof projectId);

      // Log the exact URL we're constructing
      const API_URL = `http://localhost:3001/api/projects/file/upload/${projectId}`;
      console.log("🌐 Exact URL being called:", API_URL);

      const formData = new FormData();
      formData.append("file", selectedFile);

      if (data.startDate) {
        formData.append("startDate", data.startDate.toISOString());
      }
      if (data.endDate) {
        formData.append("endDate", data.endDate.toISOString());
      }
      if (data.desiredCommitCount) {
        formData.append(
          "desiredCommitCount",
          data.desiredCommitCount.toString()
        );
      }

      console.log("📋 FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log("📡 Response status:", response.status, response.statusText);

      if (response.status === 404) {
        throw new Error(
          `Endpoint not found: ${API_URL}. Check backend routes.`
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Step 2 Success:", result);

      if (result.success) {
        toast.success("Project setup completed!");
        setStep(1);
        setProjectId(null);
        setSelectedFile(null);
        step1Form.reset();
        step2Form.reset();
      } else {
        toast.error(result.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("❌ Step 2 Error Details:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
              )}
            >
              1
            </div>
            <div className="w-12 h-1 bg-gray-200">
              <div
                className={cn(
                  "h-1 bg-green-500 transition-all",
                  step >= 2 ? "w-full" : "w-0"
                )}
              />
            </div>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
              )}
            >
              2
            </div>
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 1 && "Create GitHub Repository"}
            {step === 2 && "Upload Files & Set Timeline"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Create Repository */}
        {step === 1 && (
          <Form {...step1Form}>
            <form
              onSubmit={step1Form.handleSubmit(handleStep1Submit)}
              className="space-y-6"
            >
              <FormField
                control={step1Form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="my-awesome-project"
                        className="text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your GitHub repository name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Repository"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* Step 2: Upload Files & Timeline */}
        {step === 2 && (
          <Form {...step2Form}>
            <form
              onSubmit={step2Form.handleSubmit(handleStep2Submit)}
              className="space-y-4"
            >
              {/* File Upload */}
              <div className="space-y-2">
                <FormLabel>Upload Project Files</FormLabel>
                <div className="border-2 border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Input
                    type="file"
                    accept=".zip,application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
                    onChange={handleFileChange}
                    className="hidden"
                    id="project-file"
                  />
                  <label htmlFor="project-file" className="cursor-pointer">
                    {selectedFile ? (
                      <p className="text-xs  mt-2">{selectedFile.name}</p>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">
                          Click to upload ZIP file
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={step2Form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2Form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={step2Form.control}
                name="desiredCommitCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Commit </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of commits to generate (default: 10)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading || !selectedFile}>
                  {isLoading ? "Uploading..." : "Complete Setup"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
