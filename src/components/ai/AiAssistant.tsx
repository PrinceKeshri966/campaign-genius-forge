
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface AiAssistantProps {
  segmentName: string;
  onApplySuggestion: (suggestion: string) => void;
}

const AiAssistant = ({ segmentName, onApplySuggestion }: AiAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  
  // Sample message suggestions based on campaign types
  const predefinedSuggestions = {
    'win_back': [
      "Hi {firstName}, we haven't seen you in a while! Come back and enjoy 15% off your next purchase with code WELCOME15.",
      "We miss you, {firstName}! Return today and discover our latest collection with an exclusive 10% discount, just for you.",
      "{firstName}, it's been too long! We'd love to welcome you back with a special offer: 20% off your next order with code COMEBACK20."
    ],
    'high_value': [
      "Thank you for being one of our most valued customers, {firstName}! Enjoy an exclusive 25% VIP discount on your next purchase.",
      "{firstName}, as a premium customer, we've prepared a special selection just for you. Explore our curated collection with an extra 20% discount.",
      "Exclusive offer for our VIP customers! {firstName}, enjoy complimentary express shipping and 15% off your next purchase."
    ],
    'new_product': [
      "Exciting news, {firstName}! Our latest collection has just arrived. Be among the first to explore it and get 10% off with code NEWLAUNCH.",
      "{firstName}, we've just launched something we know you'll love! Check out our newest products and enjoy early access with 15% off.",
      "Just launched! {firstName}, discover our newest arrivals before everyone else and enjoy a special 10% discount this week only."
    ]
  };
  
  const handleGenerateSuggestions = () => {
    setIsGenerating(true);
    
    let suggestions: string[];
    
    // Get random suggestions based on the segment name or prompt
    if (prompt.toLowerCase().includes('win back') || prompt.toLowerCase().includes('inactive') || 
        segmentName.toLowerCase().includes('inactive') || segmentName.toLowerCase().includes('at risk')) {
      suggestions = predefinedSuggestions.win_back;
      setAiQuery('Generate messages to win back inactive customers');
    } else if (prompt.toLowerCase().includes('high value') || prompt.toLowerCase().includes('vip') || 
        segmentName.toLowerCase().includes('high value') || segmentName.toLowerCase().includes('vip')) {
      suggestions = predefinedSuggestions.high_value;
      setAiQuery('Generate messages for high value VIP customers');
    } else {
      suggestions = predefinedSuggestions.new_product;
      setAiQuery('Generate messages for new product announcements');
    }
    
    // Simulate AI generation delay
    setTimeout(() => {
      setSuggestions(suggestions);
      setIsGenerating(false);
      toast.success('AI suggestions generated!');
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="space-y-2">
          <label className="text-sm font-medium">What kind of message do you want to create?</label>
          <Textarea
            placeholder="e.g., Win back inactive customers, Promote new products, Exclusive offer for high-value customers..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-muted/50" onClick={() => setPrompt('Win back inactive customers')}>
          Win-back campaign
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted/50" onClick={() => setPrompt('Special offer for high-value customers')}>
          VIP offer
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted/50" onClick={() => setPrompt('Announce new product launch')}>
          New product
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted/50" onClick={() => setPrompt('Limited time discount')}>
          Flash sale
        </Badge>
      </div>
      
      <Button 
        onClick={handleGenerateSuggestions} 
        className="bg-brand-500 hover:bg-brand-600 w-full"
        disabled={isGenerating}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate AI Suggestions'}
      </Button>
      
      {/* Show AI thinking state */}
      {isGenerating && (
        <div className="bg-muted/30 p-6 rounded-md flex flex-col items-center justify-center">
          <div className="flex gap-2 items-center">
            <div className="animate-pulse-gentle h-2 w-2 bg-brand-500 rounded-full"></div>
            <div className="animate-pulse-gentle delay-75 h-2 w-2 bg-brand-500 rounded-full"></div>
            <div className="animate-pulse-gentle delay-150 h-2 w-2 bg-brand-500 rounded-full"></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Generating suggestions...</p>
        </div>
      )}
      
      {/* AI query display */}
      {aiQuery && !isGenerating && (
        <div className="bg-brand-50 p-3 rounded-md">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <p className="text-sm text-brand-700">AI Query: {aiQuery}</p>
          </div>
        </div>
      )}
      
      {/* Suggestions */}
      {suggestions.length > 0 && !isGenerating && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Choose a suggestion to use as your message:</p>
          
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <p className="text-sm">{suggestion}</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="shrink-0"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  Use
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
