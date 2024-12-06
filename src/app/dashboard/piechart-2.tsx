"use client"

import * as React from "react"
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from "recharts"

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
  { browser: "Pausados", visitors: 10, fill: "url(#paused-gradient)" },
  { browser: "Suspensos", visitors: 20, fill: "url(#suspended-gradient)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  pausados: {
    label: "Pausados",
    color: "url(#paused-gradient)",
  },
  suspensos: {
    label: "Suspensos",
    color: "url(#suspended-gradient)",
  },
} satisfies ChartConfig

export function Piechart2() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Processos Inativos</CardTitle>
        <CardDescription>Este mês</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <defs>
              {/* Gradiente para "Pausados" */}
              <linearGradient id="paused-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5722" /> {/* Laranja */}
                <stop offset="100%" stopColor="#ff9800" /> {/* Amarelo */}
              </linearGradient>
              {/* Gradiente para "Suspensos" */}
              <linearGradient id="suspended-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4caf50" /> {/* Verde */}
                <stop offset="100%" stopColor="#8bc34a" /> {/* Verde Claro */}
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Processos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Aumento total de 5.2% esse mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {/* Espaço para qualquer descrição adicional */}
        </div>
      </CardFooter>
    </Card>
  )
}
