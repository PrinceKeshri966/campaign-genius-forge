
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CAMPAIGNS } from '@/utils/dummyData';
import CampaignCard from './CampaignCard';
import { Search, Plus, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const CampaignHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  
  // Sort campaigns by creation date, newest first
  const sortedCampaigns = [...CAMPAIGNS].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Filter campaigns based on search query and status filters
  const filteredCampaigns = sortedCampaigns.filter(campaign => {
    // Apply search filter
    const matchesSearch = searchQuery
      ? campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Apply status filters
    const matchesStatus = statusFilters.length > 0
      ? statusFilters.includes(campaign.status)
      : true;
      
    return matchesSearch && matchesStatus;
  });
  
  // Function to toggle a status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(current => 
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Campaign History</h1>
        
        <Button 
          onClick={() => navigate('/campaigns/create')}
          className="bg-brand-500 hover:bg-brand-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {statusFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('sent')}
                onCheckedChange={() => toggleStatusFilter('sent')}
              >
                Sent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('draft')}
                onCheckedChange={() => toggleStatusFilter('draft')}
              >
                Draft
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('scheduled')}
                onCheckedChange={() => toggleStatusFilter('scheduled')}
              >
                Scheduled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Campaign Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Total', 'Sent', 'Scheduled', 'Draft'].map((status, index) => {
          // Calculate counts
          let count;
          switch (status) {
            case 'Total':
              count = CAMPAIGNS.length;
              break;
            case 'Sent':
              count = CAMPAIGNS.filter(c => c.status === 'sent').length;
              break;
            case 'Scheduled':
              count = CAMPAIGNS.filter(c => c.status === 'scheduled').length;
              break;
            case 'Draft':
              count = CAMPAIGNS.filter(c => c.status === 'draft').length;
              break;
          }
          
          return (
            <Card key={status}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{status} Campaigns</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-brand-100 text-brand-500' :
                  index === 1 ? 'bg-green-100 text-green-500' :
                  index === 2 ? 'bg-blue-100 text-blue-500' :
                  'bg-orange-100 text-orange-500'
                }`}>
                  {index === 0 && <span className="text-lg font-bold">#</span>}
                  {index === 1 && <span className="text-lg font-bold">✓</span>}
                  {index === 2 && <span className="text-lg font-bold">⏱</span>}
                  {index === 3 && <span className="text-lg font-bold">D</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        ) : (
          <div className="text-center py-10 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium">No campaigns found</h3>
            <p className="text-muted-foreground">Try changing your filters or create a new campaign</p>
            <Button 
              className="mt-4 bg-brand-500 hover:bg-brand-600" 
              onClick={() => navigate('/campaigns/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignHistory;
