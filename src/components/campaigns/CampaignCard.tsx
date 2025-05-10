
import { 
  Card, 
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/utils/dummyData';
import { 
  Calendar, 
  ChevronDown, 
  Edit, 
  Eye, 
  Mail,
  Trash, 
  MoreHorizontal
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate delivery rate
  const deliveryRate = campaign.stats.sent > 0 
    ? Math.round((campaign.stats.delivered / campaign.stats.sent) * 100) 
    : 0;
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Campaign Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{campaign.name}</h3>
                <Badge className={getStatusColor(campaign.status)} variant="outline">
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{formatDate(campaign.createdAt)}</span>
              </div>
            </div>
            
            {/* Campaign Stats */}
            <div className="flex flex-wrap gap-4 lg:gap-8">
              <div>
                <p className="text-sm text-muted-foreground">Audience</p>
                <p className="font-medium">{campaign.audienceSize.toLocaleString()}</p>
              </div>
              
              {campaign.status === 'sent' && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <div className="flex items-center">
                      <p className="font-medium">{campaign.stats.delivered.toLocaleString()}</p>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <p className="text-muted-foreground">{campaign.stats.sent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={deliveryRate} className="h-2 w-16" />
                      <span className="font-medium">{deliveryRate}%</span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Tags */}
              <div className="flex items-center gap-1 flex-wrap">
                {campaign.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-brand-50 text-brand-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(true)}>
                <Eye className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Message Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign Preview: {campaign.name}</DialogTitle>
            <DialogDescription>
              Created on {formatDate(campaign.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Message</h4>
              <div className="p-4 bg-muted/30 rounded-md whitespace-pre-line">
                {campaign.message}
              </div>
            </div>
            
            {campaign.status === 'sent' && (
              <div>
                <h4 className="text-sm font-medium mb-1">Delivery Stats</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-3 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Sent</p>
                    <p className="font-semibold">{campaign.stats.sent.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md text-center">
                    <p className="text-sm text-green-600">Delivered</p>
                    <p className="font-semibold text-green-700">{campaign.stats.delivered.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md text-center">
                    <p className="text-sm text-red-600">Failed</p>
                    <p className="font-semibold text-red-700">{campaign.stats.failed.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignCard;
