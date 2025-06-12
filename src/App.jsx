


import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Smartphone, 
  QrCode, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Activity,
  Users,
  Send,
  Download
} from 'lucide-react';

const WhatsAppBotDashboard = () => {
  const [botStatus, setBotStatus] = useState('initializing');
  const [qrCode, setQrCode] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ 
    totalMessages: 0, 
    activeChats: 0, 
    uptime: '00:00:00' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [qrVisible, setQrVisible] = useState(false);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const pollingRef = useRef(null);

  const API_BASE_URL = 'https://chat-bot-backend.fly.dev/api';

  // Status configurations
  const statusConfig = {
    initializing: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      icon: Clock,
      message: 'جاري تهيئة البوت...',
      description: 'النظام يتم تحضيره للعمل'
    },
    qr_ready: {
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      icon: QrCode,
      message: 'جاهز للمسح',
      description: 'امسح الكود باستخدام واتساب'
    },
    authenticated: {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      message: 'تم التحقق بنجاح',
      description: 'جاري تحميل بيانات الحساب'
    },
    ready: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      icon: CheckCircle,
      message: 'البوت يعمل بنجاح',
      description: 'مستعد لاستقبال الرسائل'
    },
    disconnected: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: WifiOff,
      message: 'منقطع الاتصال',
      description: 'جاري محاولة إعادة الاتصال'
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: AlertCircle,
      message: 'خطأ في النظام',
      description: 'يرجى مراجعة الإعدادات'
    }
  };

  const currentStatus = statusConfig[botStatus] || statusConfig.initializing;

  // Polling function for status updates
  const pollStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      
      console.log('Status update:', data); // للتتبع
      
      handleStatusUpdate(data);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setIsConnected(false);
    }
  };

  // Initialize polling and uptime counter
  useEffect(() => {
    // Initial fetch
    fetchInitialData();
    
    // Start polling every 2 seconds
    pollingRef.current = setInterval(pollStatus, 2000);
    
    // Update uptime every second
    intervalRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        uptime: calculateUptime()
      }));
    }, 1000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStatusUpdate = (data) => {
    const prevStatus = botStatus;
    
    setBotStatus(data.status);
    setLastUpdate(new Date());
    
    // Handle QR code updates
    if (data.qrCode && data.qrCode !== qrCode) {
      console.log('QR Code updated:', data.qrCode);
      setQrCode(data.qrCode);
      setQrVisible(true);
      
      // Fetch QR image if available
      if (data.qrImage) {
        setQrImage(data.qrImage);
      } else {
        fetchQRImage();
      }
    }
    
    // Clear QR code when authenticated or ready
    if (data.status === 'authenticated' || data.status === 'ready') {
      setQrCode(null);
      setQrImage(null);
      setQrVisible(false);
    }
    
    // Handle message updates
    if (data.messageInfo) {
      setMessages(prev => [...prev.slice(-9), {
        id: Date.now(),
        type: 'received',
        content: data.messageInfo.content,
        from: data.messageInfo.from,
        timestamp: new Date()
      }]);
      setStats(prev => ({ 
        ...prev, 
        totalMessages: prev.totalMessages + 1 
      }));
    }
    
    if (data.replyInfo) {
      setMessages(prev => [...prev.slice(-9), {
        id: Date.now() + 1,
        type: 'sent',
        content: data.replyInfo.content,
        to: data.replyInfo.to,
        timestamp: new Date()
      }]);
    }
  };

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      handleStatusUpdate(data);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const fetchQRImage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/qr`);
      const data = await response.json();
      
      if (data.success && data.qrImage) {
        setQrImage(data.qrImage);
      }
    } catch (error) {
      console.error('Failed to fetch QR image:', error);
    }
  };

  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/qr`);
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCode);
        setQrImage(data.qrImage);
        setQrVisible(true);
      }
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartBot = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/restart`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setBotStatus('initializing');
        setQrCode(null);
        setQrImage(null);
        setQrVisible(false);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to restart bot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = 'whatsapp-qr-code.png';
      link.click();
    }
  };

  const calculateUptime = () => {
    const now = new Date();
    const start = new Date(now.getTime() - Math.random() * 3600000); // Simulated start time
    const diff = now - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ديجيباكس WhatsApp Bot</h1>
                  <p className="text-sm text-gray-500">نظام إدارة خدمة العملاء</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-500">
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              
              <button
                onClick={restartBot}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                إعادة تشغيل
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className={`${currentStatus.bgColor} px-6 py-4 border-b border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${currentStatus.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <StatusIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${currentStatus.textColor}`}>
                        {currentStatus.message}
                      </h2>
                      <p className="text-sm text-gray-600">{currentStatus.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">آخر تحديث</p>
                    <p className="text-sm font-medium text-gray-700">
                      {lastUpdate.toLocaleTimeString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Section - Always show when QR is available */}
              {(qrVisible || botStatus === 'qr_ready') && (
                <div className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      امسح الكود باستخدام واتساب
                    </h3>
                    <div className="inline-block bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
                      {qrImage ? (
                        <img 
                          src={qrImage} 
                          alt="WhatsApp QR Code" 
                          className="w-64 h-64 mx-auto rounded-xl"
                        />
                      ) : qrCode ? (
                        <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                            <p className="text-gray-700 font-medium">QR Code متاح</p>
                            <p className="text-gray-500 text-sm">جاري تحميل الصورة...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">جاري تحميل الكود...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={fetchQRCode}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>تحديث الكود</span>
                      </button>
                      
                      {qrImage && (
                        <button
                          onClick={downloadQRCode}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل</span>
                        </button>
                      )}
                    </div>
                    
                    {qrCode && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>تعليمات:</strong> افتح واتساب على هاتفك ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز ← امسح الكود
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ready State Info */}
              {botStatus === 'ready' && (
                <div className="p-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-bold text-green-800">البوت جاهز للعمل!</h3>
                    </div>
                    <p className="text-center text-green-700 mb-4">
                      النظام متصل بنجاح ومستعد لاستقبال رسائل العملاء
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">نشط</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">متاح للعملاء</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Send className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">يرد تلقائياً</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">إجمالي الرسائل</span>
                  <span className="font-bold text-indigo-600">{stats.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">المحادثات النشطة</span>
                  <span className="font-bold text-green-600">{stats.activeChats}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">وقت التشغيل</span>
                  <span className="font-bold text-purple-600 font-mono">{stats.uptime}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">الحالة</span>
                  <span className={`font-bold ${currentStatus.textColor}`}>
                    {currentStatus.message}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الرسائل الأخيرة</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد رسائل حتى الآن</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border ${
                        message.type === 'received'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'received'
                              ? 'bg-blue-200 text-blue-700'
                              : 'bg-green-200 text-green-700'
                          }`}
                        >
                          {message.type === 'received' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBotDashboard;