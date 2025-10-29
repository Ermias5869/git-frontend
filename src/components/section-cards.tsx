// components/section-cards.tsx
import {
  IconTrendingUp,
  IconTrendingDown,
  IconLoader,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  dashboardData?: {
    summary: {
      totalProjects: number;
      processedProjects: number;
      pendingProjects: number;
      totalCommits: number;
      successRate: number;
    };
  } | null;
}

export function SectionCards({ dashboardData }: SectionCardsProps) {
  const cardsData = [
    {
      title: "Total Projects",
      value: dashboardData?.summary.totalProjects || 0,
      description: "All your GitHub projects",
      trend: "up" as const,
      trendValue: "+12.5%",
      footer: "Active repositories",
      icon: IconTrendingUp,
    },
    {
      title: "Processed Projects",
      value: dashboardData?.summary.processedProjects || 0,
      description: "Successfully processed",
      trend: "up" as const,
      trendValue: "+8.2%",
      footer: "Ready for deployment",
      icon: IconCheck,
    },
    {
      title: "Pending Projects",
      value: dashboardData?.summary.pendingProjects || 0,
      description: "Awaiting processing",
      trend: "down" as const,
      trendValue: "-3.1%",
      footer: "In progress",
      icon: IconLoader,
    },
    {
      title: "Total Commits",
      value: dashboardData?.summary.totalCommits || 0,
      description: "All generated commits",
      trend: "up" as const,
      trendValue: "+15.7%",
      footer: "Across all projects",
      icon: IconTrendingUp,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardsData.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  card.trend === "up"
                    ? "text-green-600 border-green-200"
                    : "text-red-600 border-red-200"
                }
              >
                {card.trend === "up" ? (
                  <IconTrendingUp className="h-3 w-3" />
                ) : (
                  <IconTrendingDown className="h-3 w-3" />
                )}
                {card.trendValue}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.description}
            </div>
            <div className="text-muted-foreground">{card.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
