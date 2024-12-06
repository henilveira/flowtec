"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Contabilidade 1",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Contabilidade 2 ",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Contabilidade 3",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Contabilidade 4",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Contabilidade 5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function Barchart1() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contabilidades com mais processos</CardTitle>
        <CardDescription>Janeiro - Abril</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
         
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de processos no período de 90 dias
        </div>
      </CardFooter>
    </Card>
  )
}
