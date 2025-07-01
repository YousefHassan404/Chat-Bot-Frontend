// src/components/SystemControls.jsx
import React from 'react';

const SystemControls = ({ onRestart, onClearHistory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">إعدادات النظام</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">مفتاح API الذكاء الاصطناعي</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل مفتاح API"
              value="sk-proj-************"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل البريد الإلكتروني"
              value="yosefhasan01095@gmail.com"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">وقت التحديث التلقائي</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>10 ثواني</option>
              <option>30 ثانية</option>
              <option>دقيقة واحدة</option>
              <option>5 دقائق</option>
            </select>
          </div>
          
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            حفظ الإعدادات
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">أدوات النظام</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">إعادة تشغيل البوت</h3>
            <p className="text-gray-600 text-sm mb-3">سيؤدي هذا إلى إعادة تشغيل خدمة البوت وتحديث كافة الاتصالات</p>
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              إعادة تشغيل البوت
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">مسح تاريخ المحادثات</h3>
            <p className="text-gray-600 text-sm mb-3">سيؤدي هذا إلى حذف كافة سجلات المحادثات المخزنة</p>
            <button
              onClick={onClearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              مسح التاريخ
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">نسخ احتياطي للبيانات</h3>
            <p className="text-gray-600 text-sm mb-3">إنشاء نسخة احتياطية من كافة بيانات النظام</p>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              إنشاء نسخة احتياطية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemControls;