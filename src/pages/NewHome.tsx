import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Building2, Briefcase, Star, Heart, Filter, ArrowRight, Clock, Users, TrendingUp } from 'lucide-react';
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      // Generate 20 fake opportunities
      const fakeOpportunities: Opportunity[] = [
        {
          _id: '1',
          title: 'Senior Software Engineer',
          description: 'Build scalable web applications using React and Node.js',
          type: 'Full-time',
          category: 'Engineering',
          location: { type: 'remote' },
          compensation: { type: 'salary', amount: 120000, currency: 'USD' },
          organization: {
            _id: 'org1',
            name: 'TechCorp',
            industry: 'Technology',
            size: '100-500',
            location: { city: 'San Francisco', state: 'CA', country: 'USA' },
            logo: { url: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=TC' }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Product Manager',
          description: 'Lead product strategy and development for our mobile app',
          type: 'Full-time',
          category: 'Product',
          location: { type: 'hybrid', address: 'New York, NY' },
          compensation: { type: 'salary', amount: 140000, currency: 'USD' },
          organization: {
            _id: 'org2',
            name: 'InnovateLab',
            industry: 'Technology',
            size: '50-100',
            location: { city: 'New York', state: 'NY', country: 'USA' },
            logo: { url: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=IL' }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'UX Designer',
          description: 'Create beautiful and intuitive user experiences',
          type: 'Contract',
          category: 'Design',
          location: { type: 'remote' },
          compensation: { type: 'hourly', amount: 75, currency: 'USD' },
          organization: {
            _id: 'org3',
            name: 'DesignStudio',
            industry: 'Design',
            size: '10-50',
            location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
            logo: { url: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=DS' }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '4',
          title: 'Data Scientist',
          description: 'Analyze large datasets and build machine learning models',
          type: 'Full-time',
          category: 'Data',
          location: { type: 'on-site', address: 'Seattle, WA' },
          compensation: { type: 'salary', amount: 130000, currency: 'USD' },
          organization: {
            _id: 'org4',
            name: 'DataFlow',
            industry: 'Technology',
            size: '500+',
            location: { city: 'Seattle', state: 'WA', country: 'USA' },
            logo: { url: 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=DF' }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '5',
          title: 'Marketing Manager',
          description: 'Develop and execute digital marketing campaigns',
          type: 'Full-time',
          category: 'Marketing',
          location: { type: 'hybrid', address: 'Chicago, IL' },
          compensation: { type: 'salary', amount: 85000, currency: 'USD' },
          organization: {
            _id: 'org5',
            name: 'GrowthCo',
            industry: 'Marketing',
            size: '50-100',
            location: { city: 'Chicago', state: 'IL', country: 'USA' },
            logo: { url: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=GC' }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setOpportunities(fakeOpportunities);
        setLoading(false);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch opportunities",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [filters, sortBy]);

  const handleSearch = async () => {
    setSearchLoading(true);
    await fetchOpportunities();
    setSearchLoading(false);
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      location: 'all',
      industry: 'all'
    });
    setSearchTerm('');
    fetchOpportunities();
  };

  const toggleFavorite = (opportunityId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(opportunityId)) {
      newFavorites.delete(opportunityId);
      toast({
        title: "Removed from favorites",
        description: "Opportunity removed from your saved list",
      });
    } else {
      newFavorites.add(opportunityId);
      toast({
        title: "Added to favorites",
        description: "Opportunity saved to your favorites",
      });
    }
    setFavorites(newFavorites);
  };

  const handleCardClick = (opportunity: Opportunity) => {
    navigate(`/organization/${opportunity.organization._id}`);
  };

  const handleQuickApply = (e: React.MouseEvent, opportunity: Opportunity) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toast({
      title: "Quick Apply",
      description: `Applied to ${opportunity.title} at ${opportunity.organization.name}`,
    });
  };

  const getLocationDisplay = (opportunity: Opportunity) => {
    if (opportunity.location?.address) {
      return opportunity.location.address;
    }
    return `${opportunity.organization.location.city}, ${opportunity.organization.location.state}`;
  };

  const getCompensationDisplay = (opportunity: Opportunity) => {
    if (opportunity.compensation?.amount && typeof opportunity.compensation.amount === 'number') {
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
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                onClick={() => navigate('/')}
              >
                Inkaranya
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              {/* Home Icon Button */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                title="Home"
              >
                <Building2 className="h-5 w-5" />
              </Button>

              {/* Sign In / Dashboard Button */}
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/home')}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105 rounded-full px-4"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105 rounded-full px-4"
                >
                  Sign In
                </Button>
              )}

              {/* Post Opportunities Button */}
              {user?.role === 'organization' && (
                <Button 
                  onClick={() => navigate('/organization-dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Jobs
                </Button>
              )}
              
              {/* Interactive Icons */}
              <div className="flex items-center space-x-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  title="Language"
                >
                  🌐
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  title="Menu"
                >
                  ☰
                </Button>
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/home')}
                    className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                    title="Profile"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                    title="Sign In"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                )}
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
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/login')}
                className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-full px-8"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search opportunities, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={searchLoading}
                className="rounded-full border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 px-6"
              >
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 hover:shadow-md">
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
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 hover:shadow-md">
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
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 hover:shadow-md">
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
                <SelectTrigger className="rounded-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 hover:shadow-md">
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
              <div 
                key={opportunity._id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-xl hover:scale-105 hover:border-blue-200 ${
                  hoveredCard === opportunity._id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => handleCardClick(opportunity)}
                onMouseEnter={() => setHoveredCard(opportunity._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Placeholder for image - using a colored background with icon */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                  <Building2 className="h-16 w-16 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 ${
                        favorites.has(opportunity._id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(opportunity._id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(opportunity._id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickApply(e, opportunity);
                      }}
                    >
                      <ArrowRight className="h-4 w-4 text-blue-600" />
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
