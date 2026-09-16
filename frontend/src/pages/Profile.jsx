import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Building2,
  BookOpen,
  Award,
  Edit3,
  CheckCircle,
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit form state initialized from current user
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    district: user?.district || 'Bhopal',
    targetRole: user?.targetRole || 'Full Stack Developer',
    currentSkills: Array.isArray(user?.currentSkills) ? user.currentSkills.join(', ') : (user?.currentSkills || ''),
    companyName: user?.companyName || '',
    industry: user?.industry || 'IT Services',
    hiringRoles: Array.isArray(user?.hiringRoles) ? user.hiringRoles.join(', ') : (user?.hiringRoles || '')
  });

  if (!user) return null;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      setLoading(true);

      const payload = {
        name: editForm.name.trim(),
        district: editForm.district,
        targetRole: editForm.targetRole.trim(),
        currentSkills: editForm.currentSkills.split(',').map(s => s.trim()).filter(Boolean),
        companyName: editForm.companyName.trim(),
        industry: editForm.industry.trim(),
        hiringRoles: editForm.hiringRoles.split(',').map(s => s.trim()).filter(Boolean)
      };

      await updateProfile(payload);
      setShowEditModal(false);
      setSuccessMsg('Profile updated successfully.');

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'EMPLOYER':
        return <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">EMPLOYER</span>;
      case 'ADMIN':
        return <span className="bg-purple-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">ADMIN</span>;
      case 'TRAINEE':
      default:
        return <span className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">TRAINEE</span>;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              {getRoleBadge(user.role)}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Mail size={16} className="text-gray-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditForm({
              name: user.name || '',
              district: user.district || 'Bhopal',
              targetRole: user.targetRole || 'Full Stack Developer',
              currentSkills: Array.isArray(user.currentSkills) ? user.currentSkills.join(', ') : '',
              companyName: user.companyName || '',
              industry: user.industry || 'IT Services',
              hiringRoles: Array.isArray(user.hiringRoles) ? user.hiringRoles.join(', ') : ''
            });
            setShowEditModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow"
        >
          <Edit3 size={18} />
          <span>Edit Profile</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle size={20} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Role-Specific Details Panel */}
      {user.role === 'TRAINEE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Target size={20} className="text-blue-600" />
              Trainee Profile & Goals
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" /> District Location
                </span>
                <span className="font-bold text-gray-800">{user.district || 'Bhopal'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <Award size={16} className="text-blue-600" /> Target Job Role
                </span>
                <span className="font-bold text-blue-700">{user.targetRole || 'Full Stack Developer'}</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
              <BookOpen size={20} className="text-emerald-600" />
              Current Skills & Competencies
            </h3>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Verified Skills:</span>
              <div className="flex flex-wrap gap-2">
                {user.currentSkills && user.currentSkills.length > 0 ? (
                  user.currentSkills.map((sk, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-3 py-1 rounded-lg text-xs">
                      ✓ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills listed yet. Click Edit Profile to add skills.</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Suggested Skills to Develop:</span>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Docker', 'AWS'].map((sk, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-3 py-1 rounded-lg text-xs">
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {user.role === 'EMPLOYER' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Building2 size={20} className="text-red-600" />
            Employer Organization Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-bold block uppercase mb-1">Company Name</span>
              <span className="text-base font-bold text-gray-800">{user.companyName || 'Not specified'}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-bold block uppercase mb-1">Industry Sector</span>
              <span className="text-base font-bold text-gray-800">{user.industry || 'IT Services'}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-bold block uppercase mb-1">District Location</span>
              <span className="text-base font-bold text-gray-800">{user.district || 'Bhopal'}</span>
            </div>
          </div>

          <div className="pt-3">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Hiring Job Roles:</span>
            <div className="flex flex-wrap gap-2">
              {user.hiringRoles && user.hiringRoles.length > 0 ? (
                user.hiringRoles.map((role, idx) => (
                  <span key={idx} className="bg-red-50 text-red-700 border border-red-200 font-semibold px-3 py-1 rounded-lg text-xs">
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No hiring roles listed.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck size={20} className="text-purple-600" />
            System Administrator Overview
          </h3>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-900">
            <p className="font-semibold">Platform Management Authority:</p>
            <p className="text-xs mt-1">Full access to SkillBridge AI modules, demand analytics, curriculum verification, and employer validation oversight.</p>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile Information</h2>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {user.role === 'TRAINEE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District Location</label>
                    <select
                      value={editForm.district}
                      onChange={e => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Gwalior">Gwalior</option>
                      <option value="Ujjain">Ujjain</option>
                      <option value="Sagar">Sagar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Job Role</label>
                    <input
                      type="text"
                      value={editForm.targetRole}
                      onChange={e => setEditForm({ ...editForm, targetRole: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Skills (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.currentSkills}
                      onChange={e => setEditForm({ ...editForm, currentSkills: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {user.role === 'EMPLOYER' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={e => setEditForm({ ...editForm, companyName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={e => setEditForm({ ...editForm, industry: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District Location</label>
                    <select
                      value={editForm.district}
                      onChange={e => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Gwalior">Gwalior</option>
                      <option value="Ujjain">Ujjain</option>
                      <option value="Sagar">Sagar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hiring Roles (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.hiringRoles}
                      onChange={e => setEditForm({ ...editForm, hiringRoles: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
