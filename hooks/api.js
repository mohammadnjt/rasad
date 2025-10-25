// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ایجاد instance از axios
const apiClient = axios.create();

// تابع برای گرفتن baseUrl از AsyncStorage
const getBaseUrl = async () => {
  try {
    const config = await AsyncStorage.getItem('version');
    if (!config || config.baseUrl) {
      throw new Error('آدرس سرور تنظیم نشده است');
    }
    return JSON.parse(config).baseUrl;
  } catch (error) {
    console.error('Error getting baseUrl:', error);
    throw error;
  }
};

// تابع اصلی برای ارسال درخواست
export const sendRequest = async (operation, additionalParams = {}) => {
  try {
    const baseUrl = await getBaseUrl();
    // const fullUrl = `${baseUrl}/modules.php`;

    // ایجاد FormData
    const formData = new FormData();
    
    // پارامترهای ثابت
    formData.append('newdb', 'ss');
    formData.append('name', 'Icms');
    formData.append('file', 'json');
    formData.append('op', operation);
    
    // پارامترهای اضافی
    Object.keys(additionalParams).forEach(key => {
      if (additionalParams[key] !== undefined && additionalParams[key] !== null) {
        formData.append(key, additionalParams[key]);
      }
    });

    console.log('Sending request to:', baseUrl);
    console.log('Operation:', operation);
    console.log('Additional params:', additionalParams);

    const response = await apiClient.post(baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    return response.data;

  } catch (error) {
    console.error('Request failed:', error);
    
    if (error.response) {
      // سرور پاسخ داده اما با خطا
      throw new Error(`خطای سرور: ${error.response.status}`);
    } else if (error.request) {
      // درخواست ارسال شده اما پاسخی دریافت نشده
      throw new Error('عدم اتصال به سرور');
    } else {
      // خطای دیگر
      throw new Error(error.message || 'خطای ناشناخته');
    }
  }
};

// هوک برای استفاده در کامپوننت‌ها
export const useApi = () => {
  return {
    sendRequest
  };
};

// توابع آماده برای عملیات رایج
export const api = {
  // گرفتن نسخه
  getVersion: () => sendRequest('m_version'),
  
  // لاگین
  login: (username, mob) => sendRequest('m_login', {
    username,
    mob
  }),

  // لاگین
  verify: (finger, code) => sendRequest('m_verify', {
    finger,
    code
  }),
  
  // گرفتن اطلاعات کاربر
  getUserInfo: (userId) => sendRequest('m_profile', {
    user_id: userId
  }),
  
  // ارسال موقعیت
//   sendLocation: (latitude, longitude, userId, timestamp) => sendRequest('m_location', {
//     lat: latitude,
//     lng: longitude,
//     user_id: userId,
//     time: timestamp
//   }),
  
  // دریافت پیام
  getMessage: (fingerData, time) => sendRequest('m_message', {
    finger: fingerData,
    time
  })
};