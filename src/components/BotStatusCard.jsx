// src/components/BotStatusCard.jsx
import React from 'react';

const BotStatusCard = ({ status, onRestart }) => {
  if (!status) return <div>جاري التحميل...</div>;

  const getStatusColor = () => {
    switch (status.status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'initializing':
      case 'waiting_for_qr_scan':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'ready':
        return 'جاهز للتشغيل';
      case 'waiting_for_qr_scan':
        return 'في انتظار مسح كود QR';
      case 'initializing':
        return 'جاري التهيئة';
      default:
        return 'غير متصل';
    }
  };

  const formatUptime = (uptime) => {
    if (!uptime) return '';
    return `${uptime.days} يوم, ${uptime.hours} ساعة, ${uptime.minutes} دقيقة`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">حالة البوت</h2>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">وقت البدء:</span>
          <span className="font-medium">{new Date(status.startTime).toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">مدة التشغيل:</span>
          <span className="font-medium">{formatUptime(status.uptime)}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">عدد المحادثات:</span>
          <span className="font-medium">{status.totalChats}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">آخر تحديث:</span>
          <span className="font-medium">{new Date(status.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        إعادة تشغيل البوت
      </button>
    </div>
  );
};

export default BotStatusCard;