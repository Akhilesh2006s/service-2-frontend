import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  X,
  Send
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    _id: string;
    title: string;
    organization: {
      _id: string;
      name: string;
    };
    type: string;
    category: string;
    location: {
      type: string;
      address?: string;
    };
    compensation?: {
      type: string;
      amount?: number;
      currency?: string;
    };
  };
}

interface ApplicationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    dateOfBirth: string;
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
    resume: File | null;
    coverLetterFile: File | null;
    portfolio: string;
    linkedin: string;
    github: string;
  };
  additionalInfo: {
    whyInterested: string;
    relevantExperience: string;
    questions: string;
  };
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  opportunity
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: {
      firstName: profile?.personalInfo?.firstName || '',
      lastName: profile?.personalInfo?.lastName || '',
      email: user?.email || '',
      phone: profile?.personalInfo?.phone || '',
      address: profile?.location?.address || '',
      city: profile?.location?.city || '',
      state: profile?.location?.state || '',
      country: profile?.location?.country || '',
      dateOfBirth: profile?.personalInfo?.dateOfBirth ? 
        new Date(profile.personalInfo.dateOfBirth).toISOString().split('T')[0] : ''
    },
    education: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: ''
    }],
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    }],
    skills: profile?.skills || [],
    coverLetter: '',
    availability: {
      startDate: '',
      hoursPerWeek: 40,
      workMode: 'hybrid'
    },
    documents: {
      resume: null,
      coverLetterFile: null,
      portfolio: '',
      linkedin: '',
      github: ''
    },
    additionalInfo: {
      whyInterested: '',
      relevantExperience: '',
      questions: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    setApplicationData(prev => {
      if (index !== undefined) {
        return {
          ...prev,
          [section]: prev[section as keyof ApplicationData].map((item: any, i: number) => 
            i === index ? { ...item, [field]: value } : item
          )
        };
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof ApplicationData],
            [parent]: {
              ...(prev[section as keyof ApplicationData] as any)[parent],
              [child]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof ApplicationData],
            [field]: value
          }
        };
      }
    });
  };

  const addEducation = () => {
    setApplicationData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        gpa: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setApplicationData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (file: File, type: 'resume' | 'coverLetterFile') => {
    setApplicationData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!applicationData.personalInfo.firstName || !applicationData.personalInfo.lastName) {
        toast({
          title: "Validation Error",
          description: "Please fill in your first and last name.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!applicationData.coverLetter) {
        toast({
          title: "Validation Error",
          description: "Please write a cover letter.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Resume upload is optional for now
      // if (!applicationData.documents.resume) {
      //   toast({
      //     title: "Validation Error",
      //     description: "Please upload your resume.",
      //     variant: "destructive",
      //   });
      //   setLoading(false);
      //   return;
      // }

      // Create application data for submission
      const submissionData = {
        opportunityId: opportunity._id,
        applicationData: applicationData
      };

      // Debug logging
      console.log('Submitting application with data:', {
        opportunityId: opportunity._id,
        applicationData: applicationData,
        hasResume: !!applicationData.documents.resume,
        hasCoverLetter: !!applicationData.documents.coverLetterFile
      });

      // Submit application
      await apiService.submitApplication(submissionData);
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${opportunity.title} has been submitted successfully.`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={applicationData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={applicationData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={applicationData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={applicationData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={applicationData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={applicationData.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={applicationData.personalInfo.country}
                  onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={applicationData.personalInfo.dateOfBirth}
                onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Education</h3>
              <p className="text-gray-600">Add your educational background</p>
            </div>

            {applicationData.education.map((edu, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Education #{index + 1}</h4>
                  {applicationData.education.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                      placeholder="University/College name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                      placeholder="Bachelor's, Master's, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleInputChange('education', 'fieldOfStudy', e.target.value, index)}
                      placeholder="Computer Science, Business, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                      placeholder="3.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date *</Label>
                    <Input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                      disabled={edu.isCurrent}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={edu.isCurrent}
                        onChange={(e) => handleInputChange('education', 'isCurrent', e.target.checked, index)}
                      />
                      <span className="text-sm">Currently studying</span>
                    </label>
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" onClick={addEducation} className="w-full">
              <GraduationCap className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <p className="text-gray-600">Add your professional experience</p>
            </div>

            {applicationData.experience.map((exp, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  {applicationData.experience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Job Title *</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                      placeholder="Software Engineer, Marketing Manager, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                      placeholder="Company name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => handleInputChange('experience', 'location', e.target.value, index)}
                    placeholder="City, State"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date *</Label>
                    <Input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                      disabled={exp.isCurrent}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => handleInputChange('experience', 'isCurrent', e.target.checked, index)}
                      />
                      <span className="text-sm">Currently working</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </Card>
            ))}

            <Button variant="outline" onClick={addExperience} className="w-full">
              <Briefcase className="h-4 w-4 mr-2" />
              Add Another Experience
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Documents & Links</h3>
              <p className="text-gray-600">Upload your resume and provide additional links</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Resume *</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'resume');
                    }}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {applicationData.documents.resume ? applicationData.documents.resume.name : 'Upload Resume'}
                  </Button>
                  {applicationData.documents.resume && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {applicationData.documents.resume.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Cover Letter (Optional)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'coverLetterFile');
                    }}
                    className="hidden"
                    id="coverLetter"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('coverLetter')?.click()}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {applicationData.documents.coverLetterFile ? applicationData.documents.coverLetterFile.name : 'Upload Cover Letter'}
                  </Button>
                  {applicationData.documents.coverLetterFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {applicationData.documents.coverLetterFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn Profile</Label>
                  <Input
                    value={applicationData.documents.linkedin}
                    onChange={(e) => handleInputChange('documents', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label>GitHub Profile</Label>
                  <Input
                    value={applicationData.documents.github}
                    onChange={(e) => handleInputChange('documents', 'github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <Label>Portfolio/Website</Label>
                <Input
                  value={applicationData.documents.portfolio}
                  onChange={(e) => handleInputChange('documents', 'portfolio', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Cover Letter & Additional Information</h3>
              <p className="text-gray-600">Tell us why you're interested in this opportunity</p>
            </div>

            <div>
              <Label>Cover Letter *</Label>
              <Textarea
                value={applicationData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', '', e.target.value)}
                placeholder="Write a compelling cover letter explaining why you're interested in this position..."
                rows={6}
                required
              />
            </div>

            <div>
              <Label>Why are you interested in this opportunity? *</Label>
              <Textarea
                value={applicationData.additionalInfo.whyInterested}
                onChange={(e) => handleInputChange('additionalInfo', 'whyInterested', e.target.value)}
                placeholder="Explain what attracts you to this role and company..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Relevant Experience</Label>
              <Textarea
                value={applicationData.additionalInfo.relevantExperience}
                onChange={(e) => handleInputChange('additionalInfo', 'relevantExperience', e.target.value)}
                placeholder="Highlight any specific experience that makes you a great fit..."
                rows={4}
              />
            </div>

            <div>
              <Label>Questions for the Company</Label>
              <Textarea
                value={applicationData.additionalInfo.questions}
                onChange={(e) => handleInputChange('additionalInfo', 'questions', e.target.value)}
                placeholder="Any questions you'd like to ask about the role or company?"
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Availability & Preferences</h3>
              <p className="text-gray-600">When can you start and what are your preferences?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Available Start Date *</Label>
                <Input
                  type="date"
                  value={applicationData.availability.startDate}
                  onChange={(e) => handleInputChange('availability', 'startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Hours per Week *</Label>
                <Select
                  value={applicationData.availability.hoursPerWeek.toString()}
                  onValueChange={(value) => handleInputChange('availability', 'hoursPerWeek', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 hours</SelectItem>
                    <SelectItem value="20">20 hours</SelectItem>
                    <SelectItem value="30">30 hours</SelectItem>
                    <SelectItem value="40">40 hours</SelectItem>
                    <SelectItem value="50">50+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Preferred Work Mode *</Label>
              <Select
                value={applicationData.availability.workMode}
                onValueChange={(value) => handleInputChange('availability', 'workMode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="p-4 bg-blue-50">
              <h4 className="font-medium mb-2">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Position:</strong> {opportunity.title}</p>
                <p><strong>Company:</strong> {opportunity.organization.name}</p>
                <p><strong>Type:</strong> {opportunity.type}</p>
                <p><strong>Location:</strong> {opportunity.location.type}</p>
                {opportunity.compensation?.amount && (
                  <p><strong>Compensation:</strong> ${opportunity.compensation.amount.toLocaleString()}</p>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Apply for {opportunity.title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 6</span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / 6) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 6 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Application
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
