import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Eye, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Star
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface Application {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    gpa?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    yearsOfExperience: number;
  }>;
  coverLetter: string;
  availability: {
    startDate: string;
    hoursPerWeek: number;
    workMode: string;
  };
  documents: {
    resume?: {
      url: string;
      name: string;
    };
    coverLetter?: {
      url: string;
      name: string;
    };
    portfolio?: string;
    linkedin?: string;
    github?: string;
  };
  additionalInfo: {
    whyInterested: string;
    relevantExperience: string;
    questions: string;
  };
  status: string;
  submittedAt: string;
  opportunity: {
    _id: string;
    title: string;
    type: string;
    category: string;
  };
  employee: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      profilePicture?: {
        url: string;
      };
    };
    skills: Array<{
      name: string;
      level: string;
    }>;
  };
}

interface ApplicationsManagementProps {
  organizationId?: string;
}

const ApplicationsManagement: React.FC<ApplicationsManagementProps> = ({ organizationId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await apiService.getApplications(params);
      setApplications(response.data.applications || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const updateApplicationStatus = async (applicationId: string, status: string, note?: string) => {
    try {
      await apiService.updateApplicationStatus(applicationId, status, note);
      toast({
        title: "Status Updated",
        description: `Application status updated to ${status}`,
      });
      fetchApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'interview': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Applications
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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Application Management
          </CardTitle>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchApplications}>
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? "No applications have been submitted yet. Start posting opportunities to receive applications."
                : `No applications with status "${statusFilter}" found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.employee.personalInfo.profilePicture?.url} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(application.personalInfo.firstName, application.personalInfo.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {application.personalInfo.firstName} {application.personalInfo.lastName}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.personalInfo.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.personalInfo.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.personalInfo.city}, {application.personalInfo.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied on {formatDate(application.submittedAt)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-sm mb-1">Applied for:</h4>
                        <p className="text-sm text-gray-700">
                          {application.opportunity.title} • {application.opportunity.type}
                        </p>
                      </div>

                      {/* Skills */}
                      {application.skills && application.skills.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-sm mb-1">Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {application.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {application.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{application.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Cover Letter Preview */}
                      <div className="mb-3">
                        <h4 className="font-medium text-sm mb-1">Cover Letter:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {application.documents.resume && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.documents.resume?.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => updateApplicationStatus(application._id, 'shortlisted')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateApplicationStatus(application._id, 'rejected')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                  </h2>
                  <p className="text-gray-600">
                    Application for {selectedApplication.opportunity.title}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Personal Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Email:</strong> {selectedApplication.personalInfo.email}</div>
                      <div><strong>Phone:</strong> {selectedApplication.personalInfo.phone}</div>
                      <div><strong>Location:</strong> {selectedApplication.personalInfo.city}, {selectedApplication.personalInfo.state}</div>
                      <div><strong>Address:</strong> {selectedApplication.personalInfo.address}</div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedApplication.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedApplication.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Cover Letter */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cover Letter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.coverLetter}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill.name} ({skill.level})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Availability */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Start Date:</strong> {formatDate(selectedApplication.availability.startDate)}</div>
                      <div><strong>Hours per Week:</strong> {selectedApplication.availability.hoursPerWeek}</div>
                      <div><strong>Work Mode:</strong> {selectedApplication.availability.workMode}</div>
                    </CardContent>
                  </Card>

                  {/* Documents */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Documents & Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedApplication.documents.resume && (
                        <div>
                          <strong>Resume:</strong>{' '}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => window.open(selectedApplication.documents.resume?.url, '_blank')}
                          >
                            {selectedApplication.documents.resume.name}
                          </Button>
                        </div>
                      )}
                      {selectedApplication.documents.linkedin && (
                        <div>
                          <strong>LinkedIn:</strong>{' '}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => window.open(selectedApplication.documents.linkedin, '_blank')}
                          >
                            View Profile
                          </Button>
                        </div>
                      )}
                      {selectedApplication.documents.github && (
                        <div>
                          <strong>GitHub:</strong>{' '}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => window.open(selectedApplication.documents.github, '_blank')}
                          >
                            View Profile
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'shortlisted')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Shortlist
                </Button>
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'interview')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;
