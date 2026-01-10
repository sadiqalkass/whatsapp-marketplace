'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { profileService } from '@/services/profile.service';
import toast from 'react-hot-toast';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await profileService.verifyInviteToken(token!);
      setUserData(res.data);
    } catch (error) {
      toast.error('Invalid or expired invite link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await profileService.acceptInvite({ token: token!, password });
      toast.error('Account activated! Please login.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate account');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (!userData) return <div className="flex justify-center items-center min-h-screen">Invalid invite</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">Welcome, {userData.name}!</h1>
        <p className="text-gray-600 mb-6">Set your password to activate your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Activate Account
          </button>
        </form>
      </div>
    </div>
  );
}