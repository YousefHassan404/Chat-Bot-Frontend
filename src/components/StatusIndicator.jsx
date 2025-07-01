import React from 'react';

const StatusIndicator = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'ready':
      colorClass = 'bg-green-500';
      break;
    case 'waiting_for_qr_scan':
      colorClass = 'bg-orange-500';
      break;
    case 'initializing':
      colorClass = 'bg-sky-500';
      break;
    case 'restarting':
      colorClass = 'bg-purple-500';
      break;
    case 'auth_failed':
    case 'disconnected':
    default:
      colorClass = 'bg-red-500';
  }

  return (
    <span className={`inline-block w-3 h-3 rounded-full ml-2 ${colorClass}`}></span>
  );
};

export default StatusIndicator;