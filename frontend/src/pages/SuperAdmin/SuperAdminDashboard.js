import React,{useState, useEffect} from 'react'

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
import SuperAdminSidebar from '../../components/SuperAdminSidebar';
import TopSuperAdminSidebar from '../../components/TopSuperAdmin';

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartData1 = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]
const chartConfig1 = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}


const SuperAdminDashboard = () => {
  const [totalInternships, setTotalInternships] = useState([]);
  const [activeInternships, setActiveInternships] = useState([]);
  const [completedInternships, setCompletedInternships] = useState([])
  const [activeChart, setActiveChart] = useState("desktop");
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
      desktop: chartData1.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData1.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <SuperAdminSidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopSuperAdminSidebar/>
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
              {["desktop", "mobile"].map((key) => {
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

export default SuperAdminDashboard