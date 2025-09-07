import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, MapPin, Video, Phone, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

interface ScheduleInterviewModalProps {
  application: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
    opportunity: {
      title: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onInterviewScheduled: () => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  application,
  isOpen,
  onClose,
  onInterviewScheduled
}) => {
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    location: '',
    meetingLink: '',
    notes: '',
    interviewer: '',
    interviewerEmail: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🎯 Starting interview scheduling...');
      console.log('📋 Application:', application);
      console.log('📅 Interview Data:', interviewData);
      
      // Create interview data
      const interviewDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
      
      const interviewInfo = {
        applicationId: application._id,
        employeeId: application._id, // This should be the employee ID from the application
        interviewData: {
          date: interviewData.date,
          time: interviewData.time,
          datetime: interviewDateTime.toISOString(),
          duration: parseInt(interviewData.duration),
          type: interviewData.type,
          location: interviewData.location,
          meetingLink: interviewData.meetingLink,
          notes: interviewData.notes,
          interviewer: interviewData.interviewer,
          interviewerEmail: interviewData.interviewerEmail,
          status: 'scheduled'
        }
      };

      console.log('📤 Sending interview data:', interviewInfo);
      console.log('🌐 Using API endpoint: /organizations/applications/' + application._id + '/status');

      // Update application status to 'interview' (backend doesn't support 'interview-scheduled' yet)
      // Store interview data in the note field as a workaround
      const interviewNote = `INTERVIEW SCHEDULED:
Date: ${interviewData.date}
Time: ${interviewData.time}
Duration: ${interviewData.duration} minutes
Type: ${interviewData.type}
${interviewData.type === 'in-person' ? `Location: ${interviewData.location}` : `Meeting Link: ${interviewData.meetingLink}`}
Interviewer: ${interviewData.interviewer} (${interviewData.interviewerEmail})
Notes: ${interviewData.notes}`;

      const result = await apiService.updateApplicationStatus(
        application._id, 
        'interview', 
        interviewNote
      );
      
      console.log('✅ Interview scheduling result:', result);
      console.log('🔍 Result status:', result?.status);
      console.log('🔍 Result data:', result?.data);

      // TODO: Send notification to employee about the interview
      // This would typically be done through email or in-app notification
      
      toast({
        title: "Interview Scheduled!",
        description: `Interview scheduled for ${application.personalInfo.firstName} ${application.personalInfo.lastName} on ${interviewData.date} at ${interviewData.time}`,
      });

      onInterviewScheduled();
      onClose();
      
      // Reset form
      setInterviewData({
        date: '',
        time: '',
        duration: '60',
        type: 'video',
        location: '',
        meetingLink: '',
        notes: '',
        interviewer: '',
        interviewerEmail: ''
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule interview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">Schedule Interview</h2>
              <p className="text-gray-600">
                Schedule interview for {application.personalInfo.firstName} {application.personalInfo.lastName}
              </p>
              <p className="text-sm text-gray-500">
                Position: {application.opportunity.title}
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Interview Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={interviewData.date}
                    onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                    className="pl-10"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="time">Interview Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={interviewData.time}
                    onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Duration and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={interviewData.duration} onValueChange={(value) => setInterviewData({ ...interviewData, duration: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type">Interview Type</Label>
                <Select value={interviewData.type} onValueChange={(value) => setInterviewData({ ...interviewData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Call
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Call
                      </div>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        In-Person
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location or Meeting Link */}
            {interviewData.type === 'in-person' ? (
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Enter office address or location"
                    value={interviewData.location}
                    onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="meetingLink"
                    placeholder="Enter Zoom, Teams, or other meeting link"
                    value={interviewData.meetingLink}
                    onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Interviewer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interviewer">Interviewer Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="interviewer"
                    placeholder="Interviewer's full name"
                    value={interviewData.interviewer}
                    onChange={(e) => setInterviewData({ ...interviewData, interviewer: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="interviewerEmail">Interviewer Email</Label>
                <Input
                  id="interviewerEmail"
                  type="email"
                  placeholder="interviewer@company.com"
                  value={interviewData.interviewerEmail}
                  onChange={(e) => setInterviewData({ ...interviewData, interviewerEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information for the candidate..."
                value={interviewData.notes}
                onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
