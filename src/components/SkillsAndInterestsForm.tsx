import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, X, Save } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'other';
  yearsOfExperience: number;
}

interface Interest {
  name: string;
  category: 'technology' | 'business' | 'design' | 'marketing' | 'science' | 'arts' | 'sports' | 'travel' | 'food' | 'music' | 'gaming' | 'fitness' | 'education' | 'environment' | 'social-impact' | 'other';
  level: 'casual' | 'moderate' | 'passionate' | 'professional';
}

interface SkillsAndInterestsFormProps {
  initialSkills?: Skill[];
  initialInterests?: Interest[];
  onSave?: (skills: Skill[], interests: Interest[]) => void;
}

const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'language', label: 'Languages' },
  { value: 'other', label: 'Other' }
];

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const INTEREST_CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'science', label: 'Science' },
  { value: 'arts', label: 'Arts' },
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'music', label: 'Music' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'social-impact', label: 'Social Impact' },
  { value: 'other', label: 'Other' }
];

const INTEREST_LEVELS = [
  { value: 'casual', label: 'Casual' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'passionate', label: 'Passionate' },
  { value: 'professional', label: 'Professional' }
];

const SkillsAndInterestsForm: React.FC<SkillsAndInterestsFormProps> = ({
  initialSkills = [],
  initialInterests = [],
  onSave
}) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [interests, setInterests] = useState<Interest[]>(initialInterests);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
  const [newInterest, setNewInterest] = useState<Partial<Interest>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addSkill = () => {
    if (newSkill.name && newSkill.level && newSkill.category) {
      const skill: Skill = {
        name: newSkill.name,
        level: newSkill.level as Skill['level'],
        category: newSkill.category as Skill['category'],
        yearsOfExperience: newSkill.yearsOfExperience || 0
      };
      setSkills([...skills, skill]);
      setNewSkill({});
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (newInterest.name && newInterest.category && newInterest.level) {
      const interest: Interest = {
        name: newInterest.name,
        category: newInterest.category as Interest['category'],
        level: newInterest.level as Interest['level']
      };
      setInterests([...interests, interest]);
      setNewInterest({});
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiService.updateEmployeeSkills(skills, interests);
      toast({
        title: "Success",
        description: "Skills and interests updated successfully!",
      });
      onSave?.(skills, interests);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update skills and interests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Skills</span>
            <Badge variant="secondary">{skills.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Skill */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                placeholder="e.g., JavaScript"
                value={newSkill.name || ''}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="skill-level">Level</Label>
              <Select
                value={newSkill.level || 'intermediate'}
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value as Skill['level'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="skill-category">Category</Label>
              <Select
                value={newSkill.category || 'technical'}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value as Skill['category'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="skill-years">Years</Label>
              <Input
                id="skill-years"
                type="number"
                min="0"
                max="50"
                placeholder="0"
                value={newSkill.yearsOfExperience || ''}
                onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addSkill} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Skills List */}
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-gray-500">
                      {SKILL_CATEGORIES.find(c => c.value === skill.category)?.label} • 
                      {SKILL_LEVELS.find(l => l.value === skill.level)?.label}
                      {skill.yearsOfExperience > 0 && ` • ${skill.yearsOfExperience} years`}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Interests</span>
            <Badge variant="secondary">{interests.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Interest */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <Label htmlFor="interest-name">Interest</Label>
              <Input
                id="interest-name"
                placeholder="e.g., Machine Learning"
                value={newInterest.name || ''}
                onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="interest-category">Category</Label>
              <Select
                value={newInterest.category || 'technology'}
                onValueChange={(value) => setNewInterest({ ...newInterest, category: value as Interest['category'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interest-level">Level</Label>
              <Select
                value={newInterest.level || 'moderate'}
                onValueChange={(value) => setNewInterest({ ...newInterest, level: value as Interest['level'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addInterest} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Interests List */}
          <div className="space-y-2">
            {interests.map((interest, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{interest.name}</div>
                    <div className="text-sm text-gray-500">
                      {INTEREST_CATEGORIES.find(c => c.value === interest.category)?.label} • 
                      {INTEREST_LEVELS.find(l => l.value === interest.level)?.label}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInterest(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="min-w-[120px]">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SkillsAndInterestsForm;
