import React,{useState, useEffect} from 'react'
import InterncoSidebar from '../../components/InterncoSidebar'
import TopInternCoSidebar from '../../components/TopInternCoSidebar'
// import { TrendingUp } from "lucide-react"
import { Pie, PieChart, CartesianGrid, XAxis, Line, LineChart, Bar, BarChart,Label, LabelList } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartData1 = [
  { date: "2024-04-01", sem_long: 222, normal: 150 },
  { date: "2024-04-02", sem_long: 97, normal: 180 },
  { date: "2024-04-03", sem_long: 167, normal: 120 },
  { date: "2024-04-04", sem_long: 242, normal: 260 },
  { date: "2024-04-05", sem_long: 373, normal: 290 },
  { date: "2024-04-06", sem_long: 301, normal: 340 },
  { date: "2024-04-07", sem_long: 245, normal: 180 },
  { date: "2024-04-08", sem_long: 409, normal: 320 },
  { date: "2024-04-09", sem_long: 59, normal: 110 },
  { date: "2024-04-10", sem_long: 261, normal: 190 },
  { date: "2024-04-11", sem_long: 327, normal: 350 },
  { date: "2024-04-12", sem_long: 292, normal: 210 },
  { date: "2024-04-13", sem_long: 342, normal: 380 },
  { date: "2024-04-14", sem_long: 137, normal: 220 },
  { date: "2024-04-15", sem_long: 120, normal: 170 },
  { date: "2024-04-16", sem_long: 138, normal: 190 },
  { date: "2024-04-17", sem_long: 446, normal: 360 },
  { date: "2024-04-18", sem_long: 364, normal: 410 },
  { date: "2024-04-19", sem_long: 243, normal: 180 },
  { date: "2024-04-20", sem_long: 89, normal: 150 },
  { date: "2024-04-21", sem_long: 137, normal: 200 },
  { date: "2024-04-22", sem_long: 224, normal: 170 },
  { date: "2024-04-23", sem_long: 138, normal: 230 },
  { date: "2024-04-24", sem_long: 387, normal: 290 },
  { date: "2024-04-25", sem_long: 215, normal: 250 },
  { date: "2024-04-26", sem_long: 75, normal: 130 },
  { date: "2024-04-27", sem_long: 383, normal: 420 },
  { date: "2024-04-28", sem_long: 122, normal: 180 },
  { date: "2024-04-29", sem_long: 315, normal: 240 },
  { date: "2024-04-30", sem_long: 454, normal: 380 },
  { date: "2024-05-01", sem_long: 165, normal: 220 },
  { date: "2024-05-02", sem_long: 293, normal: 310 },
  { date: "2024-05-03", sem_long: 247, normal: 190 },
  { date: "2024-05-04", sem_long: 385, normal: 420 },
  { date: "2024-05-05", sem_long: 481, normal: 390 },
  { date: "2024-05-06", sem_long: 498, normal: 520 },
  { date: "2024-05-07", sem_long: 388, normal: 300 },
  { date: "2024-05-08", sem_long: 149, normal: 210 },
  { date: "2024-05-09", sem_long: 227, normal: 180 },
  { date: "2024-05-10", sem_long: 293, normal: 330 },
  { date: "2024-05-11", sem_long: 335, normal: 270 },
  { date: "2024-05-12", sem_long: 197, normal: 240 },
  { date: "2024-05-13", sem_long: 197, normal: 160 },
  { date: "2024-05-14", sem_long: 448, normal: 490 },
  { date: "2024-05-15", sem_long: 473, normal: 380 },
  { date: "2024-05-16", sem_long: 338, normal: 400 },
  { date: "2024-05-17", sem_long: 499, normal: 420 },
  { date: "2024-05-18", sem_long: 315, normal: 350 },
  { date: "2024-05-19", sem_long: 235, normal: 180 },
  { date: "2024-05-20", sem_long: 177, normal: 230 },
  { date: "2024-05-21", sem_long: 82, normal: 140 },
  { date: "2024-05-22", sem_long: 81, normal: 120 },
  { date: "2024-05-23", sem_long: 252, normal: 290 },
  { date: "2024-05-24", sem_long: 294, normal: 220 },
  { date: "2024-05-25", sem_long: 201, normal: 250 },
  { date: "2024-05-26", sem_long: 213, normal: 170 },
  { date: "2024-05-27", sem_long: 420, normal: 460 },
  { date: "2024-05-28", sem_long: 233, normal: 190 },
  { date: "2024-05-29", sem_long: 78, normal: 130 },
  { date: "2024-05-30", sem_long: 340, normal: 280 },
  { date: "2024-05-31", sem_long: 178, normal: 230 },
  { date: "2024-06-01", sem_long: 178, normal: 200 },
  { date: "2024-06-02", sem_long: 470, normal: 410 },
  { date: "2024-06-03", sem_long: 103, normal: 160 },
  { date: "2024-06-04", sem_long: 439, normal: 380 },
  { date: "2024-06-05", sem_long: 88, normal: 140 },
  { date: "2024-06-06", sem_long: 294, normal: 250 },
  { date: "2024-06-07", sem_long: 323, normal: 370 },
  { date: "2024-06-08", sem_long: 385, normal: 320 },
  { date: "2024-06-09", sem_long: 438, normal: 480 },
  { date: "2024-06-10", sem_long: 155, normal: 200 },
  { date: "2024-06-11", sem_long: 92, normal: 150 },
  { date: "2024-06-12", sem_long: 492, normal: 420 },
  { date: "2024-06-13", sem_long: 81, normal: 130 },
  { date: "2024-06-14", sem_long: 426, normal: 380 },
  { date: "2024-06-15", sem_long: 307, normal: 350 },
  { date: "2024-06-16", sem_long: 371, normal: 310 },
  { date: "2024-06-17", sem_long: 475, normal: 520 },
  { date: "2024-06-18", sem_long: 107, normal: 170 },
  { date: "2024-06-19", sem_long: 341, normal: 290 },
  { date: "2024-06-20", sem_long: 408, normal: 450 },
  { date: "2024-06-21", sem_long: 169, normal: 210 },
  { date: "2024-06-22", sem_long: 317, normal: 270 },
  { date: "2024-06-23", sem_long: 480, normal: 530 },
  { date: "2024-06-24", sem_long: 132, normal: 180 },
  { date: "2024-06-25", sem_long: 141, normal: 190 },
  { date: "2024-06-26", sem_long: 434, normal: 380 },
  { date: "2024-06-27", sem_long: 448, normal: 490 },
  { date: "2024-06-28", sem_long: 149, normal: 200 },
  { date: "2024-06-29", sem_long: 103, normal: 160 },
  { date: "2024-06-30", sem_long: 446, normal: 400 },
]
const chartConfig1 = {
  views: {
    label: "Page Views",
  },
  sem_long: {
    label: "Semester Long",
    color: "hsl(var(--chart-1))",
  },
  normal: {
    label: "Normal",
    color: "hsl(var(--chart-2))",
  },
}


const InternshipCoordinatorDashboard = () => {
  const [totalInternships, setTotalInternships] = useState([]);
  const [activeInternships, setActiveInternships] = useState([]);
  const [completedInternships, setCompletedInternships] = useState([])
  const [activeChart, setActiveChart] = useState("sem_long");
  const [internshipsByMonth, setInternshipsByMonth] = useState([]);

  const chartData = [
    { status: "Active", count: activeInternships.length, fill: "var(--color-active)" },
    { status: "Completed", count: completedInternships.length, fill: "var(--color-completed)" },
  ];

  const chartConfig = {
    count: {
      label: "Count",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-4))",
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-3))",
    },
  } ;

  const chartDataTemplate = [
    { month: "January", count: 0 },
    { month: "February", count: 0 },
    { month: "March", count: 0 },
    { month: "April", count: 0 },
    { month: "May", count: 0 },
    { month: "June", count: 0 },
  ]
  const chartConfig2 = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  }
  
  useEffect(() => {
    // Fetch existing data from the database when the component mounts
    const fetchExistingData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getInternship`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setTotalInternships(data);
        filterInternships(data);
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    };

    const filterInternships = (internships) => {
      const active = internships.filter(internship => internship.status !== 'closed');
      const completed = internships.filter(internship => internship.status === 'completed');
      setActiveInternships(active);
      setCompletedInternships(completed);
    };

    fetchExistingData();
  }, []);
  useEffect(()=>{
    // Function to group internships by month
    const groupInternshipsByMonth = (internships) => {
      const monthMap = {};
    
      internships.forEach((internship) => {
        const date = new Date(internship.startDate);
        const month = date.toLocaleString('default', { month: 'long' });
    
        if (!monthMap[month]) {
          monthMap[month] = 0;
        }
        monthMap[month] += 1;
      });
    
      return monthMap;
    };
    
    // Assuming internships is your array of internship objects
    const intern = groupInternshipsByMonth(totalInternships);
    
    const chartData2 = chartDataTemplate.map((item) => ({
      month: item.month,
      count: intern[item.month] || 0, // Use count from monthCounts or default to 0
    }));
    setInternshipsByMonth(chartData2);
    console.log(chartData2);
  },[totalInternships]);


  const total = React.useMemo(
    () => ({
      sem_long: chartData1.reduce((acc, curr) => acc + curr.sem_long, 0),
      normal: chartData1.reduce((acc, curr) => acc + curr.normal, 0),
    }),
    []
  )
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <InterncoSidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopInternCoSidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
        <h1 className="flex flex-col text-3xl font-bold items-start">Welcome back</h1>
        <div className="p-2 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center justify-between">
            <h1>Total Internships</h1>
            {/* <UsersIcon className="w-6 h-6 text-muted-foreground" /> */}
          </div>
          <div className='flex items-center'>
            <div className="text-4xl font-bold">{totalInternships.length}</div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h1>Active Internships</h1>
            {/* <ActivityIcon className="w-6 h-6 text-muted-foreground" /> */}
          </div>
          <div>
            <div className="text-4xl font-bold">{activeInternships.length}</div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h1>Completed Internships</h1>
            {/* <CircleCheckIcon className="w-6 h-6 text-muted-foreground" /> */}
          </div>
          <div>
            <div className="text-4xl font-bold">{completedInternships.length}</div>
          </div>
        </div>
        {/* <div>
          <div className="flex items-center justify-between">
            <h1>Placement Rate</h1>
          </div>
          <div>
            <div className="text-4xl font-bold">placementRate %</div>
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col h-full">
              {/* <BarchartactiveChart className="aspect-[16/9]" /> */}
              <Card className="flex flex-col h-full">
                  <CardHeader className="flex flex-row justify-between">
                      <CardTitle>Internships started</CardTitle>
                      <CardDescription>January - June 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <ChartContainer config={chartConfig2} className="h-full w-full">
                          <BarChart
                              accessibilityLayer
                              data={internshipsByMonth}
                              margin={{ top: 20 }}
                          >
                              <CartesianGrid vertical={false} />
                              <XAxis
                                  dataKey="month"
                                  tickLine={false}
                                  tickMargin={10}
                                  axisLine={false}
                                  tickFormatter={(value) => value.slice(0, 3)}
                              />
                              <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent hideLabel />}
                              />
                              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                                  <LabelList
                                      position="top"
                                      offset={12}
                                      className="fill-foreground"
                                      fontSize={12}
                                  />
                              </Bar>
                          </BarChart>
                      </ChartContainer>
                  </CardContent>
                  {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month 
                      {/* <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter> */}
              </Card>
          </div>
          <div className="flex flex-col h-full">
              <Card className="flex flex-col h-full">
                  <CardHeader className="items-center pb-0">
                      <CardTitle>Internships by Status</CardTitle>
                      <CardDescription>January - June 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                      <ChartContainer
                          config={chartConfig}
                          className="mx-auto aspect-square max-h-[250px]"
                      >
                          <PieChart>
                              <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent hideLabel />}
                              />
                              <Pie
                                  data={chartData}
                                  dataKey="count"
                                  nameKey="status"
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
                                                          {totalInternships.length.toLocaleString()}
                                                      </tspan>
                                                      <tspan
                                                          x={viewBox.cx}
                                                          y={(viewBox.cy || 0) + 24}
                                                          className="fill-muted-foreground"
                                                      >
                                                          Internships
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
                  <CardFooter className="flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 font-medium leading-none">
                          Trending up by 5.2% this month 
                          {/* <TrendingUp className="h-4 w-4" /> */}
                      </div>
                      {/* <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                      </div> */}
                  </CardFooter>
              </Card>
          </div>
      </div>

      <div className='flex w-full mt-5'>
      <Card className='w-full'>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Internships by Start Date</CardTitle>
              <CardDescription>
                Showing total visitors for the last 3 months
              </CardDescription>
            </div>
            <div className="flex">
              {["sem_long", "normal"].map((key) => {
                const chart = key;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig1[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig1}
              className="aspect-auto h-[250px] w-full"
              >
              <LineChart
                accessibilityLayer
                data={chartData1}
                margin={{
                  left: 12,
                  right: 12,
                }}
                >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                      />
                    }
                />
                <Line
                  dataKey={activeChart}
                  type="monotone"
                  stroke={`var(--color-${activeChart})`}
                  strokeWidth={2}
                  dot={false}
                  />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
    </div>
  )
}

export default InternshipCoordinatorDashboard