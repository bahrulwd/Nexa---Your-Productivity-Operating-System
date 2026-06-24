import React, { useEffect, useState } from 'react';
import { PRESET_AVATARS } from '../ui/UserAvatar';
import { User } from '../../types';

interface SettingsSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User;
}

export const SettingsSlideOver: React.FC<SettingsSlideOverProps> = ({ isOpen, onClose, onSave, user }) => {
  // Form states
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState('Founder AMATI Studio');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || 'preset:avatar-1');
  const [dailyLimit, setDailyLimit] = useState(8);
  const [activeDays, setActiveDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);

  // Slide-over animation visibility
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexa_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.role) setRole(parsed.role);
      if (parsed.dailyLimit) setDailyLimit(parsed.dailyLimit);
      if (parsed.activeDays) setActiveDays(parsed.activeDays);
      if (parsed.alertsEnabled !== undefined) setAlertsEnabled(parsed.alertsEnabled);
      if (parsed.hideCompleted !== undefined) setHideCompleted(parsed.hideCompleted);
    }
  }, []);

  // Sync state with open/close triggers
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Reset form states to current user values on open
      setName(user.name);
      setAvatarUrl(user.avatarUrl || 'preset:avatar-1');
      setTimeout(() => setIsActive(true), 50);
    } else {
      setIsActive(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  const handleDayToggle = (day: string, index: number) => {
    // Let's create an array of indices that are active
    // But since the mockup keeps track of days simply:
    // Let's track activeDays as index-based strings or just toggle it
    if (activeDays.includes(`${day}-${index}`)) {
      setActiveDays(prev => prev.filter(d => d !== `${day}-${index}`));
    } else {
      setActiveDays(prev => [...prev, `${day}-${index}`]);
    }
  };

  const isDayActive = (day: string, index: number) => {
    // If activeDays is simple day strings (old format), support compatibility
    if (activeDays.includes(day) && !activeDays.some(d => d.includes('-'))) {
      return true;
    }
    return activeDays.includes(`${day}-${index}`);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    // 1. Update user identity
    const updatedUser = {
      ...user,
      name: name.trim(),
      avatarUrl: avatarUrl
    };
    localStorage.setItem('nexa_user', JSON.stringify(updatedUser));

    // 2. Save settings
    const settings = {
      role: role.trim(),
      dailyLimit: Number(dailyLimit) || 8,
      activeDays: activeDays,
      alertsEnabled: alertsEnabled,
      hideCompleted: hideCompleted
    };
    localStorage.setItem('nexa_settings', JSON.stringify(settings));

    onSave();
  };

  if (!isRendered) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`} onClick={onClose}>
      
      {/* Side Panel */}
      <div 
        className={`w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${
          isActive ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
          <h2 className="font-display font-black text-xl text-[#15113d]">Profile & Settings</h2>
          <button 
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-[#1E1E24]" 
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </header>

        {/* Body (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Choose Avatar */}
          <section className="space-y-3">
            <label className="block font-sans font-bold text-xs text-[#1E1E24] uppercase tracking-wider">Choose Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatarUrl === `preset:${preset.id}`;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setAvatarUrl(`preset:${preset.id}`)}
                    className={`w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-[#7C3AED] ring-offset-2 scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <img src={preset.path} alt={`Avatar ${preset.id}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Personal Info */}
          <section className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#F3F4F6] space-y-4">
            <div className="space-y-1">
              <label className="font-sans font-bold text-[11px] text-[#9CA3AF] uppercase tracking-wider">Full Name</label>
              <input 
                className="w-full bg-white border border-[#F3F4F6] rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 text-[#1E1E24]" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-sans font-bold text-[11px] text-[#9CA3AF] uppercase tracking-wider">Role / Title</label>
              <input 
                className="w-full bg-white border border-[#F3F4F6] rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 text-[#1E1E24]" 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-sans font-bold text-[11px] text-[#9CA3AF] uppercase tracking-wider">Email Address</label>
              <input 
                className="w-full bg-gray-100 border border-[#F3F4F6] rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed" 
                disabled 
                type="email" 
                value={user?.email || 'bahrul@students.unnes.ac.id'}
              />
            </div>
          </section>

          {/* Workload Capacity */}
          <section className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#F3F4F6] space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-sans font-bold text-xs text-[#1E1E24] uppercase tracking-wider">Daily Limit (Hours)</label>
              <input 
                className="w-20 bg-white border border-[#F3F4F6] rounded-xl py-1.5 text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 text-[#1E1E24]" 
                type="number" 
                min={1}
                max={24}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans font-bold text-[11px] text-[#9CA3AF] uppercase tracking-wider">Active Work Days</label>
              <div className="flex gap-1.5 flex-wrap">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                  const active = isDayActive(day, index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleDayToggle(day, index)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        active 
                          ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20' 
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-bold text-xs text-[#1E1E24]">Workload Alerts</p>
                <p className="font-sans text-[11px] font-bold text-[#9CA3AF]">Notify when capacity exceeds limit</p>
              </div>
              <button 
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  alertsEnabled ? 'bg-[#7C3AED]' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-bold text-xs text-[#1E1E24]">Hide Completed Tasks</p>
                <p className="font-sans text-[11px] font-bold text-[#9CA3AF]">Keep your workspace clutter-free</p>
              </div>
              <button 
                onClick={() => setHideCompleted(!hideCompleted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  hideCompleted ? 'bg-[#7C3AED]' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  hideCompleted ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-[#F3F4F6] flex gap-4 bg-white">
          <button 
            className="flex-1 px-4 py-2.5 border border-[#F3F4F6] text-[#1E1E24] font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 px-4 py-2.5 bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7C3AED]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </footer>
      </div>

    </div>
  );
};

export default SettingsSlideOver;
