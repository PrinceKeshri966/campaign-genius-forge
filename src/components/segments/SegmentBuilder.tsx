
import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import RuleBuilder from './RuleBuilder';
import SegmentPreview from './SegmentPreview';
import { createNewSegmentRule } from '@/utils/segmentUtils';
import { CAMPAIGNS, Campaign, SegmentRule } from '@/utils/dummyData';

const SegmentBuilder = () => {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [rule, setRule] = useState<SegmentRule>(createNewSegmentRule());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRuleChange = (newRule: SegmentRule) => {
    setRule(newRule);
  };

  const handleSubmit = () => {
    if (!segmentName) {
      toast.error('Please enter a segment name');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to create a campaign
    setTimeout(() => {
      // Create a new campaign with current timestamp
      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        name: segmentName,
        segmentRules: [rule],
        audienceSize: Math.floor(Math.random() * 500) + 100, // Random audience size
        createdAt: new Date().toISOString(),
        status: 'draft',
        stats: {
          sent: 0,
          delivered: 0,
          failed: 0,
        },
        message: `Hi {firstName}, here's an exclusive offer for you!`,
        tags: ['new-campaign']
      };

      // In a real app, this would be an API call
      // For now, we'll just simulate it with a toast
      CAMPAIGNS.unshift(newCampaign);
      
      setIsSubmitting(false);
      toast.success('Segment created successfully!');
      navigate('/campaigns');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Create New Segment</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-brand-500 hover:bg-brand-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Segment'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Segment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Details</CardTitle>
              <CardDescription>Define basic information about your segment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="segment-name">Segment Name</Label>
                <Input 
                  id="segment-name" 
                  placeholder="e.g. High Value Customers" 
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment-description">Description (Optional)</Label>
                <Textarea 
                  id="segment-description" 
                  placeholder="Describe the purpose of this segment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Rule Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Rules</CardTitle>
              <CardDescription>Build your audience with flexible rule conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <RuleBuilder rule={rule} onChange={handleRuleChange} />
            </CardContent>
          </Card>
        </div>
        
        {/* Segment Preview */}
        <div className="lg:col-span-1">
          <SegmentPreview rule={rule} />
        </div>
      </div>
    </div>
  );
};

export default SegmentBuilder;
