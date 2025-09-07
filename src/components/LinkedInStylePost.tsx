import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Heart, 
  Bookmark, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  ExternalLink,
  MoreHorizontal,
  Building2,
  Calendar,
  Briefcase
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ApplicationModal from './ApplicationModal';

interface LinkedInStylePostProps {
  post: {
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
  };
  onApply?: (postId: string) => void;
  onSave?: (postId: string) => void;
  showActions?: boolean;
}

const LinkedInStylePost: React.FC<LinkedInStylePostProps> = ({
  post,
  onApply,
  onSave,
  showActions = true
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 1);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post._id);
  };


  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
      'volunteer': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.organization.logo?.url} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getCompanyInitials(post.organization.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {post.organization.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {post.organization.industry}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {post.organization.location.city}, {post.organization.location.state} • 
                  {post.organization.size} employees
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
              {post.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getJobTypeColor(post.type)}>
                <Briefcase className="h-3 w-3 mr-1" />
                {post.type.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {post.category}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {post.location.type === 'remote' ? 'Remote' : 
                 post.location.type === 'hybrid' ? 'Hybrid' : 'On-site'}
              </Badge>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {post.description.length > 200 
                ? `${post.description.substring(0, 200)}...` 
                : post.description
              }
            </p>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            {post.compensation?.amount && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {formatCurrency(post.compensation.amount, post.compensation.currency)}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                {new Date(post.schedule.startDate).toLocaleDateString()}
              </span>
            </div>
            {post.schedule.hoursPerWeek && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm">{post.schedule.hoursPerWeek}h/week</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{post.organization.size} employees</span>
            </div>
          </div>

          {/* Skills */}
          {post.requirements?.skills && post.requirements.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {post.requirements.skills.slice(0, 6).map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {post.requirements.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.requirements.skills.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className={`h-8 w-8 p-0 ${
                    isSaved ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  onClick={handleApply}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        opportunity={post}
      />
    </Card>
  );
};

export default LinkedInStylePost;
