import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Building2, Briefcase, Star, Heart, Filter } from 'lucide-react';
import apiService from '../services/api';
import { toast } from '../hooks/use-toast';

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
  createdAt: string;
  updatedAt: string;
}

const NewHome: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      location: 'all',
      industry: 'all'
    });
    setSearchTerm('');
  };

  const getLocationDisplay = (opportunity: Opportunity) => {
    if (opportunity.location?.address) {
      return opportunity.location.address;
    }
    return `${opportunity.organization.location.city}, ${opportunity.organization.location.state}`;
  };

  const getCompensationDisplay = (opportunity: Opportunity) => {
    if (opportunity.compensation?.amount) {
      return `$${opportunity.compensation.amount.toLocaleString()}/month`;
    }
    return 'Competitive';
  };

  const getRating = () => {
    return (4.5 + Math.random() * 0.5).toFixed(1);
  };

  const getDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + Math.floor(Math.random() * 30));
    const end = new Date(start);
    end.setDate(end.getDate() + 5);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
                Inkaranya
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-blue-600"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Button>
              {user?.role === 'organization' && (
                <Button 
                  onClick={() => navigate('/organization-dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Post opportunities
                </Button>
              )}
              
              {/* Icons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  🌐
                </Button>
                <Button variant="ghost" size="sm">
                  ☰
                </Button>
                <Button variant="ghost" size="sm">
                  👤
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            A Platform for Experiential Learning
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Discover opportunities that match your skills and interests
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.type !== 'all' || filters.category !== 'all' || filters.location !== 'all' || filters.industry !== 'all' || searchTerm) && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>
        </div>
      )}

      {/* Main Content - Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading opportunities...</p>
            </div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                {/* Placeholder for image - using a colored background with icon */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                  <Building2 className="h-16 w-16 text-blue-600" />
                  <div className="absolute top-3 right-3">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {getLocationDisplay(opportunity)}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        Hosted by {opportunity.organization.name}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {getDates()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-black fill-current" />
                      <span className="text-xs font-medium">{getRating()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {opportunity.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {opportunity.type} • {opportunity.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {getCompensationDisplay(opportunity)}
                      </p>
                      <p className="text-xs text-gray-600">month</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewHome;
