// src/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BotStatusCard from './components/BotStatusCard';
import QRCodeDisplay from './components/QRCodeDisplay';
import ChatStats from './components/ChatStats';
import ShippingRequests from './components/ShippingRequests';
import SendMessageForm from './components/SendMessageForm';
import SystemControls from './components/SystemControls';

const API_BASE = 'http://localhost:3000/api';

function Home() {
  const [botStatus, setBotStatus] = useState(null);
  const [qrCode, setQRCode] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [shippingRequests, setShippingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBotStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/status`);
      setBotStatus(response.data);
      setQRCode(response.data.qrAvailable ? response.data.qrCode : null);
    } catch (error) {
      console.error('Error fetching bot status:', error);
    }
  };

  const fetchChatStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/chat-stats`);
      setChatStats(response.data);
    } catch (error) {
      console.error('Error fetching chat stats:', error);
    }
  };

  const fetchShippingRequests = async () => {
    try {
      // هذا مثال فقط - في التطبيق الفعلي ستكون هناك API للحصول على الطلبات
      const mockRequests = [
        {
          id: 'HTC123456',
          company: 'شركة الشحن السريع',
          customer: 'محمد أحمد',
          issue: 'تأخر في التسليم',
          status: 'pending',
          date: '2023-06-15T10:30:00Z',
          responses: 0
        },
        {
          id: 'feeri789012',
          company: 'فييري للشحن',
          customer: 'سارة خالد',
          issue: 'تلف المنتج',
          status: 'resolved',
          date: '2023-06-14T14:20:00Z',
          responses: 2
        }
      ];
      setShippingRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching shipping requests:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchBotStatus();
      await fetchChatStats();
      await fetchShippingRequests();
      setIsLoading(false);
    };

    init();

    // تحديث البيانات كل 10 ثواني
    const interval = setInterval(() => {
      fetchBotStatus();
      fetchChatStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRestartBot = async () => {
    try {
      await axios.post(`${API_BASE}/restart`);
      setTimeout(() => {
        fetchBotStatus();
      }, 5000);
    } catch (error) {
      console.error('Error restarting bot:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.post(`${API_BASE}/clear-history`);
      fetchChatStats();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط التنقل */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold">ديجيباكس للدعم الفني</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-1 rounded-full hover:bg-blue-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span>المسؤول</span>
            </div>
          </div>
        </div>
      </nav>

      {/* علامات التبويب */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button 
              className={`py-4 px-1 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              لوحة التحكم
            </button>
            <button 
              className={`py-4 px-1 font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('requests')}
            >
              طلبات الشحن
            </button>
            <button 
              className={`py-4 px-1 font-medium ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('settings')}
            >
              الإعدادات
            </button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* حالة البوت */}
            <BotStatusCard status={botStatus} onRestart={handleRestartBot} />
            
            {/* كود QR */}
            <QRCodeDisplay qrCode={qrCode} />
            
            {/* إحصائيات المحادثات */}
            <ChatStats stats={chatStats} />
            
            {/* إرسال رسالة تجريبية */}
            <div className="lg:col-span-2">
              <SendMessageForm />
            </div>
            
            {/* طلبات الشحن الحديثة */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h6.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-7a1 1 0 00-1-1h-9.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 007.586 2H3z" />
                </svg>
                آخر طلبات الشحن
              </h2>
              <div className="space-y-3">
                {shippingRequests.slice(0, 3).map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">رقم الشحنة: {request.id}</p>
                        <p className="text-sm text-gray-500">{request.company}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {request.status === 'pending' ? 'قيد المعالجة' : 'تم الحل'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>{request.customer}</span>
                      <span>{new Date(request.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('requests')}
                className="mt-4 w-full py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                عرض جميع الطلبات →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <ShippingRequests requests={shippingRequests} />
        )}

        {activeTab === 'settings' && (
          <SystemControls onRestart={handleRestartBot} onClearHistory={handleClearHistory} />
        )}
      </main>

      {/* تذييل الصفحة */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <span className="ml-2 text-xl font-bold">ديجيباكس</span>
              </div>
              <p className="mt-2 text-gray-400">نظام الدعم الفني المتكامل</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ديجيباكس. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;