import { saveProfile } from './services/dispatcherAPI';
import { useState } from 'react';
import { UserData } from './types/dispatcher';

function ProfilePage() {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    role: 'client'
});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

    setSaving(true);
    setError(null);
    setSuccess(false);

    const handleSubmit = async (data: UserData) => {
      setSaving(true);
      setError(null);
      setSuccess(false);

    try {
      await saveProfile(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-details-page">
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      {success && (
        <div className="success-banner">
          Profile saved successfully!
        </div>
      )}
      {saving && (
        <div className="saving-overlay">
          Saving...
        </div>
      )}
      <style>{`
        .profile-details-page {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 2rem 1rem;
        }
        .error-banner {
          max-width: 900px;
          margin: 0 auto 1rem auto;
          padding: 1rem;
          background-color: #1693b3;
          border: 1px solid #88101c;
          border-radius: 5px;
          color: #07ee41;
          text-align: center;
        }
        .saving-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(245, 166, 166, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.0rem;
          color: #0c1d6d;
          z-index: 1000;
        }
                  .success-banner {
          max-width: 900px;
          margin: 0 auto 1rem auto;
          padding: 1rem;
          background-color: #9807f8;
          border: 1px solid #00bd2c;
          border-radius: 5px;
          color: #9500cf;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
