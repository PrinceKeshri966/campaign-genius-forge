
import { 
  Customer, 
  CUSTOMERS, 
  RuleCondition, 
  SegmentRuleGroup, 
  SegmentRule,
  ConditionOperator,
  LogicalOperator
} from './dummyData';

// Function to evaluate a single condition
export const evaluateCondition = (customer: Customer, condition: RuleCondition): boolean => {
  const { field, operator, value } = condition;
  
  // Handle different field types
  switch (field) {
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'phoneNumber':
      return evaluateStringCondition(customer[field as keyof Customer] as string, operator, value as string);
      
    case 'totalSpend':
    case 'visits':
      return evaluateNumberCondition(customer[field as keyof Customer] as number, operator, value as number);
      
    case 'lastPurchaseDate':
    case 'joinDate':
      return evaluateDateCondition(customer[field as keyof Customer] as string, operator, value as string);
      
    case 'tags':
      return evaluateArrayCondition(customer.tags, operator, value as string);
      
    default:
      return false;
  }
};

// String condition evaluation
const evaluateStringCondition = (value: string, operator: ConditionOperator, compareValue: string): boolean => {
  switch (operator) {
    case 'equals':
      return value === compareValue;
    case 'not_equals':
      return value !== compareValue;
    case 'contains':
      return value.includes(compareValue);
    case 'not_contains':
      return !value.includes(compareValue);
    default:
      return false;
  }
};

// Number condition evaluation
const evaluateNumberCondition = (value: number, operator: ConditionOperator, compareValue: number): boolean => {
  switch (operator) {
    case 'equals':
      return value === compareValue;
    case 'not_equals':
      return value !== compareValue;
    case 'greater_than':
      return value > compareValue;
    case 'less_than':
      return value < compareValue;
    default:
      return false;
  }
};

// Date condition evaluation
const evaluateDateCondition = (valueStr: string, operator: ConditionOperator, compareValueStr: string | [string, string]): boolean => {
  const value = new Date(valueStr).getTime();
  
  if (operator === 'between' && Array.isArray(compareValueStr) && compareValueStr.length === 2) {
    const startDate = new Date(compareValueStr[0]).getTime();
    const endDate = new Date(compareValueStr[1]).getTime();
    return value >= startDate && value <= endDate;
  }
  
  const compareValue = new Date(compareValueStr as string).getTime();
  
  switch (operator) {
    case 'before':
      return value < compareValue;
    case 'after':
      return value > compareValue;
    case 'equals':
      // Compare just the date part (ignoring time)
      return valueStr === compareValueStr;
    default:
      return false;
  }
};

// Array condition evaluation
const evaluateArrayCondition = (value: string[], operator: ConditionOperator, compareValue: string): boolean => {
  switch (operator) {
    case 'contains':
      return value.includes(compareValue);
    case 'not_contains':
      return !value.includes(compareValue);
    default:
      return false;
  }
};

// Evaluate a group of conditions with logical operator
export const evaluateGroup = (customer: Customer, group: SegmentRuleGroup): boolean => {
  if (!group.conditions || group.conditions.length === 0) {
    return false;
  }
  
  if (group.conditions.length === 1) {
    return evaluateCondition(customer, group.conditions[0]);
  }
  
  return group.conditions.reduce((result, condition, index) => {
    const conditionResult = evaluateCondition(customer, condition);
    
    // First condition, just return its result
    if (index === 0) return conditionResult;
    
    // Combine with previous result based on logical operator
    return group.logicalOperator === 'AND' 
      ? result && conditionResult 
      : result || conditionResult;
  }, false);
};

// Evaluate a complex rule with multiple groups
export const evaluateRule = (customer: Customer, rule: SegmentRule): boolean => {
  if (!rule.groups || rule.groups.length === 0) {
    return false;
  }
  
  if (rule.groups.length === 1) {
    return evaluateGroup(customer, rule.groups[0]);
  }
  
  return rule.groups.reduce((result, group, index) => {
    const groupResult = evaluateGroup(customer, group);
    
    // First group, just return its result
    if (index === 0) return groupResult;
    
    // Combine with previous result based on logical operator
    return rule.logicalOperator === 'AND' 
      ? result && groupResult 
      : result || groupResult;
  }, false);
};

// Get matching customers for a segment rule
export const getMatchingCustomers = (rule: SegmentRule): Customer[] => {
  return CUSTOMERS.filter(customer => evaluateRule(customer, rule));
};

// Get the count of customers matching a segment rule
export const getMatchingCustomersCount = (rule: SegmentRule): number => {
  return getMatchingCustomers(rule).length;
};

// Initialize a new segment rule
export const createNewSegmentRule = (): SegmentRule => {
  const conditionId = `condition_${Date.now()}_1_1`;
  const groupId = `group_${Date.now()}_1`;
  const ruleId = `rule_${Date.now()}`;
  
  return {
    id: ruleId,
    groups: [
      {
        id: groupId,
        conditions: [
          {
            id: conditionId,
            field: 'totalSpend',
            operator: 'greater_than',
            value: 1000
          }
        ],
        logicalOperator: 'AND'
      }
    ],
    logicalOperator: 'AND'
  };
};

// Add a new condition to a group
export const addCondition = (
  rule: SegmentRule, 
  groupId: string, 
  field: string = 'totalSpend', 
  operator: ConditionOperator = 'greater_than', 
  value: string | number = 1000
): SegmentRule => {
  const newRule = { ...rule };
  const groupIndex = newRule.groups.findIndex(g => g.id === groupId);
  
  if (groupIndex !== -1) {
    const conditionId = `condition_${Date.now()}_${groupIndex + 1}_${newRule.groups[groupIndex].conditions.length + 1}`;
    
    newRule.groups[groupIndex] = {
      ...newRule.groups[groupIndex],
      conditions: [
        ...newRule.groups[groupIndex].conditions,
        {
          id: conditionId,
          field,
          operator,
          value
        }
      ]
    };
  }
  
  return newRule;
};

// Add a new group to a rule
export const addGroup = (rule: SegmentRule): SegmentRule => {
  const newRule = { ...rule };
  const groupId = `group_${Date.now()}_${newRule.groups.length + 1}`;
  const conditionId = `condition_${Date.now()}_${newRule.groups.length + 1}_1`;
  
  newRule.groups = [
    ...newRule.groups,
    {
      id: groupId,
      conditions: [
        {
          id: conditionId,
          field: 'totalSpend',
          operator: 'greater_than',
          value: 1000
        }
      ],
      logicalOperator: 'AND'
    }
  ];
  
  return newRule;
};

// Update a condition in a group
export const updateCondition = (
  rule: SegmentRule, 
  groupId: string, 
  conditionId: string,
  field?: string,
  operator?: ConditionOperator,
  value?: string | number
): SegmentRule => {
  const newRule = { ...rule };
  const groupIndex = newRule.groups.findIndex(g => g.id === groupId);
  
  if (groupIndex !== -1) {
    const conditionIndex = newRule.groups[groupIndex].conditions.findIndex(c => c.id === conditionId);
    
    if (conditionIndex !== -1) {
      newRule.groups[groupIndex] = {
        ...newRule.groups[groupIndex],
        conditions: newRule.groups[groupIndex].conditions.map((c, i) => {
          if (i === conditionIndex) {
            return {
              ...c,
              field: field !== undefined ? field : c.field,
              operator: operator !== undefined ? operator : c.operator,
              value: value !== undefined ? value : c.value
            };
          }
          return c;
        })
      };
    }
  }
  
  return newRule;
};

// Update the logical operator of a group
export const updateGroupOperator = (
  rule: SegmentRule, 
  groupId: string, 
  logicalOperator: LogicalOperator
): SegmentRule => {
  const newRule = { ...rule };
  const groupIndex = newRule.groups.findIndex(g => g.id === groupId);
  
  if (groupIndex !== -1) {
    newRule.groups[groupIndex] = {
      ...newRule.groups[groupIndex],
      logicalOperator
    };
  }
  
  return newRule;
};

// Update the logical operator of a rule
export const updateRuleOperator = (
  rule: SegmentRule, 
  logicalOperator: LogicalOperator
): SegmentRule => {
  return {
    ...rule,
    logicalOperator
  };
};

// Remove a condition from a group
export const removeCondition = (
  rule: SegmentRule, 
  groupId: string, 
  conditionId: string
): SegmentRule => {
  const newRule = { ...rule };
  const groupIndex = newRule.groups.findIndex(g => g.id === groupId);
  
  if (groupIndex !== -1) {
    // Don't remove if it's the only condition
    if (newRule.groups[groupIndex].conditions.length <= 1) {
      return rule;
    }
    
    newRule.groups[groupIndex] = {
      ...newRule.groups[groupIndex],
      conditions: newRule.groups[groupIndex].conditions.filter(c => c.id !== conditionId)
    };
  }
  
  return newRule;
};

// Remove a group from a rule
export const removeGroup = (
  rule: SegmentRule, 
  groupId: string
): SegmentRule => {
  // Don't remove if it's the only group
  if (rule.groups.length <= 1) {
    return rule;
  }
  
  return {
    ...rule,
    groups: rule.groups.filter(g => g.id !== groupId)
  };
};

// Get available fields for segmentation
export const getAvailableFields = () => [
  { id: 'totalSpend', label: 'Total Spend', type: 'number' },
  { id: 'visits', label: 'Number of Visits', type: 'number' },
  { id: 'lastPurchaseDate', label: 'Last Purchase Date', type: 'date' },
  { id: 'joinDate', label: 'Join Date', type: 'date' },
  { id: 'tags', label: 'Tags', type: 'array' },
  { id: 'firstName', label: 'First Name', type: 'string' },
  { id: 'lastName', label: 'Last Name', type: 'string' },
  { id: 'email', label: 'Email', type: 'string' },
  { id: 'phoneNumber', label: 'Phone Number', type: 'string' },
];

// Get available operators for a field type
export const getAvailableOperators = (fieldType: string) => {
  switch (fieldType) {
    case 'string':
      return [
        { id: 'equals', label: 'equals' },
        { id: 'not_equals', label: 'does not equal' },
        { id: 'contains', label: 'contains' },
        { id: 'not_contains', label: 'does not contain' },
      ];
    case 'number':
      return [
        { id: 'equals', label: 'equals' },
        { id: 'not_equals', label: 'does not equal' },
        { id: 'greater_than', label: 'is greater than' },
        { id: 'less_than', label: 'is less than' },
      ];
    case 'date':
      return [
        { id: 'before', label: 'is before' },
        { id: 'after', label: 'is after' },
        { id: 'between', label: 'is between' },
        { id: 'equals', label: 'is exactly' },
      ];
    case 'array':
      return [
        { id: 'contains', label: 'contains' },
        { id: 'not_contains', label: 'does not contain' },
      ];
    default:
      return [];
  }
};

// Natural language to segment rule converter (simplified)
export const naturalLanguageToRule = (text: string): SegmentRule => {
  // Example implementation - very simplified
  // In a real system, this would use AI to parse the text
  
  const rule = createNewSegmentRule();
  
  // Look for simple patterns
  if (text.includes('spent over') || text.includes('spent more than')) {
    const matches = text.match(/spent (?:over|more than) (?:₹|Rs\.|INR)?(\d+)/i);
    if (matches && matches[1]) {
      const amount = parseInt(matches[1], 10);
      return updateCondition(rule, rule.groups[0].id, rule.groups[0].conditions[0].id, 'totalSpend', 'greater_than', amount);
    }
  }
  
  if (text.includes('inactive') || text.includes('haven\'t purchased')) {
    const matches = text.match(/(?:inactive|haven't purchased)(?:[ a-z]+)(\d+)(?:[ a-z]+)/i);
    const days = matches && matches[1] ? parseInt(matches[1], 10) : 90;
    
    // Calculate the date X days ago
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString().split('T')[0];
    
    return updateCondition(rule, rule.groups[0].id, rule.groups[0].conditions[0].id, 'lastPurchaseDate', 'before', dateStr);
  }
  
  if (text.includes('visited less than') || text.includes('fewer than') || text.includes('less than')) {
    const matches = text.match(/(?:visited |visits |fewer than |less than )(\d+)/i);
    if (matches && matches[1]) {
      const visits = parseInt(matches[1], 10);
      return updateCondition(rule, rule.groups[0].id, rule.groups[0].conditions[0].id, 'visits', 'less_than', visits);
    }
  }
  
  // Default - just return the original rule
  return rule;
};

// Get default value based on field and operator
export const getDefaultValueForField = (field: string, operator: ConditionOperator) => {
  const fieldInfo = getAvailableFields().find(f => f.id === field);
  
  if (!fieldInfo) return '';
  
  switch (fieldInfo.type) {
    case 'number':
      return 1000;
    case 'date':
      return operator === 'between' 
        ? [new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]]
        : new Date().toISOString().split('T')[0];
    case 'array':
      return '';
    case 'string':
      return '';
    default:
      return '';
  }
};
