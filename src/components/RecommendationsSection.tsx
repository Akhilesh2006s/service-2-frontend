import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Clock, Users, Star, TrendingUp, Filter } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface Recommendation {
  opportunity: {
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
      };
    };
    createdAt: string;
  };
  scores: {
    overall: number;
    skills: number;
    interests: number;
    location: number;
  };
  matchReasons: string[];
}

interface RecommendationsSectionProps {
  employeeId?: string;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ employeeId }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    location: 'all'
  });
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.location && filters.location !== 'all') params.location = filters.location;

      const response = await apiService.getRecommendedOpportunities(params);
      setRecommendations(response.data.recommendations || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recommended Opportunities
          <Badge variant="secondary">{recommendations.length}</Badge>
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
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
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="on-site">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or complete your profile to get better recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.opportunity._id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {rec.opportunity.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {rec.opportunity.organization.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {rec.opportunity.location.type === 'remote' 
                            ? 'Remote' 
                            : `${rec.opportunity.organization.location.city}, ${rec.opportunity.organization.location.state}`
                          }
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(rec.opportunity.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Score */}
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(rec.scores.overall)}`}>
                        <Star className="h-4 w-4" />
                        {rec.scores.overall}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getScoreText(rec.scores.overall)}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {rec.opportunity.description}
                  </p>

                  {/* Match Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">Skills Match</div>
                      <div className="text-lg font-semibold text-blue-600">{rec.scores.skills}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">Interests Match</div>
                      <div className="text-lg font-semibold text-green-600">{rec.scores.interests}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">Location Match</div>
                      <div className="text-lg font-semibold text-purple-600">{rec.scores.location}%</div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {rec.matchReasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Why this matches:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.matchReasons.map((reason, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opportunity Details */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Badge variant="secondary">{rec.opportunity.type}</Badge>
                    <Badge variant="secondary">{rec.opportunity.category}</Badge>
                    {rec.opportunity.compensation?.amount && (
                      <Badge variant="secondary">
                        {formatCurrency(rec.opportunity.compensation.amount, rec.opportunity.compensation.currency)}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {rec.opportunity.organization.industry}
                    </Badge>
                    <Badge variant="secondary">
                      {rec.opportunity.organization.size} employees
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
