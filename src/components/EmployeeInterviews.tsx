import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface Interview {
  _id: string;
  applicationId: string;
  opportunity: {
    title: string;
    organization: {
      name: string;
    };
  };
  interviewData?: {
    date: string;
    time: string;
    datetime: string;
    duration: number;
    type: 'video' | 'phone' | 'in-person';
    location?: string;
    meetingLink?: string;
    notes?: string;
    interviewer: string;
    interviewerEmail: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  };
  notes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const EmployeeInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Parse interview data from notes field (workaround for backend limitations)
  const parseInterviewFromNotes = (application: any) => {
    if (application.interviewData) {
      return application.interviewData;
    }

    // Look for interview note
    const interviewNote = application.notes?.find((note: any) => 
      note.note && note.note.includes('INTERVIEW SCHEDULED:')
    );

    if (!interviewNote) return null;

    const noteText = interviewNote.note;
    const lines = noteText.split('\n');
    
    const interviewData: any = {
      status: 'scheduled',
      scheduledAt: interviewNote.addedAt
    };

    lines.forEach(line => {
      if (line.includes('Date:')) {
        interviewData.date = line.split('Date:')[1]?.trim();
      } else if (line.includes('Time:')) {
        interviewData.time = line.split('Time:')[1]?.trim();
      } else if (line.includes('Duration:')) {
        const duration = line.split('Duration:')[1]?.trim();
        interviewData.duration = parseInt(duration?.split(' ')[0] || '60');
      } else if (line.includes('Type:')) {
        interviewData.type = line.split('Type:')[1]?.trim();
      } else if (line.includes('Location:')) {
        interviewData.location = line.split('Location:')[1]?.trim();
      } else if (line.includes('Meeting Link:')) {
        interviewData.meetingLink = line.split('Meeting Link:')[1]?.trim();
      } else if (line.includes('Interviewer:')) {
        const interviewerLine = line.split('Interviewer:')[1]?.trim();
        if (interviewerLine) {
          const parts = interviewerLine.split(' (');
          interviewData.interviewer = parts[0];
          if (parts[1]) {
            interviewData.interviewerEmail = parts[1].replace(')', '');
          }
        }
      } else if (line.includes('Notes:')) {
        interviewData.notes = line.split('Notes:')[1]?.trim();
      }
    });

    return interviewData;
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching employee applications...');
      
      // For now, we'll fetch applications with interview status
      // In a real app, you'd have a dedicated interviews endpoint
      const response = await apiService.getEmployeeApplications();
      console.log('📊 Full API Response:', response);
      
      if (response.status === 'success') {
        // The API returns data.applications array
        const applications = response.data?.applications || [];
        console.log('📋 All Applications:', applications.length, applications);
        
        // Check each application's status and interview data
        applications.forEach((app, index) => {
          console.log(`\n📄 Application ${index + 1}:`, {
            id: app._id,
            status: app.status,
            hasInterviewData: !!app.interviewData,
            interviewData: app.interviewData,
            opportunity: app.opportunity?.title,
            organization: app.organization?.name
          });
        });
        
        // Filter applications that have interview status
        const interviewApplications = applications.filter((app: any) => {
          const hasInterviewStatus = app.status === 'interview-scheduled' || app.status === 'interview';
          const hasInterviewData = !!app.interviewData;
          const hasInterviewNote = app.notes && app.notes.some((note: any) => 
            note.note && note.note.includes('INTERVIEW SCHEDULED:')
          );
          console.log(`🎯 App ${app._id}: status=${app.status}, hasData=${hasInterviewData}, hasNote=${hasInterviewNote}, matches=${hasInterviewStatus && (hasInterviewData || hasInterviewNote)}`);
          return hasInterviewStatus && (hasInterviewData || hasInterviewNote);
        });
        
        // Parse interview data for each application
        const interviewsWithData = interviewApplications.map((app: any) => {
          const interviewData = parseInterviewFromNotes(app);
          return {
            ...app,
            interviewData
          };
        }).filter((app: any) => app.interviewData); // Only include apps with valid interview data

        console.log('🎯 Final Interview Applications:', interviewsWithData.length, interviewsWithData);
        setInterviews(interviewsWithData);
      } else {
        console.log('❌ API response status not success:', response);
        setInterviews([]);
      }
    } catch (error) {
      console.error('💥 Failed to fetch interviews:', error);
      toast({
        title: "Error",
        description: "Failed to load interview data",
        variant: "destructive",
      });
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video Call';
      case 'phone':
        return 'Phone Call';
      case 'in-person':
        return 'In-Person';
      default:
        return 'Interview';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading interviews...</p>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Interviews Scheduled</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any interviews scheduled yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Keep applying to opportunities and you'll see your scheduled interviews here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Interviews</h2>
          <p className="text-muted-foreground">
            Manage and track your scheduled interviews
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {interviews.length} Interview{interviews.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-6">
        {interviews.map((interview) => (
          <Card key={interview._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {interview.opportunity.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {interview.opportunity.organization.name}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(interview.interviewData.status)}
                  <Badge className={getStatusColor(interview.interviewData.status)}>
                    {interview.interviewData.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Interview Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatDate(interview.interviewData.date)}</p>
                      <p className="text-sm text-muted-foreground">Interview Date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatTime(interview.interviewData.time)}</p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {interview.interviewData.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {getInterviewTypeIcon(interview.interviewData.type)}
                    <div>
                      <p className="font-medium">{getInterviewTypeLabel(interview.interviewData.type)}</p>
                      <p className="text-sm text-muted-foreground">Interview Type</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{interview.interviewData.interviewer}</p>
                      <p className="text-sm text-muted-foreground">Interviewer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Details */}
              {interview.interviewData.type === 'in-person' && interview.interviewData.location && (
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{interview.interviewData.location}</p>
                  </div>
                </div>
              )}

              {(interview.interviewData.type === 'video' || interview.interviewData.type === 'phone') && 
               interview.interviewData.meetingLink && (
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  {getInterviewTypeIcon(interview.interviewData.type)}
                  <div className="flex-1">
                    <p className="font-medium">Meeting Link</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {interview.interviewData.meetingLink}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(interview.interviewData.meetingLink, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Join Meeting
                    </Button>
                  </div>
                </div>
              )}

              {/* Interviewer Contact */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Interviewer Contact</p>
                  <p className="text-sm text-blue-700">{interview.interviewData.interviewer}</p>
                  <p className="text-sm text-blue-600">{interview.interviewData.interviewerEmail}</p>
                </div>
              </div>

              {/* Additional Notes */}
              {interview.interviewData.notes && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-900 mb-1">Additional Notes</p>
                  <p className="text-sm text-yellow-800">{interview.interviewData.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInterview(interview)}
                >
                  View Details
                </Button>
                {(interview.interviewData.type === 'video' || interview.interviewData.type === 'phone') && 
                 interview.interviewData.meetingLink && (
                  <Button
                    size="sm"
                    onClick={() => window.open(interview.interviewData.meetingLink, '_blank')}
                  >
                    Join Meeting
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeInterviews;
