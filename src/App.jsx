


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   MessageCircle, 
//   Smartphone, 
//   QrCode, 
//   RefreshCw, 
//   CheckCircle, 
//   AlertCircle, 
//   Clock, 
//   Wifi, 
//   WifiOff,
//   Activity,
//   Users,
//   Send,
//   Download
// } from 'lucide-react';

// const WhatsAppBotDashboard = () => {
//   const [botStatus, setBotStatus] = useState('initializing');
//   const [qrCode, setQrCode] = useState(null);
//   const [qrImage, setQrImage] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [stats, setStats] = useState({ 
//     totalMessages: 0, 
//     activeChats: 0, 
//     uptime: '00:00:00' 
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
//   const [qrVisible, setQrVisible] = useState(false);
//   const socketRef = useRef(null);
//   const intervalRef = useRef(null);
//   const pollingRef = useRef(null);

//   const API_BASE_URL = 'https://chat-bot-backend-dhtqcg.fly.dev/api';

//   // Status configurations
//   const statusConfig = {
//     initializing: {
//       color: 'bg-yellow-500',
//       textColor: 'text-yellow-700',
//       bgColor: 'bg-yellow-50',
//       icon: Clock,
//       message: 'جاري تهيئة البوت...',
//       description: 'النظام يتم تحضيره للعمل'
//     },
//     qr_ready: {
//       color: 'bg-blue-500',
//       textColor: 'text-blue-700',
//       bgColor: 'bg-blue-50',
//       icon: QrCode,
//       message: 'جاهز للمسح',
//       description: 'امسح الكود باستخدام واتساب'
//     },
//     authenticated: {
//       color: 'bg-green-500',
//       textColor: 'text-green-700',
//       bgColor: 'bg-green-50',
//       icon: CheckCircle,
//       message: 'تم التحقق بنجاح',
//       description: 'جاري تحميل بيانات الحساب'
//     },
//     ready: {
//       color: 'bg-emerald-500',
//       textColor: 'text-emerald-700',
//       bgColor: 'bg-emerald-50',
//       icon: CheckCircle,
//       message: 'البوت يعمل بنجاح',
//       description: 'مستعد لاستقبال الرسائل'
//     },
//     disconnected: {
//       color: 'bg-red-500',
//       textColor: 'text-red-700',
//       bgColor: 'bg-red-50',
//       icon: WifiOff,
//       message: 'منقطع الاتصال',
//       description: 'جاري محاولة إعادة الاتصال'
//     },
//     error: {
//       color: 'bg-red-500',
//       textColor: 'text-red-700',
//       bgColor: 'bg-red-50',
//       icon: AlertCircle,
//       message: 'خطأ في النظام',
//       description: 'يرجى مراجعة الإعدادات'
//     }
//   };

//   const currentStatus = statusConfig[botStatus] || statusConfig.initializing;

//   // Polling function for status updates
//   const pollStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/status`);
//       const data = await response.json();
      
//       console.log('Status update:', data); // للتتبع
      
//       handleStatusUpdate(data);
//       setIsConnected(true);
//     } catch (error) {
//       console.error('Failed to fetch status:', error);
//       setIsConnected(false);
//     }
//   };

//   // Initialize polling and uptime counter
//   useEffect(() => {
//     // Initial fetch
//     fetchInitialData();
    
//     // Start polling every 2 seconds
//     pollingRef.current = setInterval(pollStatus, 2000);
    
//     // Update uptime every second
//     intervalRef.current = setInterval(() => {
//       setStats(prev => ({
//         ...prev,
//         uptime: calculateUptime()
//       }));
//     }, 1000);

//     return () => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current);
//       }
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   const handleStatusUpdate = (data) => {
//     const prevStatus = botStatus;
    
//     setBotStatus(data.status);
//     setLastUpdate(new Date());
    
//     // Handle QR code updates
//     if (data.qrCode && data.qrCode !== qrCode) {
//       console.log('QR Code updated:', data.qrCode);
//       setQrCode(data.qrCode);
//       setQrVisible(true);
      
//       // Fetch QR image if available
//       if (data.qrImage) {
//         setQrImage(data.qrImage);
//       } else {
//         fetchQRImage();
//       }
//     }
    
//     // Clear QR code when authenticated or ready
//     if (data.status === 'authenticated' || data.status === 'ready') {
//       setQrCode(null);
//       setQrImage(null);
//       setQrVisible(false);
//     }
    
//     // Handle message updates
//     if (data.messageInfo) {
//       setMessages(prev => [...prev.slice(-9), {
//         id: Date.now(),
//         type: 'received',
//         content: data.messageInfo.content,
//         from: data.messageInfo.from,
//         timestamp: new Date()
//       }]);
//       setStats(prev => ({ 
//         ...prev, 
//         totalMessages: prev.totalMessages + 1 
//       }));
//     }
    
//     if (data.replyInfo) {
//       setMessages(prev => [...prev.slice(-9), {
//         id: Date.now() + 1,
//         type: 'sent',
//         content: data.replyInfo.content,
//         to: data.replyInfo.to,
//         timestamp: new Date()
//       }]);
//     }
//   };

//   const fetchInitialData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/status`);
//       const data = await response.json();
//       handleStatusUpdate(data);
//     } catch (error) {
//       console.error('Failed to fetch initial data:', error);
//     }
//   };

//   const fetchQRImage = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/qr`);
//       const data = await response.json();
      
//       if (data.success && data.qrImage) {
//         setQrImage(data.qrImage);
//       }
//     } catch (error) {
//       console.error('Failed to fetch QR image:', error);
//     }
//   };

//   const fetchQRCode = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/qr`);
//       const data = await response.json();
      
//       if (data.success) {
//         setQrCode(data.qrCode);
//         setQrImage(data.qrImage);
//         setQrVisible(true);
//       }
//     } catch (error) {
//       console.error('Failed to fetch QR code:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const restartBot = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/restart`, {
//         method: 'POST'
//       });
      
//       if (response.ok) {
//         setBotStatus('initializing');
//         setQrCode(null);
//         setQrImage(null);
//         setQrVisible(false);
//         setMessages([]);
//       }
//     } catch (error) {
//       console.error('Failed to restart bot:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const downloadQRCode = () => {
//     if (qrImage) {
//       const link = document.createElement('a');
//       link.href = qrImage;
//       link.download = 'whatsapp-qr-code.png';
//       link.click();
//     }
//   };

//   const calculateUptime = () => {
//     const now = new Date();
//     const start = new Date(now.getTime() - Math.random() * 3600000); // Simulated start time
//     const diff = now - start;
//     const hours = Math.floor(diff / 3600000);
//     const minutes = Math.floor((diff % 3600000) / 60000);
//     const seconds = Math.floor((diff % 60000) / 1000);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const StatusIcon = currentStatus.icon;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
//                   <MessageCircle className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900">ديجيباكس WhatsApp Bot</h1>
//                   <p className="text-sm text-gray-500">نظام إدارة خدمة العملاء</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 {isConnected ? (
//                   <Wifi className="w-4 h-4 text-green-500" />
//                 ) : (
//                   <WifiOff className="w-4 h-4 text-red-500" />
//                 )}
//                 <span className="text-sm text-gray-500">
//                   {isConnected ? 'متصل' : 'غير متصل'}
//                 </span>
//               </div>
              
//               <button
//                 onClick={restartBot}
//                 disabled={isLoading}
//                 className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
//               >
//                 <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//                 إعادة تشغيل
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Status Card */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className={`${currentStatus.bgColor} px-6 py-4 border-b border-gray-100`}>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-12 h-12 ${currentStatus.color} rounded-xl flex items-center justify-center shadow-lg`}>
//                       <StatusIcon className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className={`text-lg font-bold ${currentStatus.textColor}`}>
//                         {currentStatus.message}
//                       </h2>
//                       <p className="text-sm text-gray-600">{currentStatus.description}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs text-gray-500">آخر تحديث</p>
//                     <p className="text-sm font-medium text-gray-700">
//                       {lastUpdate.toLocaleTimeString('ar-SA')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* QR Code Section - Always show when QR is available */}
//               {(qrVisible || botStatus === 'qr_ready') && (
//                 <div className="p-6">
//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       امسح الكود باستخدام واتساب
//                     </h3>
//                     <div className="inline-block bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
//                       {qrImage ? (
//                         <img 
//                           src={qrImage} 
//                           alt="WhatsApp QR Code" 
//                           className="w-64 h-64 mx-auto rounded-xl"
//                         />
//                       ) : qrCode ? (
//                         <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
//                           <div className="text-center">
//                             <QrCode className="w-16 h-16 text-blue-500 mx-auto mb-2" />
//                             <p className="text-gray-700 font-medium">QR Code متاح</p>
//                             <p className="text-gray-500 text-sm">جاري تحميل الصورة...</p>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
//                           <div className="text-center">
//                             <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
//                             <p className="text-gray-500">جاري تحميل الكود...</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="mt-6 flex justify-center space-x-4">
//                       <button
//                         onClick={fetchQRCode}
//                         disabled={isLoading}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
//                       >
//                         <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//                         <span>تحديث الكود</span>
//                       </button>
                      
//                       {qrImage && (
//                         <button
//                           onClick={downloadQRCode}
//                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
//                         >
//                           <Download className="w-4 h-4" />
//                           <span>تحميل</span>
//                         </button>
//                       )}
//                     </div>
                    
//                     {qrCode && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                         <p className="text-sm text-blue-700">
//                           <strong>تعليمات:</strong> افتح واتساب على هاتفك ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز ← امسح الكود
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Ready State Info */}
//               {botStatus === 'ready' && (
//                 <div className="p-6">
//                   <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
//                     <div className="flex items-center justify-center space-x-3 mb-4">
//                       <CheckCircle className="w-8 h-8 text-green-600" />
//                       <h3 className="text-xl font-bold text-green-800">البوت جاهز للعمل!</h3>
//                     </div>
//                     <p className="text-center text-green-700 mb-4">
//                       النظام متصل بنجاح ومستعد لاستقبال رسائل العملاء
//                     </p>
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div className="bg-white rounded-lg p-3 shadow-sm">
//                         <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
//                         <p className="text-sm font-medium text-gray-900">نشط</p>
//                       </div>
//                       <div className="bg-white rounded-lg p-3 shadow-sm">
//                         <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
//                         <p className="text-sm font-medium text-gray-900">متاح للعملاء</p>
//                       </div>
//                       <div className="bg-white rounded-lg p-3 shadow-sm">
//                         <Send className="w-6 h-6 text-purple-600 mx-auto mb-2" />
//                         <p className="text-sm font-medium text-gray-900">يرد تلقائياً</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Stats Card */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <span className="text-gray-700">إجمالي الرسائل</span>
//                   <span className="font-bold text-indigo-600">{stats.totalMessages}</span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <span className="text-gray-700">المحادثات النشطة</span>
//                   <span className="font-bold text-green-600">{stats.activeChats}</span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <span className="text-gray-700">وقت التشغيل</span>
//                   <span className="font-bold text-purple-600 font-mono">{stats.uptime}</span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <span className="text-gray-700">الحالة</span>
//                   <span className={`font-bold ${currentStatus.textColor}`}>
//                     {currentStatus.message}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Messages */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">الرسائل الأخيرة</h3>
//               <div className="space-y-3 max-h-80 overflow-y-auto">
//                 {messages.length === 0 ? (
//                   <p className="text-gray-500 text-center py-8">لا توجد رسائل حتى الآن</p>
//                 ) : (
//                   messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`p-3 rounded-lg border ${
//                         message.type === 'received'
//                           ? 'bg-blue-50 border-blue-200'
//                           : 'bg-green-50 border-green-200'
//                       }`}
//                     >
//                       <div className="flex items-start space-x-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                             message.type === 'received'
//                               ? 'bg-blue-200 text-blue-700'
//                               : 'bg-green-200 text-green-700'
//                           }`}
//                         >
//                           {message.type === 'received' ? (
//                             <MessageCircle className="w-4 h-4" />
//                           ) : (
//                             <Send className="w-4 h-4" />
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {message.content}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {message.timestamp.toLocaleTimeString('ar-SA')}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppBotDashboard;







import React, { useState, useEffect } from 'react';
import { MessageCircle, Wifi, WifiOff, RotateCcw, Send, QrCode, Clock, Activity, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const WhatsAppBotDashboard = () => {
  const [botStatus, setBotStatus] = useState('initializing');
  const [qrCode, setQrCode] = useState(null);
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState({ number: '', message: '' });
  const [notifications, setNotifications] = useState([]);

  // Base API URL - تغيير هذا حسب عنوان السيرفر
  const API_BASE = 'https://chat-bot-backend-v0.fly.dev/api';

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
    if (!window.confirm('هل أنت متأكد من إعادة تشغيل البوت؟')) return;
    
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
        setTimeout(fetchStatus, 3000);
      } else {
        addNotification('فشل في إعادة التشغيل', 'error');
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
      } else {
        addNotification(data.message, 'error');
      }
    } catch (error) {
      addNotification('خطأ في إرسال الرسالة', 'error');
    } finally {
      setLoading(false);
    }
  };

  // تحديث تلقائي
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* الإشعارات */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">لوحة تحكم بوت WhatsApp</h1>
          </div>
          <p className="text-gray-600 text-lg">البوت الذكي مع تكامل الذكاء الاصطناعي</p>
        </div>

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
                  <StatusIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{statusInfo.text}</span>
                </div>
              </div>

              {/* معلومات وقت التشغيل */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-700">وقت التشغيل</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{uptime.days}</div>
                    <div className="text-sm text-gray-500">يوم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{uptime.hours}</div>
                    <div className="text-sm text-gray-500">ساعة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{uptime.minutes}</div>
                    <div className="text-sm text-gray-500">دقيقة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{uptime.seconds}</div>
                    <div className="text-sm text-gray-500">ثانية</div>
                  </div>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex gap-4">
                <button
                  onClick={fetchStatus}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  تحديث الحالة
                </button>
                <button
                  onClick={restartBot}
                  disabled={loading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="w-5 h-5 mr-2" />
                  )}
                  إعادة التشغيل
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
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    امسح الكود من تطبيق واتساب لربط البوت
                  </p>
                </div>
              ) : (
                <div className="py-16 text-gray-400">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا يوجد كود QR متاح حالياً</p>
                  {botStatus === 'ready' && (
                    <p className="text-sm mt-2">البوت متصل بالفعل</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* قسم إرسال الرسائل */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Send className="w-6 h-6 mr-2 text-purple-600" />
            إرسال رسالة تجريبية
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف (مع رمز البلد)
                </label>
                <input
                  type="text"
                  value={sendMessage.number}
                  onChange={(e) => setSendMessage(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="مثال: 201234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الرسالة
                </label>
                <input
                  type="text"
                  value={sendMessage.message}
                  onChange={(e) => setSendMessage(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="أدخل نص الرسالة..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={loading || botStatus !== 'ready'}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              إرسال الرسالة
            </button>
            
            {botStatus !== 'ready' && (
              <p className="text-center text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
                يجب أن يكون البوت في حالة "جاهز" لإرسال الرسائل
              </p>
            )}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <h4 className="font-semibold text-gray-800">حالة الاتصال</h4>
                <p className="text-sm text-gray-600">
                  {botStatus === 'ready' ? 'متصل' : 'غير متصل'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
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
          
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
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
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBotDashboard;