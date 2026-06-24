import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../ui/UserAvatar';
import { User } from '../../types';

interface TopNavbarProps {
  user: User | null;
  onProfileClick: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ user, onProfileClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isFocusMode = location.pathname === '/focus';

  if (isFocusMode) {
    return (
      <header className="flex justify-between items-center px-8 py-5 bg-[#F8F9FB] z-10 sticky top-0 shrink-0 select-none">
        {/* Breadcrumbs (Left) */}
        <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#9CA3AF]">
          <span className="cursor-pointer hover:text-[#1E1E24]" onClick={() => navigate('/tasks')}>My Tasks</span>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-[#15113d] font-black">Focus Mode</span>
        </div>

        {/* Exit & Avatar (Right) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#F3F4F6] rounded-xl font-sans text-xs font-bold text-[#1E1E24] hover:bg-[#F8F9FB] transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
            Exit Focus Mode
          </button>

          {/* Profile Circle */}
          <button onClick={onProfileClick} className="cursor-pointer">
            <UserAvatar avatarUrl={user?.avatarUrl} className="w-8 h-8" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center px-8 py-5 bg-[#F8F9FB] z-10 sticky top-0 shrink-0">
      {/* Search Bar (Left) */}
      <div className="relative w-1/3 min-w-[240px]">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs"></i>
        <input
          type="text"
          placeholder="Search tasks, teams, projects..."
          className="w-full bg-white border border-[#F3F4F6] shadow-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#15113d]/10 font-sans text-xs font-semibold text-[#1E1E24] transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Actions & Profile (Right) */}
      <div className="flex items-center gap-5">
        {/* Outlined Notification Bell */}
        <button className="text-[#15113d] opacity-80 hover:opacity-100 transition-opacity p-2 cursor-pointer flex items-center justify-center">
          <i className="fa-solid fa-bell text-lg"></i>
        </button>

        {/* Profile Group: Avatar + Name + Dropdown */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onProfileClick}>
          <UserAvatar avatarUrl={user?.avatarUrl} className="w-10 h-10" />
          <span className="font-sans font-bold text-[14px] text-[#15113d] hidden sm:flex items-center gap-1.5 select-none">
            {user?.name || 'Muhammad Bahrul Widad'}
            <i className="fa-solid fa-chevron-down text-xs text-[#15113d]/60 group-hover:translate-y-0.5 transition-transform duration-200"></i>
          </span>
        </div>
      </div>
    </header>
  );
};
export default TopNavbar;
