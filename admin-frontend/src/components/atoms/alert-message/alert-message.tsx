import React from 'react';

interface AlertMessageProps {
  title: string; 
  message: string; 
}

const AlertMessage: React.FC<AlertMessageProps> = ({ title, message }) => {
  return (
    <div
      className="bg-states-ok border-2 border-states-ok text-states-ok p-4 rounded-lg flex items-center space-x-2 w-[760px] h-[78px]"
      role="alert"
    >
      {/* Icon */}
      <span className="text-states-ok text-lg">✅</span>

      {/* Title and Message */}
      <div>
        <p className="font-medium text-md">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default AlertMessage;