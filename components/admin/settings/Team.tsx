'use client'

import React, { useState } from 'react';
import { UserPlus, Edit, UserX, Shield, Users, CheckCircle } from 'lucide-react';
import { TeamMember, RolePermissions } from '@/Types/types';

const StatusBadge = ({ 
  status, 
  type = 'neutral' 
}: { 
  status: string; 
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
      {status}
    </span>
  );
};

const RoleCard = ({ 
  role, 
  description, 
  icon: Icon,
  color 
}: { 
  role: string; 
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-2 border-transparent hover:border-blue-200 transition-colors">
      <div className={`${color} p-3 rounded-lg w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{role}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const mockTeamMembers: TeamMember[] = [
  {
    id: 'TM-001',
    name: 'John Adebayo',
    email: 'john.adebayo@company.com',
    role: 'Admin',
    accessLevel: 'Full Access',
    status: 'Active',
    joinedDate: '2024-01-15',
  },
  {
    id: 'TM-002',
    name: 'Sarah Okonkwo',
    email: 'sarah.okonkwo@company.com',
    role: 'Manager',
    accessLevel: 'Management Access',
    status: 'Active',
    joinedDate: '2024-03-20',
  },
  {
    id: 'TM-003',
    name: 'David Eze',
    email: 'david.eze@company.com',
    role: 'Support',
    accessLevel: 'Support Access',
    status: 'Active',
    joinedDate: '2024-05-10',
  },
  {
    id: 'TM-004',
    name: 'Grace Bello',
    email: 'grace.bello@company.com',
    role: 'Support',
    accessLevel: 'Support Access',
    status: 'Disabled',
    joinedDate: '2024-02-28',
  },
];

const rolePermissions: RolePermissions = {
  Admin: {
    label: 'Administrator',
    permissions: [
      'Full system access',
      'Manage team members',
      'Configure platform settings',
      'View all reports',
      'Manage integrations',
      'Process refunds',
      'Delete orders',
      'Manage inventory',
    ],
  },
  Manager: {
    label: 'Manager',
    permissions: [
      'View all orders',
      'Process orders',
      'Manage inventory',
      'View reports',
      'Manage customers',
      'Handle disputes',
      'Export data',
    ],
  },
  Support: {
    label: 'Support Agent',
    permissions: [
      'View orders',
      'Update order status',
      'Chat with customers',
      'View customer details',
      'Create support tickets',
    ],
  },
};

export default function TeamRolesPage() {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('Admin');
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Support' as TeamMember['role'],
  });

  const handleInviteMember = () => {
    if (!inviteForm.name || !inviteForm.email) {
      alert('Please fill in all fields');
      return;
    }

    const newMember: TeamMember = {
      id: `TM-${String(teamMembers.length + 1).padStart(3, '0')}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      accessLevel: inviteForm.role === 'Admin' ? 'Full Access' : inviteForm.role === 'Manager' ? 'Management Access' : 'Support Access',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'Support' });
    alert('Team member invited successfully!');
  };

  const handleEditRole = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleUpdateRole = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map(m =>
      m.id === selectedMember.id
        ? { ...m, role: selectedMember.role, accessLevel: selectedMember.role === 'Admin' ? 'Full Access' : selectedMember.role === 'Manager' ? 'Management Access' : 'Support Access' }
        : m
    );

    setTeamMembers(updatedMembers);
    setShowEditModal(false);
    setSelectedMember(null);
    alert('Role updated successfully!');
  };

  const handleToggleStatus = (memberId: string) => {
    const updatedMembers = teamMembers.map(m =>
      m.id === memberId
        ? { ...m, status: m.status === 'Active' ? 'Disabled' : 'Active' as TeamMember['status'] }
        : m
    );
    setTeamMembers(updatedMembers);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team & Roles</h1>
            <p className="text-gray-600 mt-2">Manage team members and their access permissions</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </button>
        </div>

        {/* Role Definitions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Definitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard
              role="Administrator"
              description="Full system access and control over all features"
              icon={Shield}
              color="bg-red-50 text-red-600"
            />
            <RoleCard
              role="Manager"
              description="Manage operations, orders, and customer interactions"
              icon={Users}
              color="bg-blue-50 text-blue-600"
            />
            <RoleCard
              role="Support"
              description="Handle customer queries and basic order management"
              icon={Users}
              color="bg-green-50 text-green-600"
            />
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        member.role === 'Admin' ? 'bg-red-100 text-red-800' :
                        member.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.accessLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge 
                        status={member.status} 
                        type={member.status === 'Active' ? 'success' : 'error'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.joinedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRole(member)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(member.id)}
                          className={`flex items-center gap-1 ${
                            member.status === 'Active' 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {member.status === 'Active' ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
          <div className="flex gap-2 mb-6">
            {Object.keys(rolePermissions).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rolePermissions[role].label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {rolePermissions[selectedRole].permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-900">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invite Team Member</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="john.doe@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as TeamMember['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Support">Support</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Role</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Team Member</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedMember.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={selectedMember.role}
                    onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value as TeamMember['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Support">Support</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}