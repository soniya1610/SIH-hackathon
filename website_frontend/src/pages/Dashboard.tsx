import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Trophy, Download, Check, X } from "lucide-react";

// FIX 1: Named import use karein Vite bundles ke liye
import { jsPDF } from "jspdf"; 

import PerformanceAnalysisCard from "@/components/performance/PerformanceAnalysisCard";

const stats = [
  {
    title: "Total Athletes",
    value: "10",
    icon: Users,
    change: "+5% from last month",
  },
  {
    title: "Pending Reviews",
    value: "4",
    icon: AlertTriangle,
    change: "",
  },
  {
    title: "Top Performers",
    value: "2",
    icon: Trophy,
    change: "Above 90th percentile",
  },
];

const recentActions = [
  {
    id: 1,
    athlete: "Amrutha",
    test: "Vertical Jump",
    score: "50cm",
    status: "verified",
    timestamp: "2 mins ago",
  },
  {
    id: 2,
    athlete: "Sumadhwa",
    test: "Squats",
    score: "30 reps",
    status: "verified",
    timestamp: "15 mins ago",
  },
  {
    id: 3,
    athlete: "Anirudh",
    test: "Sit-ups",
    score: "45 reps",
    status: "pending",
    timestamp: "1 hour ago",
  },
];

export default function Dashboard() {
  const exportReport = () => {
    try {
      // FIX 2: Explicit orientation, unit, format and text color set karein
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Explicitly set text color to Black (RGB: 0, 0, 0)
      pdf.setTextColor(0, 0, 0);

      // Title
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Sports Performance Report", 20, 25);

      // Subtitle
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Performance Analysis", 20, 40);

      // Performance Data
      pdf.setFontSize(12);
      pdf.text("Exercise: Squats", 20, 55);
      pdf.text("Overall Score: 85 / 100", 20, 65);
      pdf.text("Form: 88%", 20, 75);
      pdf.text("Accuracy: 84%", 20, 85);
      pdf.text("Performance: Good", 20, 95);

      // AI Feedback
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI Feedback", 20, 115);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("Good performance! Maintain proper body alignment", 20, 125);
      pdf.text(
        "and focus on consistent movement throughout the exercise.",
        20,
        133,
      );

      // Date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 155);

      // Trigger download
      pdf.save("Sports_Performance_Report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>

        <Button onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>

              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>

              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ⭐ AI PERFORMANCE ANALYSIS CARD */}
      <PerformanceAnalysisCard />

      {/* Recent Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Actions Required</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{action.athlete}</p>

                    <p className="text-sm text-muted-foreground">
                      {action.test} - {action.score}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {action.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        action.status === "flagged"
                          ? "destructive"
                          : action.status === "verified"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {action.status}
                    </Badge>

                    {action.status === "flagged" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Check className="h-3 w-3" />
                        </Button>

                        <Button size="sm" variant="outline">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
