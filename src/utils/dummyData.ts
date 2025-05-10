
// Mock customer data
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalSpend: number;
  visits: number;
  lastPurchaseDate: string;
  tags: string[];
  joinDate: string;
}

// Mock order data
export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  amount: number;
  items: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
}

// Campaign data
export interface Campaign {
  id: string;
  name: string;
  segmentRules: SegmentRule[];
  audienceSize: number;
  createdAt: string;
  status: 'draft' | 'sent' | 'scheduled';
  stats: {
    sent: number;
    delivered: number;
    failed: number;
  };
  message: string;
  subject?: string;
  tags: string[];
}

// Segment rule types
export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'before' | 'after' | 'between';
export type LogicalOperator = 'AND' | 'OR';

// Segment rule definition
export interface RuleCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | string[];
}

export interface SegmentRuleGroup {
  id: string;
  conditions: RuleCondition[];
  logicalOperator: LogicalOperator;
}

export interface SegmentRule {
  id: string;
  groups: SegmentRuleGroup[];
  logicalOperator: LogicalOperator;
}

// Generate random customers
const generateCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  const tags = ['new', 'returning', 'vip', 'at_risk', 'churned', 'high_value'];
  
  for (let i = 0; i < count; i++) {
    const firstName = ['John', 'Jane', 'Mike', 'Emily', 'Alex', 'Sarah', 'David', 'Lisa', 'Tom', 'Rachel', 'Mohit', 'Priya', 'Raj', 'Ananya'][Math.floor(Math.random() * 14)];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Sharma', 'Patel', 'Kumar', 'Singh'][Math.floor(Math.random() * 14)];
    
    // Generate a date between 1-1000 days ago
    const joinDaysAgo = Math.floor(Math.random() * 1000) + 1;
    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - joinDaysAgo);
    
    // Generate a date between join date and now for last purchase
    const lastPurchaseDaysAgo = Math.floor(Math.random() * joinDaysAgo);
    const lastPurchaseDate = new Date();
    lastPurchaseDate.setDate(lastPurchaseDate.getDate() - lastPurchaseDaysAgo);
    
    // Random customer tags (0-3 tags)
    const numTags = Math.floor(Math.random() * 4);
    const customerTags = [];
    for (let j = 0; j < numTags; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!customerTags.includes(tag)) {
        customerTags.push(tag);
      }
    }
    
    // High-value customers (10% chance)
    const isHighValue = Math.random() < 0.1;
    const totalSpend = isHighValue ? 
      Math.floor(Math.random() * 50000) + 10000 : 
      Math.floor(Math.random() * 9000) + 1000;
    
    // Generate random visits (1-50)
    const visits = Math.floor(Math.random() * 50) + 1;
    
    customers.push({
      id: `cust_${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      totalSpend,
      visits,
      lastPurchaseDate: lastPurchaseDate.toISOString().split('T')[0],
      tags: customerTags,
      joinDate: joinDate.toISOString().split('T')[0],
    });
  }
  
  return customers;
};

// Generate random orders
const generateOrders = (customers: Customer[], count: number): Order[] => {
  const orders: Order[] = [];
  const statuses: ('completed' | 'pending' | 'cancelled')[] = ['completed', 'pending', 'cancelled'];
  const paymentMethods = ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod'];
  
  for (let i = 0; i < count; i++) {
    // Pick a random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Generate a date between customer join date and now
    const customerJoinDate = new Date(customer.joinDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - customerJoinDate.getTime()) / (1000 * 60 * 60 * 24));
    const orderDaysAgo = Math.floor(Math.random() * (daysDiff + 1));
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - orderDaysAgo);
    
    // Random order amount (₹500 - ₹10000)
    const amount = Math.floor(Math.random() * 9500) + 500;
    
    // Random number of items (1-10)
    const items = Math.floor(Math.random() * 10) + 1;
    
    // Random status
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random payment method
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    orders.push({
      id: `ord_${i + 1}`,
      customerId: customer.id,
      orderDate: orderDate.toISOString().split('T')[0],
      amount,
      items,
      status,
      paymentMethod,
    });
  }
  
  return orders;
};

// Generate random campaigns
const generateCampaigns = (): Campaign[] => {
  const campaignNames = [
    'Summer Sale Announcement',
    'Win-Back Inactive Customers',
    'New Product Launch',
    'Customer Loyalty Rewards',
    'Holiday Special Offer',
    'Feedback Request',
    'Post-Purchase Follow-up',
    'VIP Customer Appreciation',
    'Seasonal Collection Preview',
    'Limited-Time Discount'
  ];
  
  const messages = [
    'Hi {firstName}, enjoy 10% off your next purchase with code SUMMER10!',
    'We miss you, {firstName}! Come back and get 15% off with code COMEBACK15.',
    'Exciting news, {firstName}! Our new collection just launched. Check it out now!',
    'Thank you for being a loyal customer, {firstName}! Enjoy a special 20% discount.',
    'Happy holidays, {firstName}! Use code HOLIDAY20 for 20% off sitewide.',
    'We value your opinion, {firstName}. Take our quick survey for a chance to win ₹500 off.',
    'Thanks for your purchase, {firstName}! How did we do? Leave a review and get 10% off next time.',
    '{firstName}, as a VIP customer, enjoy exclusive early access to our new arrivals!',
    'Fall collection is here, {firstName}! Shop now before items sell out.',
    'Flash sale alert, {firstName}! 25% off for the next 24 hours only.'
  ];
  
  const campaigns: Campaign[] = [];
  
  // Create 10 random campaigns
  for (let i = 0; i < 10; i++) {
    const name = campaignNames[i];
    const message = messages[i];
    
    // Random creation date in the past 60 days
    const createdDaysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - createdDaysAgo);
    
    // Random audience size between 100-2000
    const audienceSize = Math.floor(Math.random() * 1900) + 100;
    
    // Random stats based on audience size
    const sent = Math.floor(audienceSize * (Math.random() * 0.2 + 0.8)); // 80-100% sent
    const delivered = Math.floor(sent * (Math.random() * 0.2 + 0.8)); // 80-100% of sent delivered
    const failed = sent - delivered;
    
    // Random status
    const status = (i < 2) ? 'draft' : ((i < 4) ? 'scheduled' : 'sent');
    
    // Random tags
    const allTags = ['promotional', 'informational', 'win-back', 'loyalty', 'special-offer', 'feedback', 'announcement'];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags: string[] = [];
    
    for (let j = 0; j < numTags; j++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    // Create a simple segment rule for demonstration
    const segmentRule: SegmentRule = {
      id: `rule_${i + 1}`,
      groups: [
        {
          id: `group_${i + 1}_1`,
          conditions: [
            {
              id: `condition_${i + 1}_1_1`,
              field: i % 3 === 0 ? 'totalSpend' : (i % 3 === 1 ? 'lastPurchaseDate' : 'visits'),
              operator: i % 3 === 0 ? 'greater_than' : (i % 3 === 1 ? 'before' : 'less_than'),
              value: i % 3 === 0 ? 5000 : (i % 3 === 1 ? '2023-01-01' : 5)
            }
          ],
          logicalOperator: 'AND'
        }
      ],
      logicalOperator: 'AND'
    };
    
    campaigns.push({
      id: `camp_${i + 1}`,
      name,
      segmentRules: [segmentRule],
      audienceSize,
      createdAt: createdAt.toISOString(),
      status,
      stats: {
        sent,
        delivered,
        failed
      },
      message,
      subject: `${name} - Special Offer Inside!`,
      tags
    });
  }
  
  return campaigns;
};

// Generate the data
export const CUSTOMERS = generateCustomers(200);
export const ORDERS = generateOrders(CUSTOMERS, 500);
export const CAMPAIGNS = generateCampaigns();

// Analytics data
export const ANALYTICS = {
  customerCount: CUSTOMERS.length,
  activeCustomers: CUSTOMERS.filter(c => {
    const lastPurchase = new Date(c.lastPurchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastPurchase.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  }).length,
  totalRevenue: ORDERS.reduce((sum, order) => sum + order.amount, 0),
  averageOrderValue: Math.floor(ORDERS.reduce((sum, order) => sum + order.amount, 0) / ORDERS.length),
  
  // Monthly revenue for the last 6 months
  revenueByMonth: [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 162000 },
    { month: 'Apr', revenue: 148000 },
    { month: 'May', revenue: 172000 },
    { month: 'Jun', revenue: 189000 },
  ],
  
  // Customer segments
  customerSegments: [
    { name: 'New', value: 42 },
    { name: 'Returning', value: 78 },
    { name: 'VIP', value: 15 },
    { name: 'At Risk', value: 25 },
    { name: 'Churned', value: 40 },
  ],
  
  // Campaign performance
  campaignPerformance: CAMPAIGNS.filter(c => c.status === 'sent').map(c => ({
    name: c.name,
    sent: c.stats.sent,
    delivered: c.stats.delivered,
    failed: c.stats.failed,
  })),
};
