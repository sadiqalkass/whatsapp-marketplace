import React, { useState } from 'react';
import { Mail, Phone, Edit2, Plus } from 'lucide-react';

interface ContactDetailsSectionProps {
  email: string;
  phone: string;
  onUpdatePhone: (phone: string) => Promise<void>;
}

export default function ContactDetailsSection({ email, phone, onUpdatePhone }: ContactDetailsSectionProps) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState(phone);

  const handleSavePhone = async () => {
    await onUpdatePhone(editedPhone);
    setIsEditingPhone(false);
  };

  const handleCancelPhone = () => {
    setIsEditingPhone(false);
    setEditedPhone(phone);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Mail size={20} className="text-gray-400" />
          Contact Details
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone - Editable/Addable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            {!phone && !isEditingPhone ? (
              <button
                onClick={() => setIsEditingPhone(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Plus size={18} />
                Add Phone Number
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={isEditingPhone ? editedPhone : phone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    disabled={!isEditingPhone}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                {!isEditingPhone && phone && (
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <Edit2 size={14} />
                    Edit Phone
                  </button>
                )}
                {isEditingPhone && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePhone}
                      className="px-4 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelPhone}
                      className="px-4 py-1.5 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}