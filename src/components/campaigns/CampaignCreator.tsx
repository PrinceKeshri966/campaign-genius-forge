
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiAssistant from '../ai/AiAssistant';
import { Campaign, CAMPAIGNS } from '@/utils/dummyData';

interface CampaignCreatorProps {
  segmentId?: string;
}

const CampaignCreator = ({ segmentId }: CampaignCreatorProps) => {
  const navigate = useNavigate();
  
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  
  // Mocked values for now - in a real app these would come from the segment
  const audienceSize = 768;
  const segmentName = "High Value Customers";
  
  const handleApplySuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };
  
  const handleMessageChange = (value: string) => {
    setMessage(value);
  };
  
  const handleSendCampaign = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    if (!message) {
      toast.error("Please enter a message");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to create and send a campaign
    setTimeout(() => {
      // Create a new campaign
      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        name: campaignName,
        segmentRules: [], // In a real app, this would be the actual segment rules
        audienceSize,
        createdAt: new Date().toISOString(),
        status: 'sent',
        stats: {
          sent: audienceSize,
          delivered: Math.floor(audienceSize * 0.9), // 90% delivered
          failed: Math.floor(audienceSize * 0.1), // 10% failed
        },
        message,
        subject,
        tags: ['campaign', 'automated'],
      };
      
      // In a real app, this would be an API call
      // For now, we'll just add to our array
      CAMPAIGNS.unshift(newCampaign);
      
      setIsSubmitting(false);
      toast.success('Campaign sent successfully!');
      navigate('/campaigns');
    }, 1500);
  };
  
  const handleSaveDraft = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to save draft
    setTimeout(() => {
      // Create a draft campaign
      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        name: campaignName,
        segmentRules: [], // In a real app, this would be the actual segment rules
        audienceSize,
        createdAt: new Date().toISOString(),
        status: 'draft',
        stats: {
          sent: 0,
          delivered: 0,
          failed: 0,
        },
        message: message || "Draft message",
        subject: subject || "Draft subject",
        tags: ['draft'],
      };
      
      // Add to our campaigns array
      CAMPAIGNS.unshift(newCampaign);
      
      setIsSubmitting(false);
      toast.success('Draft saved successfully!');
      navigate('/campaigns');
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={handleSendCampaign}
            className="bg-brand-500 hover:bg-brand-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Campaign'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Campaign Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Enter the basic information for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="e.g. Summer Sale Announcement" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is for your reference only and won't be visible to customers.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input 
                  id="email-subject" 
                  placeholder="e.g. Don't Miss Our Exclusive Summer Sale!" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Message Composer */}
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Message</CardTitle>
                    <CardDescription>Craft your campaign message</CardDescription>
                  </div>
                  <TabsList>
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <TabsContent value="compose" className="mt-0">
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter your message here..." 
                      className="min-h-[200px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-2">Available personalization tags:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-brand-100 text-brand-700">
                          {'{firstName}'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-brand-100 text-brand-700">
                          {'{lastName}'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-brand-100 text-brand-700">
                          {'{email}'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <AiAssistant 
                    segmentName={segmentName} 
                    onApplySuggestion={handleApplySuggestion} 
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {/* Audience Information */}
          <Card className="h-fit sticky top-6">
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
              <CardDescription>Overview of your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-md space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Segment</p>
                  <p className="font-medium">{segmentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Audience Size</p>
                  <p className="font-medium">{audienceSize.toLocaleString()} customers</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">~{Math.ceil(audienceSize / 100)} minutes</p>
                </div>
              </div>
              
              <div className="bg-brand-50 border border-brand-100 p-4 rounded-md">
                <h4 className="font-medium text-brand-800 mb-2">Message Preview</h4>
                <div className="bg-white p-3 rounded-md border border-brand-100 text-sm">
                  {message ? (
                    <p>{message.replace('{firstName}', 'John')}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No message content yet</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendCampaign} 
                className="w-full bg-brand-500 hover:bg-brand-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Campaign'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
