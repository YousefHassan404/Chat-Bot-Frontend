// src/components/QRCodeDisplay.jsx
import React from 'react';

const QRCodeDisplay = ({ qrCode }) => {
  if (!qrCode) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-full">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">كود QR</h2>
        <p className="text-gray-500 text-center">لا يوجد كود QR متاح حالياً. البوت في حالة التشغيل.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold mb-4">كود QR</h2>
      <p className="text-gray-600 mb-4 text-center">امسح الكود من تطبيق واتساب لتوصيل البوت</p>
      <img src={qrCode} alt="QR Code" className="w-48 h-48 border-4 border-blue-100 rounded-lg" />
      <p className="mt-4 text-sm text-gray-500">هذا الكود صالح لمدة 60 ثانية</p>
    </div>
  );
};

export default QRCodeDisplay;