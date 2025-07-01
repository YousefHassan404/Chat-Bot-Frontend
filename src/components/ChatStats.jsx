// src/components/ChatStats.jsx
import React from 'react';

const ChatStats = ({ stats }) => {
  if (!stats) return <div>جاري التحميل...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">إحصائيات المحادثات</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{stats.totalChats}</div>
          <div className="text-gray-600">المحادثات النشطة</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{stats.totalMessages}</div>
          <div className="text-gray-600">إجمالي الرسائل</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">المحادثات النشطة حالياً</span>
          <span className="font-medium">{stats.activeChats}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(stats.activeChats / stats.totalChats) * 100 || 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">متوسط وقت الرد</span>
          <span className="font-medium">12 ثانية</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">معدل الرضا</span>
          <span className="font-medium">94%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">الطلبات المغلقة</span>
          <span className="font-medium">87%</span>
        </div>
      </div>
    </div>
  );
};

export default ChatStats;