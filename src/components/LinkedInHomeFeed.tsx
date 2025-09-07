import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';
import LinkedInStylePost from './LinkedInStylePost';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  location: {
    type: string;
    address?: string;
  };
  compensation: {
    type: string;
    amount?: number;
    currency?: string;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    hoursPerWeek?: number;
  };
  organization: {
    _id: string;
    name: string;
    industry: string;
    size: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    logo?: {
      url: string;
    };
  };
  requirements?: {
    skills?: Array<{
      name: string;
      level: string;
      required: boolean;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

interface LinkedInHomeFeedProps {
  userRole?: 'employee' | 'organization';
  onPostOpportunity?: () => void;
}

const LinkedInHomeFeed: React.FC<LinkedInHomeFeedProps> = ({
  userRole = 'employee',
  onPostOpportunity
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    location: 'all',
    industry: 'all'
  });
  const [sortBy, setSortBy] = useState('recent');
  const { toast } = useToast();

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.location && filters.location !== 'all') params.location = filters.location;
      if (filters.industry && filters.industry !== 'all') params.industry = filters.industry;
      if (sortBy) params.sortBy = sortBy;

      const response = await apiService.getOpportunities(params);
      setOpportunities(response.data.opportunities || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [filters, sortBy]);

  const handleSearch = () => {
    fetchOpportunities();
  };

  // Application handling is now done within LinkedInStylePost component

  const handleSave = (postId: string) => {
    toast({
      title: "Saved",
      description: "Opportunity saved to your bookmarks",
    });
    // TODO: Implement save functionality
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Shared",
      description: "Opportunity link copied to clipboard",
    });
    // TODO: Implement share functionality
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      location: 'all',
      industry: 'all'
    });
    setSearchTerm('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunity Feed</h1>
          <p className="text-gray-600">Discover opportunities from top organizations</p>
        </div>
        {userRole === 'organization' && (
          <Button onClick={onPostOpportunity} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search opportunities, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="non-profit">Non-profit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.industry} onValueChange={(value) => setFilters({ ...filters, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort and Clear */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchOpportunities}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {(filters.type !== 'all' || filters.category !== 'all' || filters.location !== 'all' || filters.industry !== 'all' || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.type}
              <button onClick={() => setFilters({ ...filters, type: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <button onClick={() => setFilters({ ...filters, category: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.location !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <button onClick={() => setFilters({ ...filters, location: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.industry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Industry: {filters.industry}
              <button onClick={() => setFilters({ ...filters, industry: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading opportunities...</p>
            </div>
          </div>
        ) : opportunities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          opportunities.map((opportunity) => (
            <LinkedInStylePost
              key={opportunity._id}
              post={opportunity}
              onSave={handleSave}
              onShare={handleShare}
              showActions={userRole === 'employee'}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {opportunities.length > 0 && (
        <div className="text-center py-6">
          <Button variant="outline" size="lg">
            Load More Opportunities
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinkedInHomeFeed;
