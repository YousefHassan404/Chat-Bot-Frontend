import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Send, 
  QrCode, 
  Clock, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Trash2,
  BarChart3,
  Users,
  MessageSquare,
  Package,
  Search,
  RefreshCw
} from 'lucide-react';

const WhatsAppBotDashboard = () => {
  const [botStatus, setBotStatus] = useState('initializing');
  const [qrCode, setQrCode] = useState(null);
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState({ number: '', message: '' });
  const [notifications, setNotifications] = useState([]);
  const [chatStats, setChatStats] = useState({ totalChats: 0, totalMessages: 0, activeChats: 0 });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [shippingResponses, setShippingResponses] = useState([]);
  const [clientShippings, setClientShippings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Base API URL
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3000/api';

  // إضافة إشعار
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // جلب حالة البوت
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/status`);
      const data = await response.json();
      setBotStatus(data.status);
      setUptime(data.uptime);
      
      if (data.qrAvailable) {
        fetchQRCode();
      } else {
        setQrCode(null);
      }
    } catch (error) {
      console.error('خطأ في جلب الحالة:', error);
      setBotStatus('error');
      addNotification('خطأ في الاتصال بالسيرفر', 'error');
    }
  };

  // جلب إحصائيات المحادثات
  const fetchChatStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat-stats`);
      const data = await response.json();
      setChatStats(data);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // جلب كود QR
  const fetchQRCode = async () => {
    try {
      const response = await fetch(`${API_BASE}/qr`);
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCode);
      } else {
        setQrCode(null);
      }
    } catch (error) {
      console.error('خطأ في جلب كود QR:', error);
    }
  };

  // إعادة تشغيل البوت
  const restartBot = async () => {
    if (!window.confirm('هل أنت متأكد من إعادة تشغيل البوت؟ سيتم حذف بيانات المصادقة السابقة.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        addNotification('تم إعادة تشغيل البوت بنجاح', 'success');
        setBotStatus('restarting');
        setQrCode(null);
        setTimeout(() => {
          fetchStatus();
          fetchChatStats();
        }, 3000);
      } else {
        addNotification(data.message || 'فشل في إعادة التشغيل', 'error');
      }
    } catch (error) {
      addNotification('خطأ في الاتصال', 'error');
    } finally {
      setLoading(false);
    }
  };

  // مسح تاريخ المحادثات
  const clearHistory = async () => {
    if (!window.confirm('هل أنت متأكد من مسح تاريخ جميع المحادثات؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/clear-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        addNotification('تم مسح تاريخ المحادثات بنجاح', 'success');
        setChatStats({ totalChats: 0, totalMessages: 0, activeChats: 0 });
      } else {
        addNotification(data.message || 'فشل في مسح التاريخ', 'error');
      }
    } catch (error) {
      addNotification('خطأ في الاتصال', 'error');
    } finally {
      setLoading(false);
    }
  };

  // إرسال رسالة
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!sendMessage.number || !sendMessage.message) {
      addNotification('الرجاء إدخال الرقم والرسالة', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendMessage)
      });
      const data = await response.json();
      
      if (data.success) {
        addNotification('تم إرسال الرسالة بنجاح', 'success');
        setSendMessage({ number: '', message: '' });
        // تحديث الإحصائيات بعد إرسال الرسالة
        setTimeout(fetchChatStats, 1000);
      } else {
        addNotification(data.message || 'فشل في إرسال الرسالة', 'error');
      }
    } catch (error) {
      addNotification('خطأ في إرسال الرسالة', 'error');
    } finally {
      setLoading(false);
    }
  };

  // البحث عن ردود الشحن
  const fetchShippingResponses = async () => {
    if (!trackingNumber.trim()) {
      addNotification('الرجاء إدخال رقم التتبع', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/responses/${trackingNumber}`);
      const data = await response.json();
      
      if (data.success) {
        setShippingResponses(data.responses);
        addNotification(`تم العثور على ${data.responses.length} رد لرقم التتبع`, 'success');
      } else {
        setShippingResponses([]);
        addNotification(data.message || 'لم يتم العثور على ردود', 'info');
      }
    } catch (error) {
      addNotification('خطأ في البحث', 'error');
      setShippingResponses([]);
    } finally {
      setLoading(false);
    }
  };

  // جلب شحنات العميل
  const fetchClientShippings = async () => {
    if (!clientId.trim()) {
      addNotification('الرجاء إدخال معرف العميل', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/client-shippings/${clientId}`);
      const data = await response.json();
      
      if (data.success) {
        setClientShippings(data.shippings);
        if (data.shippings.length === 0) {
          addNotification('لا توجد شحنات مسجلة لهذا العميل', 'info');
        } else {
          addNotification(`تم العثور على ${data.shippings.length} شحنة`, 'success');
        }
      } else {
        setClientShippings([]);
        addNotification(data.message || 'فشل في جلب البيانات', 'error');
      }
    } catch (error) {
      addNotification('خطأ في البحث', 'error');
      setClientShippings([]);
    } finally {
      setLoading(false);
    }
  };

  // تحديث تلقائي
  useEffect(() => {
    fetchStatus();
    fetchChatStats();
    const interval = setInterval(() => {
      fetchStatus();
      fetchChatStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // تحديد لون ونص الحالة
  const getStatusInfo = (status) => {
    switch (status) {
      case 'ready':
        return { 
          color: 'text-green-600 bg-green-100', 
          icon: CheckCircle, 
          text: 'البوت جاهز ويعمل',
          dotColor: 'bg-green-500'
        };
      case 'waiting_for_qr_scan':
        return { 
          color: 'text-amber-600 bg-amber-100', 
          icon: QrCode, 
          text: 'في انتظار مسح كود QR',
          dotColor: 'bg-amber-500'
        };
      case 'initializing':
      case 'restarting':
        return { 
          color: 'text-blue-600 bg-blue-100', 
          icon: Loader, 
          text: 'جاري التهيئة...',
          dotColor: 'bg-blue-500'
        };
      default:
        return { 
          color: 'text-red-600 bg-red-100', 
          icon: AlertCircle, 
          text: 'غير متصل',
          dotColor: 'bg-red-500'
        };
    }
  };

  const statusInfo = getStatusInfo(botStatus);
  const StatusIcon = statusInfo.icon;

  // مكون التبويبات
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
        activeTab === id
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* الإشعارات */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">لوحة تحكم بوت WhatsApp</h1>
          </div>
          <p className="text-gray-600 text-lg">البوت الذكي مع تكامل الذكاء الاصطناعي وإدارة الشحن</p>
        </div>

        {/* شريط التبويبات */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <TabButton id="dashboard" label="لوحة التحكم" icon={Activity} />
          <TabButton id="messaging" label="إرسال الرسائل" icon={Send} />
          <TabButton id="shipping" label="إدارة الشحن" icon={Package} />
          <TabButton id="stats" label="الإحصائيات" icon={BarChart3} />
        </div>

        {/* محتوى التبويبات */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* بطاقة الحالة */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-indigo-600" />
                    حالة البوت
                  </h2>
                  <div className={`flex items-center px-4 py-2 rounded-full ${statusInfo.color}`}>
                    <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor} mr-2 animate-pulse`}></div>
                    <StatusIcon className={`w-5 h-5 mr-2 ${statusInfo.icon === Loader ? 'animate-spin' : ''}`} />
                    <span className="font-semibold">{statusInfo.text}</span>
                  </div>
                </div>

                {/* معلومات وقت التشغيل */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-700">وقت التشغيل</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { value: uptime.days, label: 'يوم' },
                      { value: uptime.hours, label: 'ساعة' },
                      { value: uptime.minutes, label: 'دقيقة' },
                      { value: uptime.seconds, label: 'ثانية' }
                    ].map((item, index) => (
                      <div key={index} className="text-center bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-2xl font-bold text-indigo-600">{item.value}</div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={fetchStatus}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    تحديث الحالة
                  </button>
                  <button
                    onClick={restartBot}
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="w-5 h-5 mr-2" />
                    )}
                    إعادة التشغيل
                  </button>
                  <button
                    onClick={clearHistory}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    مسح التاريخ
                  </button>
                </div>
              </div>
            </div>

            {/* بطاقة كود QR */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <QrCode className="w-6 h-6 mr-2 text-green-600" />
                كود QR
              </h3>
              <div className="text-center">
                {qrCode ? (
                  <div className="space-y-4">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-full max-w-64 mx-auto border-4 border-green-500 rounded-2xl shadow-lg"
                    />
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold">
                        امسح الكود من تطبيق واتساب لربط البوت
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        الكود صالح لمدة محدودة
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-gray-400">
                    <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-semibold">لا يوجد كود QR متاح حالياً</p>
                    {botStatus === 'ready' ? (
                      <div className="mt-4 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-green-700 font-semibold">البوت متصل بالفعل</p>
                      </div>
                    ) : (
                      <p className="text-sm mt-2">انتظر تهيئة البوت...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messaging' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Send className="w-6 h-6 mr-2 text-purple-600" />
              إرسال رسالة تجريبية
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف (مع رمز البلد)
                  </label>
                  <input
                    type="text"
                    value={sendMessage.number}
                    onChange={(e) => setSendMessage(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="مثال: 201234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الرسالة
                  </label>
                  <textarea
                    value={sendMessage.message}
                    onChange={(e) => setSendMessage(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="أدخل نص الرسالة..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={loading || botStatus !== 'ready'}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center text-lg"
              >
                {loading ? (
                  <Loader className="w-6 h-6 mr-2 animate-spin" />
                ) : (
                  <Send className="w-6 h-6 mr-2" />
                )}
                إرسال الرسالة
              </button>
              
              {botStatus !== 'ready' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                    <p className="text-amber-700 font-semibold">
                      يجب أن يكون البوت في حالة "جاهز" لإرسال الرسائل
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            {/* البحث عن ردود الشحن */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Search className="w-6 h-6 mr-2 text-blue-600" />
                البحث عن ردود الشحن
              </h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="أدخل رقم التتبع..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={fetchShippingResponses}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {shippingResponses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">الردود المتوفرة:</h3>
                  {shippingResponses.map((response, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-600">
                          {new Date(response.date).toLocaleString('ar-EG')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          response.sent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {response.sent ? 'تم الإرسال' : 'لم يتم الإرسال'}
                        </span>
                      </div>
                      <p className="text-gray-800">{response.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* شحنات العميل */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600" />
                شحنات العميل
              </h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="أدخل معرف العميل..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={fetchClientShippings}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {clientShippings.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right p-3 border-b font-semibold text-gray-700">رقم التتبع</th>
                        <th className="text-right p-3 border-b font-semibold text-gray-700">شركة الشحن</th>
                        <th className="text-right p-3 border-b font-semibold text-gray-700">الحالة</th>
                        <th className="text-right p-3 border-b font-semibold text-gray-700">تاريخ الإنشاء</th>
                        <th className="text-right p-3 border-b font-semibold text-gray-700">عدد الردود</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientShippings.map((shipping, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 border-b font-mono text-sm">{shipping.trackingNumber}</td>
                          <td className="p-3 border-b">{shipping.companyName}</td>
                          <td className="p-3 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              shipping.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {shipping.status === 'active' ? 'نشط' : shipping.status}
                            </span>
                          </td>
                          <td className="p-3 border-b text-sm">
                            {new Date(shipping.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="p-3 border-b text-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {shipping.responsesCount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* إحصائيات المحادثات */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">إجمالي المحادثات</h3>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{chatStats.totalChats}</div>
              <p className="text-sm text-gray-600">عدد المحادثات المسجلة</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">إجمالي الرسائل</h3>
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{chatStats.totalMessages}</div>
              <p className="text-sm text-gray-600">عدد الرسائل المرسلة والمستقبلة</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">المحادثات النشطة</h3>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{chatStats.activeChats}</div>
              <p className="text-sm text-gray-600">المحادثات النشطة خلال الساعة الماضية</p>
            </div>

            {/* معلومات إضافية */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">حالة الاتصال</h3>
                {botStatus === 'ready' ? (
                  <Wifi className="w-8 h-8 text-green-600" />
                ) : (
                  <WifiOff className="w-8 h-8 text-red-600" />
                )}
              </div>
              <div className={`text-lg font-semibold mb-2 ${
                botStatus === 'ready' ? 'text-green-600' : 'text-red-600'
              }`}>
                {botStatus === 'ready' ? 'متصل' : 'غير متصل'}
              </div>
              <p className="text-sm text-gray-600">
                {botStatus === 'ready' ? 'البوت يعمل بشكل طبيعي' : 'البوت غير متاح حالياً'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">الذكاء الاصطناعي</h3>
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-green-600 mb-2">مفعل</div>
              <p className="text-sm text-gray-600">نظام الذكاء الاصطناعي يعمل</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">المراقبة</h3>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-green-600 mb-2">نشطة</div>
              <p className="text-sm text-gray-600">مراقبة مستمرة للنظام</p>
            </div>
          </div>
        )}

        {/* معلومات سريعة في أسفل الصفحة */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${
                botStatus === 'ready' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {botStatus === 'ready' ? (
                  <Wifi className="w-6 h-6 text-green-600" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="mr-4">
                <h4 className="font-semibold text-gray-800">حالة الاتصال</h4>
                <p className="text-sm text-gray-600">
                  {botStatus === 'ready' ? 'متصل' : 'غير متصل'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <h4 className="font-semibold text-gray-800">الذكاء الاصطناعي</h4>
                <p className="text-sm text-gray-600">مفعل ويعمل</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <h4 className="font-semibold text-gray-800">النشاط</h4>
                <p className="text-sm text-gray-600">مراقبة مستمرة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <h4 className="font-semibold text-gray-800">إدارة الشحن</h4>
                <p className="text-sm text-gray-600">متاح ونشط</p>
              </div>
            </div>
          </div>
        </div>

        {/* تذييل الصفحة */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <p className="text-gray-600 mb-2">
              <strong>بوت WhatsApp الذكي</strong> - نظام متكامل لإدارة المحادثات والشحن
            </p>
            <p className="text-sm text-gray-500">
              آخر تحديث: {new Date().toLocaleString('ar-EG')}
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4 space-x-reverse">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  botStatus === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  الحالة: {statusInfo.text}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-600">
                  التحديث التلقائي كل 5 ثوانٍ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        
        .hover\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppBotDashboard;