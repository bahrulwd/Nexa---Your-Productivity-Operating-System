import React from 'react';

export const AppContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-grow flex flex-col overflow-hidden relative bg-white">
      {children}
    </div>
  );
};
export default AppContainer;
