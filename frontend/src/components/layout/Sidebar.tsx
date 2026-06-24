import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../lib/api';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/login');
    }
  };

  const menuItems: Array<{
    name: string;
    path: string;
    iconClass?: string;
    iconSrc?: string;
    iconType?: string;
    isDummy?: boolean;
  }> = [
    { name: 'Dashboard', path: '/', iconClass: 'fa-solid fa-house' },
    { name: 'My Tasks', path: '/tasks', iconClass: 'fa-solid fa-list-check' },
    { name: 'Messages', path: '/chat', iconSrc: '/images/icon/NexaFocus.png', iconType: 'image' },
    { name: 'Workload', path: '/workload', iconClass: 'fa-solid fa-chart-column' },
  ];

  const activeIndex = menuItems.findIndex((item) => {
    if (item.isDummy) return false;
    if (item.path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(item.path);
  });

  return (
    <aside className="w-24 bg-[#2a2753] h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col items-center py-6 justify-between flex-shrink-0 z-20 relative rounded-[32px]">
      
      {/* Top Branding (Nexa Logo) */}
      <div className="mb-4 cursor-pointer select-none" onClick={() => navigate('/')}>
        <img
          src="/images/Logo.png"
          alt="Nexa Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Navigation tabs */}
      <nav className="flex flex-col gap-3 items-stretch w-full my-auto relative">
        
        {/* Moving Active Background Indicator */}
        {activeIndex !== -1 && (
          <div
            className="absolute right-[-1px] left-4 bg-[#F8F9FB] rounded-l-full z-0 transition-all duration-300 ease-out"
            style={{
              top: `${activeIndex * (56 + 12)}px`,
              height: '56px',
            }}
          >
            {/* Top Inverted Corner Curve */}
            <div className="absolute right-0 -top-4 w-4 h-4 bg-transparent rounded-br-[16px] shadow-[0_8px_0_0_#F8F9FB] pointer-events-none z-10" />
            
            {/* Bottom Inverted Corner Curve */}
            <div className="absolute right-0 -bottom-4 w-4 h-4 bg-transparent rounded-tr-[16px] shadow-[0_-8px_0_0_#F8F9FB] pointer-events-none z-10" />
          </div>
        )}

        {menuItems.map((item) => {
          if (item.isDummy) {
            return (
              <button
                key={item.name}
                onClick={() => alert('Feature coming soon!')}
                className="w-full h-14 flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer group"
                title={item.name}
              >
                <span className="relative z-10 flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-200">
                  {item.iconType === 'image' ? (
                    <img
                      src={item.iconSrc}
                      alt={item.name}
                      className="w-5 h-5 object-contain transition-all duration-300"
                      style={{ filter: 'brightness(0) invert(1) opacity(0.7)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(0.7)';
                      }}
                    />
                  ) : (
                    <i className={`${item.iconClass} text-lg`}></i>
                  )}
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-14 flex items-center justify-center relative cursor-pointer group transition-colors duration-300 ${
                  isActive ? 'text-[#2a2753]' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
              title={item.name}
            >
              {({ isActive }) => (
                <span className="relative z-10 flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-200">
                  {item.iconType === 'image' ? (
                    <img
                      src={item.iconSrc}
                      alt={item.name}
                      className="w-5 h-5 object-contain transition-all duration-300"
                      style={{
                        filter: isActive
                          ? 'brightness(0) invert(16%) sepia(19%) saturate(4605%) hue-rotate(222deg) brightness(85%) contrast(98%)'
                          : 'brightness(0) invert(1) opacity(0.7)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(0.7)';
                        }
                      }}
                    />
                  ) : (
                    <i className={`${item.iconClass} text-lg`}></i>
                  )}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center w-full">
        <button
          onClick={handleLogout}
          className="w-full h-14 flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
          title="Sign Out"
        >
          <i className="fa-solid fa-right-from-bracket text-lg"></i>
        </button>
      </div>

    </aside>
  );
};
export default Sidebar;
