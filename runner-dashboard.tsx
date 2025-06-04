"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { Activity, Calendar, Play, Pause, Square, Target } from "lucide-react"
import { useEffect, useState } from "react"

export default function Component() {
  // Mock data for the dashboard
  const [currentRun, setCurrentRun] = useState<any | null>(null)
  const [analyticsData, setAnalyticsData] = useState<{
    paceData: { time: string; pace: string }[];
    heartRateData: { time: string; hr: number | null }[];
    weeklyStats: { day: string; distance: number }[];
  } | null>(null)

  // Removed: fetch("/data/2025-05-30.json") effect, now handled in analytics fetch below

  useEffect(() => {
    fetch("/Data/performance.json")
      .then((res) => res.json())
      .then((data) => {
        setAnalyticsData(data)
        // Fill currentRun with the most recent data
        if (data?.paceData && data.paceData.length > 0) {
          const lastIndex = data.paceData.length - 1;
          const lastPace = parseFloat(data.paceData[lastIndex].pace);
          const lastHR = data.heartRateData?.[lastIndex]?.hr;
          const lastDistance = data.weeklyStats?.[lastIndex]?.distance;

          const durationMin = lastPace * lastDistance;
          const durationSec = Math.round(durationMin * 60);

          setCurrentRun({
            isActive: false,
            duration: formatDuration(durationSec),
            distance: lastDistance.toFixed(1),
            pace: lastPace.toFixed(2),
            heartRate: lastHR,
            calories: Math.round(durationMin * 10),
          });
        }
      })
  }, [])

  function formatDuration(seconds: number) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  function estimatePace(km: number, seconds: number) {
    const pace = seconds / km
    const min = Math.floor(pace / 60)
    const sec = Math.round(pace % 60)
    return `${min}:${String(sec).padStart(2, "0")}`
  }

  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([])

  useEffect(() => {
    fetch("/data/weekly-plan.json")
      .then((res) => res.json())
      .then(setWeeklyPlan)
  }, [])


  const getTypeColor = (type: string) => {
    switch (type) {
      case "Easy Run":
        return "bg-green-100 text-green-800"
      case "Interval":
        return "bg-red-100 text-red-800"
      case "Tempo Run":
        return "bg-orange-100 text-orange-800"
      case "Long Run":
        return "bg-blue-100 text-blue-800"
      case "Recovery":
        return "bg-purple-100 text-purple-800"
      case "Rest":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">RunTracker</h1> - <h2>by  Pdro P.</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://running-xi.vercel.app/" target="_blank" rel="noopener noreferrer">
                Home
              </a>
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Week View
            </Button>
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Goals
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Current Activity */}
        {currentRun ? (
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Current Run</CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentRun.duration}</div>
                  <div className="text-sm opacity-90">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentRun.distance}</div>
                  <div className="text-sm opacity-90">Distance (km)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentRun.pace}</div>
                  <div className="text-sm opacity-90">Pace (min/km)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentRun.heartRate}</div>
                  <div className="text-sm opacity-90">Heart Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentRun.calories}</div>
                  <div className="text-sm opacity-90">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Zone 4</div>
                  <div className="text-sm opacity-90">HR Zone</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Loading run data...</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Plan */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  This Week's Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyPlan.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 text-center font-medium">{workout.day}</div>
                        <Badge className={getTypeColor(workout.type)}>{workout.type}</Badge>
                        <div className="text-sm text-gray-600">
                          {workout.distance} • {workout.duration}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {workout.completed ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Distance Goal</span>
                      <span>16.9 / 20 km</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Workouts</span>
                      <span>3 / 3</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Active Time</span>
                      <span>3h 00m / 3h</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">5K Best</span>
                    <span className="font-medium">22:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">10K Best</span>
                    <span className="font-medium">46:32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Half Marathon</span>
                    <span className="font-medium">1:42:18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Longest Run</span>
                    <span className="font-medium">25.3 km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pace" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pace">Pace Analysis</TabsTrigger>
                <TabsTrigger value="heartrate">Heart Rate</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Distance</TabsTrigger>
              </TabsList>

              <TabsContent value="pace" className="mt-6">
                <div className="h-64">
                  <ChartContainer
                    config={{
                      pace: {
                        label: "Pace (min/km)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <LineChart data={analyticsData?.paceData ?? []}>
                      <XAxis
                        dataKey="time"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth()+1).toString().padStart(2, "0")}`
                        }}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="pace"
                        stroke="var(--color-pace)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-pace)" }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="heartrate" className="mt-6">
                <div className="h-64">
                  <ChartContainer
                    config={{
                      hr: {
                        label: "Heart Rate (bpm)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <AreaChart data={analyticsData?.heartRateData ?? []}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="hr"
                        stroke="var(--color-hr)"
                        fill="var(--color-hr)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-6">
                <div className="h-64">
                  <ChartContainer
                    config={{
                      distance: {
                        label: "Distance (km)",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <BarChart data={analyticsData?.weeklyStats ?? []}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="distance" fill="var(--color-distance)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
