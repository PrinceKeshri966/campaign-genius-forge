
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getMatchingCustomersCount, getMatchingCustomers } from '@/utils/segmentUtils';
import { SegmentRule } from '@/utils/dummyData';
import { Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SegmentPreviewProps {
  rule: SegmentRule;
}

const SegmentPreview = ({ rule }: SegmentPreviewProps) => {
  const [audienceCount, setAudienceCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update the audience count when the rule changes
  useEffect(() => {
    setAudienceCount(getMatchingCustomersCount(rule));
  }, [rule]);
  
  const calculatePercentage = () => {
    // Assuming 200 total customers from dummyData
    return Math.round((audienceCount / 200) * 100);
  };
  
  const sampleCustomers = getMatchingCustomers(rule).slice(0, 5);
  
  return (
    <Card className="h-fit sticky top-6">
      <CardHeader>
        <CardTitle>Audience Preview</CardTitle>
        <CardDescription>See who will receive your campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#e2e8f0" 
                strokeWidth="12" 
                fill="none" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="hsl(var(--primary))" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * calculatePercentage()) / 100}
                transform="rotate(-90 50 50)" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold">{audienceCount}</span>
                <span className="text-xs block text-muted-foreground">customers</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {calculatePercentage()}% of your total customers
            </p>
          </div>
        </div>
        
        {/* Sample Customers */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sample Customers</h4>
          
          <div className="space-y-2">
            {sampleCustomers.length > 0 ? (
              sampleCustomers.map(customer => (
                <div key={customer.id} className="flex items-center p-2 bg-muted/40 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-medium">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{customer.firstName} {customer.lastName}</p>
                    <p className="text-xs text-muted-foreground">₹{customer.totalSpend.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No customers match these criteria
              </div>
            )}
          </div>
          
          {audienceCount > 5 && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-sm">
                  <Eye className="h-3 w-3 mr-1" /> View All {audienceCount} Customers
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Audience Preview</DialogTitle>
                  <DialogDescription>
                    {audienceCount} customers match your segment criteria
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {getMatchingCustomers(rule).map(customer => (
                      <div key={customer.id} className="flex items-center p-2 bg-muted/40 rounded-md">
                        <div className="h-8 w-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-medium">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">{customer.firstName} {customer.lastName}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.email} • Last purchase: {customer.lastPurchaseDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₹{customer.totalSpend.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{customer.visits} visits</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentPreview;
