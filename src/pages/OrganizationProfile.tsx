import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Star,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { toast } from '../hooks/use-toast';

interface Organization {
  _id: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  description: string;
  website?: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
    address?: string;
  };
  logo?: {
    url: string;
  };
  foundedYear?: number;
  employeeCount?: string;
  benefits?: string[];
  culture?: string;
  mission?: string;
  values?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
  requirements: string[];
  benefits: string[];
  schedule: {
    startDate: string;
    endDate?: string;
    hoursPerWeek?: number;
  };
  status: 'open' | 'closed';
  applicants: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

const OrganizationProfile: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organizationId) {
      fetchOrganizationData();
    }
  }, [organizationId]);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch organization details
      const orgResponse = await apiService.getOrganization(organizationId!);
      setOrganization(orgResponse.data);

      // Fetch organization's opportunities
      const oppsResponse = await apiService.getOpportunities({ organizationId: organizationId! });
      setOpportunities(oppsResponse.data.opportunities || []);
    } catch (err: any) {
      console.error('Failed to fetch organization data:', err);
      setError('Failed to load organization profile');
      toast({
        title: "Error",
        description: "Failed to load organization profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCompensationDisplay = (opportunity: Opportunity) => {
    if (opportunity.compensation?.amount && typeof opportunity.compensation.amount === 'number') {
      return `$${opportunity.compensation.amount.toLocaleString()}/month`;
    }
    return 'Competitive';
  };

  const getLocationDisplay = (opportunity: Opportunity) => {
    if (opportunity.location?.address) {
      return opportunity.location.address;
    }
    return `${organization?.location.city}, ${organization?.location.state}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h2>
          <p className="text-gray-600 mb-6">The organization you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">{organization.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.role === 'employee' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Follow
                </Button>
              )}
              {isAuthenticated && user?.role === 'organization' && user._id === organizationId && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/organization-dashboard')}
                >
                  Manage Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Organization Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organization Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    {organization.logo?.url ? (
                      <img 
                        src={organization.logo.url} 
                        alt={organization.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{organization.name}</h2>
                  <p className="text-gray-600 mb-4">{organization.industry}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {organization.location.city}, {organization.location.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{organization.size}</span>
                    </div>
                    {organization.website && (
                      <div className="flex items-center justify-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={organization.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            {organization.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {organization.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mission */}
            {organization.mission && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {organization.mission}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Values */}
            {organization.values && organization.values.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {organization.values.map((value, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {organization.benefits && organization.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {organization.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Opportunities */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Open Opportunities</h3>
              <p className="text-gray-600">
                {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'} available
              </p>
            </div>

            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Open Opportunities</h3>
                  <p className="text-gray-600">
                    This organization doesn't have any open opportunities at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity._id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {opportunity.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{opportunity.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{getLocationDisplay(opportunity)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Posted {formatDate(opportunity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {getCompensationDisplay(opportunity)}
                          </p>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>4.8</span>
                            <span>({opportunity.views} views)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {opportunity.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {opportunity.category}
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {opportunity.status}
                          </Badge>
                          {opportunity.schedule?.hoursPerWeek && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {opportunity.schedule.hoursPerWeek}h/week
                            </Badge>
                          )}
                        </div>
                        {isAuthenticated && user?.role === 'employee' && (
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
