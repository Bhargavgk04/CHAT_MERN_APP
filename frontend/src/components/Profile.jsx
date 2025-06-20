import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const Profile = () => {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: authUser?.fullName || '',
    username: authUser?.username || '',
    profilePhoto: authUser?.profilePhoto || '',
    gender: authUser?.gender || 'male',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    setForm({
      fullName: authUser?.fullName || '',
      username: authUser?.username || '',
      profilePhoto: authUser?.profilePhoto || '',
      gender: authUser?.gender || 'male',
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const res = await axios.post(
        `${BASE_URL}/api/v1/user/upload-profile-photo`,
        formData,
        {
          withCredentials: true,
          // headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setForm((prev) => ({ ...prev, profilePhoto: res.data.url }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/user/profile`,
        form,
        { withCredentials: true }
      );
      dispatch(setAuthUser(res.data.user));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      if (err.response?.data?.message === "Username already taken") {
        setError("Username is not available");
      } else {
        setError(
          err.response?.data?.message || "Failed to update profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-zinc-800 p-12 rounded-lg shadow-md w-full max-w-2xl flex flex-col items-center relative">
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 hover:text-blue-600"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack />
          <span className="hidden sm:inline">Back</span>
        </button>
        <img
          src={authUser?.profilePhoto || 'https://github.com/shadcn.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mb-6 border-2 border-zinc-400"
        />
        <h2 className="text-3xl font-bold mb-3">{authUser?.username}</h2>
        <p className="mb-2 text-zinc-600 dark:text-zinc-300 text-lg">
          <span className="font-semibold">Full Name:</span> {authUser?.fullName}
        </p>
        <p className="mb-2 text-zinc-600 dark:text-zinc-300 text-lg">
          <span className="font-semibold">Gender:</span> {authUser?.gender || 'Not set'}
        </p>
        <button
          className="btn btn-primary mt-6 px-8 py-2 text-lg"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-4/5 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={handleClose}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Profile Photo</label>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  disabled={uploading}
                />
                {uploading && <div className="text-xs text-blue-500">Uploading...</div>}
                {form.profilePhoto && (
                  <img
                    src={form.profilePhoto}
                    alt="Preview"
                    className="w-16 h-16 rounded-full mt-2 object-cover border"
                  />
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 