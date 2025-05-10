
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  getAvailableFields, 
  getAvailableOperators,
  addCondition,
  addGroup,
  updateCondition,
  updateGroupOperator,
  updateRuleOperator,
  removeCondition,
  removeGroup,
  getDefaultValueForField
} from '@/utils/segmentUtils';
import { 
  SegmentRule,
  SegmentRuleGroup,
  RuleCondition,
  LogicalOperator,
  ConditionOperator
} from '@/utils/dummyData';
import { Trash, Plus, X } from 'lucide-react';

interface RuleBuilderProps {
  rule: SegmentRule;
  onChange: (rule: SegmentRule) => void;
}

const RuleBuilder = ({ rule, onChange }: RuleBuilderProps) => {
  const [fields] = useState(getAvailableFields());
  
  const handleAddCondition = (groupId: string) => {
    const newRule = addCondition(rule, groupId);
    onChange(newRule);
  };
  
  const handleAddGroup = () => {
    const newRule = addGroup(rule);
    onChange(newRule);
  };
  
  const handleUpdateCondition = (
    groupId: string,
    conditionId: string,
    field?: string,
    operator?: ConditionOperator,
    value?: string | number
  ) => {
    const newRule = updateCondition(rule, groupId, conditionId, field, operator, value);
    onChange(newRule);
  };
  
  const handleUpdateGroupOperator = (groupId: string, operator: LogicalOperator) => {
    const newRule = updateGroupOperator(rule, groupId, operator);
    onChange(newRule);
  };
  
  const handleUpdateRuleOperator = (operator: LogicalOperator) => {
    const newRule = updateRuleOperator(rule, operator);
    onChange(newRule);
  };
  
  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    const newRule = removeCondition(rule, groupId, conditionId);
    onChange(newRule);
  };
  
  const handleRemoveGroup = (groupId: string) => {
    const newRule = removeGroup(rule, groupId);
    onChange(newRule);
  };
  
  const getFieldType = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.type : 'string';
  };
  
  const renderConditionValue = (condition: RuleCondition, groupId: string) => {
    const fieldType = getFieldType(condition.field);
    
    switch (fieldType) {
      case 'number':
        return (
          <Input 
            type="number" 
            value={condition.value as number} 
            onChange={(e) => handleUpdateCondition(
              groupId, 
              condition.id, 
              undefined, 
              undefined, 
              parseFloat(e.target.value)
            )} 
            className="w-24 md:w-32"
          />
        );
      case 'date':
        if (condition.operator === 'between' && Array.isArray(condition.value)) {
          return (
            <div className="flex items-center gap-2">
              <Input 
                type="date" 
                value={condition.value[0]} 
                onChange={(e) => {
                  const newValue = [...condition.value as string[]];
                  newValue[0] = e.target.value;
                  handleUpdateCondition(groupId, condition.id, undefined, undefined, newValue);
                }} 
                className="w-32"
              />
              <span className="text-sm">and</span>
              <Input 
                type="date" 
                value={condition.value[1]} 
                onChange={(e) => {
                  const newValue = [...condition.value as string[]];
                  newValue[1] = e.target.value;
                  handleUpdateCondition(groupId, condition.id, undefined, undefined, newValue);
                }} 
                className="w-32"
              />
            </div>
          );
        } else {
          return (
            <Input 
              type="date" 
              value={condition.value as string} 
              onChange={(e) => handleUpdateCondition(
                groupId, 
                condition.id, 
                undefined, 
                undefined, 
                e.target.value
              )} 
              className="w-32"
            />
          );
        }
      case 'string':
      case 'array':
      default:
        return (
          <Input 
            type="text" 
            value={condition.value as string} 
            onChange={(e) => handleUpdateCondition(
              groupId, 
              condition.id, 
              undefined, 
              undefined, 
              e.target.value
            )} 
            className="w-32 md:w-48"
          />
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {rule.groups.map((group, groupIndex) => (
        <Card key={group.id} className="border border-border">
          <CardContent className="pt-4 pb-2">
            {/* Group Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {groupIndex > 0 && (
                  <Select 
                    value={rule.logicalOperator} 
                    onValueChange={(value) => handleUpdateRuleOperator(value as LogicalOperator)}
                  >
                    <SelectTrigger className="w-20 h-8 bg-muted/30 mr-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <span className="text-sm font-medium">Group {groupIndex + 1}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleRemoveGroup(group.id)}
                disabled={rule.groups.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Conditions */}
            <div className="space-y-2">
              {group.conditions.map((condition, conditionIndex) => (
                <div key={condition.id} className="flex flex-wrap items-center gap-2">
                  {conditionIndex > 0 && (
                    <Select 
                      value={group.logicalOperator} 
                      onValueChange={(value) => handleUpdateGroupOperator(group.id, value as LogicalOperator)}
                    >
                      <SelectTrigger className="w-20 h-8 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* Field Selection */}
                  <Select 
                    value={condition.field} 
                    onValueChange={(value) => {
                      const fieldType = getFieldType(value);
                      const operators = getAvailableOperators(fieldType);
                      const defaultOperator = operators[0]?.id as ConditionOperator;
                      const defaultValue = getDefaultValueForField(value, defaultOperator);
                      
                      handleUpdateCondition(
                        group.id, 
                        condition.id, 
                        value, 
                        defaultOperator, 
                        defaultValue
                      );
                    }}
                  >
                    <SelectTrigger className="w-32 md:w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Operator Selection */}
                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => {
                      const newValue = getDefaultValueForField(condition.field, value as ConditionOperator);
                      handleUpdateCondition(
                        group.id, 
                        condition.id, 
                        undefined, 
                        value as ConditionOperator, 
                        newValue
                      );
                    }}
                  >
                    <SelectTrigger className="w-32 md:w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableOperators(getFieldType(condition.field)).map((op) => (
                        <SelectItem key={op.id} value={op.id}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Value Input */}
                  {renderConditionValue(condition, group.id)}
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleRemoveCondition(group.id, condition.id)}
                    disabled={group.conditions.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Add Condition Button */}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddCondition(group.id)}
                className="text-xs h-7"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Condition
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Add Group Button */}
      <Button
        variant="outline"
        onClick={handleAddGroup}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Group
      </Button>
    </div>
  );
};

export default RuleBuilder;
