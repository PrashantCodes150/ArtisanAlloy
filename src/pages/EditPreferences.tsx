import React from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import OnboardingFlow from '../components/OnboardingFlow';
interface EditPreferencesPageProps { }

const EditPreferencesPage: React.FC<EditPreferencesPageProps> = () => {
  const { user, updatePreferences } = useAuth();
  const navigate = useNavigate();

  const handleSavePreferences = async (preferences: any) => {
    try {
      await updatePreferences(preferences);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-jewelry-cream font-sans">Please log in to edit your preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <OnboardingFlow isEditMode={true} onSave={handleSavePreferences} />
    </div>
  );
};

export default EditPreferencesPage;