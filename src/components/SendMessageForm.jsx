// src/components/SendMessageForm.jsx
import React, { useState } from 'react';

const SendMessageForm = () => {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // محاكاة لإرسال الرسالة
    setTimeout(() => {
      setIsSending(false);
      setResult({
        success: true,
        message: 'تم إرسال الرسالة بنجاح إلى العميل'
      });
      setNumber('');
      setMessage('');
      
      // إخفاء النتيجة بعد 3 ثواني
      setTimeout(() => {
        setResult(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">إرسال رسالة تجريبية</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">رقم الهاتف</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل رقم الهاتف مع رمز الدولة"
            required
          />
          <p className="text-xs text-gray-500 mt-1">مثال: 201234567890</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">الرسالة</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل محتوى الرسالة..."
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSending}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإرسال...
            </span>
          ) : (
            'إرسال الرسالة'
          )}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-3 rounded-lg ${
          result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default SendMessageForm;