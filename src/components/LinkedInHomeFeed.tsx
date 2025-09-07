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
                  className="pl-10 rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                />
              </div>
              <Button onClick={handleSearch} variant="outline" className="rounded-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                  <SelectItem value="all" className="rounded-xl mx-2 my-1">All Types</SelectItem>
                  <SelectItem value="full-time" className="rounded-xl mx-2 my-1">Full-time</SelectItem>
                  <SelectItem value="part-time" className="rounded-xl mx-2 my-1">Part-time</SelectItem>
                  <SelectItem value="contract" className="rounded-xl mx-2 my-1">Contract</SelectItem>
                  <SelectItem value="internship" className="rounded-xl mx-2 my-1">Internship</SelectItem>
                  <SelectItem value="volunteer" className="rounded-xl mx-2 my-1">Volunteer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                  <SelectItem value="all" className="rounded-xl mx-2 my-1">All Categories</SelectItem>
                  <SelectItem value="technology" className="rounded-xl mx-2 my-1">Technology</SelectItem>
                  <SelectItem value="business" className="rounded-xl mx-2 my-1">Business</SelectItem>
                  <SelectItem value="design" className="rounded-xl mx-2 my-1">Design</SelectItem>
                  <SelectItem value="marketing" className="rounded-xl mx-2 my-1">Marketing</SelectItem>
                  <SelectItem value="education" className="rounded-xl mx-2 my-1">Education</SelectItem>
                  <SelectItem value="healthcare" className="rounded-xl mx-2 my-1">Healthcare</SelectItem>
                  <SelectItem value="non-profit" className="rounded-xl mx-2 my-1">Non-profit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                  <SelectItem value="all" className="rounded-xl mx-2 my-1">All Locations</SelectItem>
                  <SelectItem value="remote" className="rounded-xl mx-2 my-1">Remote</SelectItem>
                  <SelectItem value="on-site" className="rounded-xl mx-2 my-1">On-site</SelectItem>
                  <SelectItem value="hybrid" className="rounded-xl mx-2 my-1">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.industry} onValueChange={(value) => setFilters({ ...filters, industry: value })}>
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                  <SelectItem value="all" className="rounded-xl mx-2 my-1">All Industries</SelectItem>
                  <SelectItem value="Technology" className="rounded-xl mx-2 my-1">Technology</SelectItem>
                  <SelectItem value="Finance" className="rounded-xl mx-2 my-1">Finance</SelectItem>
                  <SelectItem value="Healthcare" className="rounded-xl mx-2 my-1">Healthcare</SelectItem>
                  <SelectItem value="Education" className="rounded-xl mx-2 my-1">Education</SelectItem>
                  <SelectItem value="Entertainment" className="rounded-xl mx-2 my-1">Entertainment</SelectItem>
                  <SelectItem value="Automotive" className="rounded-xl mx-2 my-1">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort and Clear */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                    <SelectItem value="recent" className="rounded-xl mx-2 my-1">Most Recent</SelectItem>
                    <SelectItem value="popular" className="rounded-xl mx-2 my-1">Most Popular</SelectItem>
                    <SelectItem value="salary" className="rounded-xl mx-2 my-1">Highest Salary</SelectItem>
                    <SelectItem value="deadline" className="rounded-xl mx-2 my-1">Deadline</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                  Clear Filters
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchOpportunities} className="rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
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
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-4 py-2 bg-blue-100 text-blue-800 border border-blue-200">
              Search: {searchTerm}
              <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-4 py-2 bg-green-100 text-green-800 border border-green-200">
              Type: {filters.type}
              <button onClick={() => setFilters({ ...filters, type: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-4 py-2 bg-purple-100 text-purple-800 border border-purple-200">
              Category: {filters.category}
              <button onClick={() => setFilters({ ...filters, category: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.location !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-4 py-2 bg-orange-100 text-orange-800 border border-orange-200">
              Location: {filters.location}
              <button onClick={() => setFilters({ ...filters, location: 'all' })} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          {filters.industry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-4 py-2 bg-pink-100 text-pink-800 border border-pink-200">
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
