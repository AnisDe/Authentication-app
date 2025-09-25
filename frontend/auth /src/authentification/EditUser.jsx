import React, { useState, useEffect } from 'react';
import "./editProfile.css";

const EditProfile = () => {
  const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/profile/me', {
          credentials: 'include', // passport session
        });

        if (!res.ok) throw new Error('Failed to load user');
        const data = await res.json();
         setUsername(data.user.username || '');
        setEmail(data.user.email || '');
      } catch (err) {
        setErrorMsg(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8000/edit/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setSuccessMsg('Profile updated!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

 return (
  <div className="editProfile-container">
    <div className="editProfile-left">
      <div className="editProfile-card">
        <form onSubmit={handleSubmit} className="w-100">
          <h2 className="h4 mb-4 text-center">Edit Profile</h2>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="form-control-plaintext bg-light text-muted"
            />
          </div>

          {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}
          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-100"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  </div>
);

};

export default EditProfile;
