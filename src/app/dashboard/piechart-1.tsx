"use client";

import React, { memo } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const desktopData = [
  { month: "january", desktop: 186, fill: "url(#january-gradient)" },
  { month: "february", desktop: 305, fill: "url(#february-gradient)" },
  { month: "march", desktop: 237, fill: "url(#march-gradient)" },
  { month: "april", desktop: 173, fill: "url(#april-gradient)" },
  { month: "may", desktop: 209, fill: "url(#may-gradient)" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
  january: { label: "Janeiro", color: "url(#january-gradient)" },
  february: { label: "Fevereiro", color: "url(#february-gradient)" },
  march: { label: "Março", color: "url(#march-gradient)" },
  april: { label: "Abril", color: "url(#april-gradient)" },
  may: { label: "Maio", color: "url(#may-gradient)" },
} satisfies ChartConfig;

export const Piechart1 = memo(function Piechart1() {
  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  );
  const months = React.useMemo(() => desktopData.map((item) => item.month), []);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Processos por Etapa</CardTitle>
          <CardDescription>Mensal</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        background: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <defs>
              <linearGradient id="january-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2196f3" />
                <stop offset="100%" stopColor="#03a9f4" />
              </linearGradient>
              <linearGradient
                id="february-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#e91e63" />
                <stop offset="100%" stopColor="#f06292" />
              </linearGradient>
              <linearGradient id="march-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4caf50" />
                <stop offset="100%" stopColor="#8bc34a" />
              </linearGradient>
              <linearGradient id="april-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffc107" />
                <stop offset="100%" stopColor="#ffeb3b" />
              </linearGradient>
              <linearGradient id="may-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5722" />
                <stop offset="100%" stopColor="#ff9800" />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
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
                          {desktopData[activeIndex].desktop.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Processos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
