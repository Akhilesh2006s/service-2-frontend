import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  DollarSign,
  Calendar,
  Briefcase,
  Star,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';
import ApplicationModal from '../components/ApplicationModal';

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
    description?: string;
    website?: string;
  };
  requirements?: {
    skills?: Array<{
      name: string;
      level: string;
      required: boolean;
    }>;
    experience?: string | {
      minYears: number;
      required: boolean;
    };
    education?: string;
  };
  benefits?: string[];
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      // Fetch real opportunity data from API
      const response = await apiService.getOpportunity(id);
      setOpportunity(response.data.opportunity);
    } catch (error: any) {
      console.error('Error fetching opportunity:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch opportunity details",
        variant: "destructive",
      });
      // Fallback to null if API fails
      setOpportunity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    console.log('Apply button clicked in OpportunityDetail');
    console.log('User:', user);
    console.log('User role:', user?.role);
    
    if (!user) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }
    if (user.role !== 'employee') {
      console.log('User is not employee, showing access denied');
      toast({
        title: "Access Denied",
        description: "Only employees can apply to opportunities",
        variant: "destructive",
      });
      return;
    }
    console.log('Setting modal to true');
    setShowApplicationModal(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved",
      description: isSaved ? "Opportunity removed from your saved items" : "Opportunity saved to your bookmarks",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity?.title,
        text: `Check out this opportunity: ${opportunity?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Opportunity link copied to clipboard",
      });
    }
  };

  const formatSalary = (compensation: any) => {
    if (!compensation || !compensation.amount) return 'Competitive';
    
    // Handle different compensation types
    if (compensation.type === 'salary') {
      return `$${compensation.amount.toLocaleString()}/year`;
    } else if (compensation.type === 'hourly') {
      return `$${compensation.amount.toLocaleString()}/hour`;
    } else if (compensation.type === 'monthly') {
      return `$${compensation.amount.toLocaleString()}/month`;
    } else {
      return `$${compensation.amount.toLocaleString()}/${compensation.type || 'period'}`;
    }
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
          <p className="text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity not found</h2>
          <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/home')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Opportunities
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{opportunity.title}</CardTitle>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span>{opportunity.organization.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">{opportunity.location.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{opportunity.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatSalary(opportunity.compensation)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {opportunity.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {opportunity.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {opportunity.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunity.requirements.experience && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-700">
                        {typeof opportunity.requirements.experience === 'string' 
                          ? opportunity.requirements.experience 
                          : `${opportunity.requirements.experience.minYears || 'N/A'} years experience${opportunity.requirements.experience.required ? ' (required)' : ''}`
                        }
                      </p>
                    </div>
                  )}
                  
                  {opportunity.requirements.education && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                      <p className="text-gray-700">{opportunity.requirements.education}</p>
                    </div>
                  )}
                  
                  {opportunity.requirements.skills && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.requirements.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant={skill.required ? "default" : "secondary"}
                            className={skill.required ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                          >
                            {skill.name} ({skill.level})
                            {skill.required && <CheckCircle className="h-3 w-3 ml-1" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {opportunity.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to apply?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Join {opportunity.organization.name} and make an impact
                    </p>
                  </div>
                  
                  {user?.role === 'employee' && (
                    <Button 
                      onClick={handleApply}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  )}
                  
                  <div className="text-center">
                    <Button variant="ghost" onClick={handleSave} className="w-full">
                      <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      {isSaved ? 'Saved' : 'Save for Later'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  About {opportunity.organization.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{opportunity.organization.size} employees</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {opportunity.organization.location.city}, {opportunity.organization.location.state}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{opportunity.organization.industry}</span>
                </div>
                
                {opportunity.organization.website && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={opportunity.organization.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">{opportunity.type}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">{opportunity.category}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-medium capitalize">{opportunity.location.type}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Compensation</span>
                  <span className="text-sm font-medium">{formatSalary(opportunity.compensation)}</span>
                </div>
                
                {opportunity.applicationDeadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium">{formatDate(opportunity.applicationDeadline)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posted</span>
                  <span className="text-sm font-medium">{formatDate(opportunity.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal - Only for employees */}
      {showApplicationModal && opportunity && user?.role === 'employee' && (
        <ApplicationModal
          isOpen={showApplicationModal}
          opportunity={opportunity}
          onClose={() => {
            console.log('Closing application modal');
            setShowApplicationModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OpportunityDetail;
