import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Heart,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  location: { type: string };
  compensation: { type: string; amount: number; currency: string };
  organization: {
    _id: string;
    name: string;
    industry: string;
    size: string;
    location: { city: string; state: string; country: string };
    logo: { url: string };
  };
  createdAt: string;
  updatedAt: string;
}

const LinkedInHome: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
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

  // Fake opportunities data (same as NewHome)
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
      description: 'Lead product strategy and work with cross-functional teams',
      type: 'Full-time',
      category: 'Product',
      location: { type: 'hybrid' },
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
      description: 'Analyze complex datasets and build machine learning models',
      type: 'Full-time',
      category: 'Data',
      location: { type: 'on-site' },
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
      title: 'Marketing Specialist',
      description: 'Develop and execute marketing campaigns across multiple channels',
      type: 'Full-time',
      category: 'Marketing',
      location: { type: 'hybrid' },
      compensation: { type: 'salary', amount: 65000, currency: 'USD' },
      organization: {
        _id: 'org5',
        name: 'GrowthCo',
        industry: 'Marketing',
        size: '50-100',
        location: { city: 'Austin', state: 'TX', country: 'USA' },
        logo: { url: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=GC' }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const handleSearch = async () => {
    setSearchLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false);
    }, 1000);
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

  const toggleFavorite = (opportunityId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(opportunityId)) {
      newFavorites.delete(opportunityId);
    } else {
      newFavorites.add(opportunityId);
    }
    setFavorites(newFavorites);
  };

  const handleCardClick = (opportunity: Opportunity) => {
    navigate(`/opportunity/${opportunity._id}`);
  };

  const handleQuickApply = (e: React.MouseEvent, opportunity: Opportunity) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    // Handle quick apply logic here
    console.log('Quick apply to:', opportunity.title);
  };

  const formatSalary = (compensation: any) => {
    if (!compensation.amount) return 'Competitive';
    return `$${compensation.amount.toLocaleString()}/${compensation.type === 'salary' ? 'year' : 'hour'}`;
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (end) {
      return `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;
    }
    return `${months[start.getMonth()]} ${start.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Next Opportunity
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Connect with top organizations and find opportunities that match your skills and interests
            </p>
            {user && (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-600">
                  Welcome back, {profile?.personalInfo?.firstName || profile?.name || 'User'}!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <Button 
                onClick={handleSearch} 
                variant="outline" 
                className="rounded-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
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
                  <SelectItem value="engineering" className="rounded-xl mx-2 my-1">Engineering</SelectItem>
                  <SelectItem value="product" className="rounded-xl mx-2 my-1">Product</SelectItem>
                  <SelectItem value="design" className="rounded-xl mx-2 my-1">Design</SelectItem>
                  <SelectItem value="marketing" className="rounded-xl mx-2 my-1">Marketing</SelectItem>
                  <SelectItem value="sales" className="rounded-xl mx-2 my-1">Sales</SelectItem>
                  <SelectItem value="business" className="rounded-xl mx-2 my-1">Business</SelectItem>
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
                  <SelectItem value="technology" className="rounded-xl mx-2 my-1">Technology</SelectItem>
                  <SelectItem value="finance" className="rounded-xl mx-2 my-1">Finance</SelectItem>
                  <SelectItem value="healthcare" className="rounded-xl mx-2 my-1">Healthcare</SelectItem>
                  <SelectItem value="education" className="rounded-xl mx-2 my-1">Education</SelectItem>
                  <SelectItem value="entertainment" className="rounded-xl mx-2 my-1">Entertainment</SelectItem>
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

      {/* Opportunities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fakeOpportunities.map((opportunity) => (
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

              {/* Card Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {opportunity.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="capitalize">{opportunity.location.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{opportunity.organization.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{formatDateRange(opportunity.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-gray-600">4.6</span>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatSalary(opportunity.compensation)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedInHome;
