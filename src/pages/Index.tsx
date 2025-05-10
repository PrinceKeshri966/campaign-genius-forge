
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ANALYTICS, CAMPAIGNS } from '@/utils/dummyData';
import { naturalLanguageToRule, getMatchingCustomersCount } from '@/utils/segmentUtils';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart as ReBarChart, CartesianGrid, Cell, Legend, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Login from '@/components/auth/Login';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nlPrompt, setNlPrompt] = useState('');
  const navigate = useNavigate();
  
  const handleCreateSegment = () => {
    navigate('/segments/create');
  };
  
  const handleCreateCampaign = () => {
    navigate('/campaigns/create');
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Generate audience size for natural language input
  const handleNaturalLanguageQuery = () => {
    if (!nlPrompt) return;
    
    const rule = naturalLanguageToRule(nlPrompt);
    const count = getMatchingCustomersCount(rule);
    
    // Here we'd navigate to segment creation with the rule
    navigate('/segments/create');
  };
  
  // If not logged in, show login screen
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  // Colors for the charts
  const COLORS = ['#9b87f5', '#6E59A5', '#4A36A3', '#1A1F2C'];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome to CampaignGenius</h1>
            <p className="text-muted-foreground">Your intelligent campaign management platform</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCreateSegment}>
              Create Segment
            </Button>
            <Button 
              onClick={handleCreateCampaign}
              className="bg-brand-500 hover:bg-brand-600"
            >
              Create Campaign
            </Button>
          </div>
        </div>
        
        {/* AI-powered Natural Language Segment */}
        <Card className="bg-gradient-to-r from-brand-50 to-brand-100 border-brand-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center px-4 py-2">
              <h2 className="text-xl font-bold text-brand-800 mb-2">AI-Powered Segment Creation</h2>
              <p className="text-brand-700 mb-4">Describe your audience in plain language and let AI build the segment for you</p>
              
              <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 items-center">
                <input 
                  type="text"
                  className="flex-1 px-4 py-2 rounded-md border border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                  placeholder="e.g., customers who spent over ₹5000 and haven't purchased in 90 days"
                  value={nlPrompt}
                  onChange={(e) => setNlPrompt(e.target.value)}
                />
                <Button 
                  className="bg-brand-500 hover:bg-brand-600 whitespace-nowrap"
                  onClick={handleNaturalLanguageQuery}
                >
                  Find Audience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-3xl font-bold">{ANALYTICS.customerCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{ANALYTICS.activeCustomers} active in last 90 days</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{ANALYTICS.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">↑ 12% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-3xl font-bold">₹{ANALYTICS.averageOrderValue.toLocaleString()}</p>
                <p className="text-xs text-green-600">↑ 5% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Campaigns Sent</p>
                <p className="text-3xl font-bold">{CAMPAIGNS.filter(c => c.status === 'sent').length}</p>
                <p className="text-xs text-muted-foreground">
                  {CAMPAIGNS.filter(c => c.status === 'draft').length} drafts,{' '}
                  {CAMPAIGNS.filter(c => c.status === 'scheduled').length} scheduled
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ANALYTICS.revenueByMonth}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#9b87f5" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Distribution of customer types</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={ANALYTICS.customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ANALYTICS.customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} customers`, 'Count']}
                      labelFormatter={(label) => `Segment: ${label}`}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Delivery metrics of recent campaigns</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={ANALYTICS.campaignPerformance.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="delivered" stackId="a" name="Delivered" fill="#4ade80" />
                  <Bar dataKey="failed" stackId="a" name="Failed" fill="#f87171" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
