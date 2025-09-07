import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import LinkedInHomeFeed from '../components/LinkedInHomeFeed';
import { useNavigate } from 'react-router-dom';

const LinkedInHome: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handlePostOpportunity = () => {
    if (user?.role === 'organization') {
      navigate('/organization-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Next Opportunity
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Connect with top organizations and find opportunities that match your skills and interests
            </p>
            {user ? (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-600">
                  Welcome back, {profile?.personalInfo?.firstName || profile?.name || 'User'}!
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <LinkedInHomeFeed 
          userRole={user?.role}
          onPostOpportunity={handlePostOpportunity}
        />
      </div>
    </div>
  );
};

export default LinkedInHome;
