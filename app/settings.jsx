import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
  Modal,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Globe,
  Bell,
  Moon,
  Shield,
  LogOut,
  Info,
  ChevronRight,
  Trash2,
  Clock,
  Calendar,
  X,
  CheckCircle2,
  Settings as SettingsIcon
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const {
    language,
    isDarkMode,
    isLoggedIn,
    setLanguage,
    toggleDarkMode,
    logout,
    version,
    user
  } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  console.log('user',user)

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [currentResetTime, setCurrentResetTime] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // انیمیشن‌های بک‌گراند دایره‌ها
  const bgPulseAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    loadResetTime();
    loadNotificationsSetting();
  }, []);

  useEffect(() => {
    // انیمیشن pulse برای دایره‌های بک‌گراند
    bgPulseAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 3000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + index * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const loadNotificationsSetting = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationsEnabled');
      if (saved !== null) {
        setNotificationsEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading notifications setting:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    } catch (error) {
      console.log('Error saving notifications setting:', error);
    }
  };

  const loadResetTime = async () => {
    try {
      const savedTime = await AsyncStorage.getItem('resetTime');
      const savedPeriod = await AsyncStorage.getItem('resetPeriod');
      if (savedTime && savedPeriod) {
        setCurrentResetTime(savedTime);
        setSelectedPeriod(savedPeriod);
      }
    } catch (error) {
      console.log('Error loading reset time:', error);
    }
  };

  const periods = [
    { 
      id: 'week', 
      label: language === 'fa' ? 'یک هفته' : 'One Week',
      days: 7,
      icon: Calendar,
      color: '#4A90E2'
    },
    { 
      id: 'month', 
      label: language === 'fa' ? 'یک ماه' : 'One Month',
      days: 30,
      icon: Calendar,
      color: '#357ABD'
    },
    { 
      id: 'three_months', 
      label: language === 'fa' ? 'سه ماه' : 'Three Months',
      days: 90,
      icon: Calendar,
      color: '#2C5F94'
    },
    { 
      id: 'six_months', 
      label: language === 'fa' ? 'شش ماه' : 'Six Months',
      days: 180,
      icon: Calendar,
      color: '#1F4B6F'
    },
    { 
      id: 'year', 
      label: language === 'fa' ? 'یک سال' : 'One Year',
      days: 365,
      icon: Calendar,
      color: '#14374D'
    },
  ];

  const openResetModal = () => {
    setResetModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeResetModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setResetModalVisible(false);
    });
  };

  const handleSetResetTime = async (period) => {
    const days = periods.find(p => p.id === period.id)?.days || 0;
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + days);
    
    try {
      await AsyncStorage.setItem('resetTime', resetDate.toISOString());
      await AsyncStorage.setItem('resetPeriod', period.id);
      
      setCurrentResetTime(resetDate.toISOString());
      setSelectedPeriod(period.id);
      
      closeResetModal();
      
      const successMessage = language === 'fa' 
        ? `داده‌ها در ${period.label} پاک خواهند شد`
        : `Data will be cleared in ${period.label}`;

      if (Platform.OS === 'web') {
        alert(successMessage);
      } else {
        Alert.alert(
          language === 'fa' ? '✓ موفق' : 'Success',
          successMessage
        );
      }
    } catch (error) {
      const errorMessage = language === 'fa' ? 'خطا در تنظیم زمان' : 'Error setting time';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert(language === 'fa' ? 'خطا' : 'Error', errorMessage);
      }
    }
  };

  const handleClearResetTime = async () => {
    const confirmAction = () => {
      return new Promise((resolve) => {
        if (Platform.OS === 'web') {
          resolve(window.confirm(
            language === 'fa' 
              ? 'آیا از حذف زمان‌بندی مطمئن هستید؟' 
              : 'Are you sure you want to remove the schedule?'
          ));
        } else {
          Alert.alert(
            language === 'fa' ? 'حذف زمان‌بندی' : 'Remove Schedule',
            language === 'fa' ? 'آیا از حذف زمان‌بندی مطمئن هستید؟' : 'Are you sure you want to remove the schedule?',
            [
              { text: language === 'fa' ? 'انصراف' : 'Cancel', onPress: () => resolve(false), style: 'cancel' },
              { text: language === 'fa' ? 'حذف' : 'Remove', onPress: () => resolve(true), style: 'destructive' }
            ]
          );
        }
      });
    };

    const confirmed = await confirmAction();
    if (confirmed) {
      try {
        await AsyncStorage.removeItem('resetTime');
        await AsyncStorage.removeItem('resetPeriod');
        setCurrentResetTime(null);
        setSelectedPeriod(null);
        closeResetModal();
      } catch (error) {
        console.log('Error removing reset time:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = async () => {
    const confirmAction = () => {
      return new Promise((resolve) => {
        if (Platform.OS === 'web') {
          resolve(window.confirm(
            language === 'fa' 
              ? 'آیا از خروج مطمئن هستید؟ تمام داده‌های محلی حذف خواهند شد.' 
              : 'Are you sure you want to logout? All local data will be cleared.'
          ));
        } else {
          Alert.alert(
            t.logout,
            language === 'fa' 
              ? 'آیا مطمئن هستید؟ تمام داده‌های محلی حذف خواهند شد.'
              : 'Are you sure? All local data will be cleared.',
            [
              { text: t.cancel, style: 'cancel', onPress: () => resolve(false) },
              { text: t.logout, style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        }
      });
    };

    const confirmed = await confirmAction();
    if (confirmed) {
      try {
        // Clear all stored data
        await AsyncStorage.multiRemove([
          'user',
          'finger',
          'tempLoginData',
          'serverUrl',
          'resetTime',
          'resetPeriod'
        ]);

        // Call logout from store
        await logout();

        // Navigate to login
        router.replace('/login');
      } catch (error) {
        console.log('Error during logout:', error);
        const errorMessage = language === 'fa' ? 'خطا در خروج' : 'Error during logout';
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert(language === 'fa' ? 'خطا' : 'Error', errorMessage);
        }
      }
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'fa' ? 'en' : 'fa';
    await setLanguage(newLang);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={
            isDarkMode 
              ? ['#1a1d29', '#212529', '#2d3139']
              : ['#f8f9fa', '#e9ecef', '#dee2e6']
          }
          style={styles.backgroundGradient}
        />
        {/* Dots Pattern */}
        <View style={styles.dotsPattern}>
          {[...Array(50)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot,
                isDarkMode ? styles.dotDark : styles.dotLight,
                {
                  left: `${(i % 10) * 10}%`,
                  top: `${Math.floor(i / 10) * 20}%`,
                }
              ]} 
            />
          ))}
        </View>
        {/* دایره‌های دکوراتیو متحرک در بک‌گراند */}
        <Animated.View 
          style={[
            styles.bgDecorativeCircle1, 
            isDarkMode ? styles.bgDecorativeCircleDark : styles.bgDecorativeCircleLight,
            { transform: [{ scale: bgPulseAnims[0] }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.bgDecorativeCircle2, 
            isDarkMode ? styles.bgDecorativeCircleDark : styles.bgDecorativeCircleLight,
            { transform: [{ scale: bgPulseAnims[1] }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.bgDecorativeCircle3, 
            isDarkMode ? styles.bgDecorativeCircleDark : styles.bgDecorativeCircleLight,
            { transform: [{ scale: bgPulseAnims[2] }] }
          ]} 
        />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* Header */}
          <View style={styles.pageHeader}>
            <View style={styles.pageIconContainer}>
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.pageIconGradient}
              >
                <SettingsIcon size={32} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
            </View>
            <Text style={[styles.pageTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
              {t.settings}
            </Text>
            <Text style={[styles.pageSubtitle, isDarkMode && styles.pageSubtitleDark, isRTL && styles.rtl]}>
              {language === 'fa' ? 'مدیریت تنظیمات برنامه' : 'Manage app settings'}
            </Text>
          </View>

          {/* User Info Card */}
          {user && (
            <View style={[styles.userCard, isDarkMode && styles.userCardDark]}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, isDarkMode && styles.textDark]}>
                    {user.name || user.username}
                  </Text>
                  <Text style={[styles.userEmail, isDarkMode && styles.subtitleDark]}>
                    {user.email || user.mobile}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Settings Card */}
          <View style={[styles.settingCard, isDarkMode && styles.settingCardDark]}>
            {/* Language */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={toggleLanguage}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Globe size={22} color="#4A90E2" strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {t.language}
                  </Text>
                  <Text style={[styles.settingValue, isDarkMode && styles.settingValueDark, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'فارسی' : 'English'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </TouchableOpacity>

            {/* Notifications */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Bell size={22} color="#28a745" strokeWidth={2.5} />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.notifications}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#e9ecef', true: '#4A90E2' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f8f9fa'}
                ios_backgroundColor="#e9ecef"
              />
            </View>

            {/* Dark Mode */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#2d3139' : '#F3E5F5' }]}>
                  <Moon size={22} color="#6c757d" strokeWidth={2.5} />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.darkMode}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e9ecef', true: '#4A90E2' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f8f9fa'}
                ios_backgroundColor="#e9ecef"
              />
            </View>

            {/* Auto Reset Data */}
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={openResetModal}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                  <Trash2 size={22} color="#dc3545" strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'پاک‌سازی خودکار' : 'Auto Clear Data'}
                  </Text>
                  {currentResetTime ? (
                    <Text style={[styles.settingValue, isDarkMode && styles.settingValueDark, isRTL && styles.rtl]}>
                      {formatDate(currentResetTime)}
                    </Text>
                  ) : (
                    <Text style={[styles.settingValueInactive, isDarkMode && styles.settingValueInactiveDark, isRTL && styles.rtl]}>
                      {language === 'fa' ? 'تنظیم نشده' : 'Not set'}
                    </Text>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={() => {
                const message = language === 'fa'
                  ? 'سیاست حریم خصوصی ما اطلاعات شما را محافظت می‌کند و هیچ داده‌ای بدون اجازه شما به اشتراک گذاشته نمی‌شود.'
                  : 'Our privacy policy protects your information and no data is shared without your permission.';
                
                if (Platform.OS === 'web') {
                  alert(message);
                } else {
                  Alert.alert(t.privacyPolicy, message);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <Shield size={22} color="#ffc107" strokeWidth={2.5} />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.privacyPolicy}
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </TouchableOpacity>

            {/* App Version */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
                  <Info size={22} color="#17a2b8" strokeWidth={2.5} />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.appVersion}
                </Text>
              </View>
              <Text style={[styles.versionText, isDarkMode && styles.versionTextDark]}>
                {version || '1.1'}
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          {isLoggedIn && (
            <TouchableOpacity
              style={[styles.logoutButton, isDarkMode && styles.logoutButtonDark]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={20} color="#dc3545" strokeWidth={2.5} />
              <Text style={styles.logoutButtonText}>
                {t.logout}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Reset Time Modal */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeResetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeResetModal}
            />
          </View>

          <Animated.View
            style={[
              styles.modalContent,
              isDarkMode && styles.modalContentDark,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconContainer}>
                  <LinearGradient
                    colors={['#4A90E2', '#357ABD']}
                    style={styles.modalIconGradient}
                  >
                    <Clock size={24} color="#fff" strokeWidth={2.5} />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={[styles.modalTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'تنظیم زمان پاک‌سازی' : 'Set Clear Schedule'}
                  </Text>
                  <Text style={[styles.modalSubtitle, isDarkMode && styles.modalSubtitleDark, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'انتخاب بازه زمانی' : 'Select time period'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeResetModal} style={styles.closeButton}>
                <X size={22} color={isDarkMode ? '#e0e0e0' : '#495057'} />
              </TouchableOpacity>
            </View>

            {/* Modal Description */}
            <View style={[styles.infoBox, isDarkMode && styles.infoBoxDark]}>
              <Info size={16} color="#4A90E2" />
              <Text style={[styles.infoBoxText, isDarkMode && styles.infoBoxTextDark, isRTL && styles.rtl]}>
                {language === 'fa'
                  ? 'داده‌های برنامه به صورت خودکار پس از بازه انتخابی پاک خواهند شد.'
                  : 'App data will be automatically cleared after selected period.'}
              </Text>
            </View>

            {/* Period Options */}
            <ScrollView style={styles.periodsContainer} showsVerticalScrollIndicator={false}>
              {periods.map((period) => {
                const PeriodIcon = period.icon;
                const isSelected = selectedPeriod === period.id;
                
                return (
                  <TouchableOpacity
                    key={period.id}
                    style={[
                      styles.periodCard,
                      isDarkMode && styles.periodCardDark,
                      isSelected && styles.periodCardSelected
                    ]}
                    onPress={() => handleSetResetTime(period)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.periodIconContainer,
                      { backgroundColor: isSelected ? period.color : `${period.color}20` }
                    ]}>
                      <PeriodIcon 
                        size={24} 
                        color={isSelected ? '#fff' : period.color} 
                        strokeWidth={2.5}
                      />
                    </View>
                    <View style={styles.periodTextContainer}>
                      <Text style={[
                        styles.periodLabel,
                        isDarkMode && styles.periodLabelDark,
                        isSelected && styles.periodLabelSelected,
                        isRTL && styles.rtl
                      ]}>
                        {period.label}
                      </Text>
                      <Text style={[
                        styles.periodDays,
                        isDarkMode && styles.periodDaysDark,
                        isRTL && styles.rtl
                      ]}>
                        {period.days} {language === 'fa' ? 'روز' : 'days'}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <CheckCircle2 size={22} color={period.color} strokeWidth={2.5} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Current Schedule */}
            {currentResetTime && (
              <View style={[styles.currentSchedule, isDarkMode && styles.currentScheduleDark]}>
                <Clock size={16} color="#28a745" />
                <Text style={[styles.currentScheduleText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'زمان‌بندی فعلی: ' : 'Current: '}
                  <Text style={styles.currentScheduleDate}>{formatDate(currentResetTime)}</Text>
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              {currentResetTime && (
                <TouchableOpacity
                  style={[styles.removeButton, isDarkMode && styles.removeButtonDark]}
                  onPress={handleClearResetTime}
                  activeOpacity={0.8}
                >
                  <Trash2 size={18} color="#dc3545" strokeWidth={2.5} />
                  <Text style={[styles.removeButtonText, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'حذف زمان‌بندی' : 'Remove'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.cancelButton, isDarkMode && styles.cancelButtonDark]}
                onPress={closeResetModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'بستن' : 'Close'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  containerDark: {
    backgroundColor: '#1a1d29',
  },

  // Background
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  dotsPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  dot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  dotLight: {
    backgroundColor: '#4A90E2',
    opacity: 0.15,
  },
  dotDark: {
    backgroundColor: '#6ca8e8',
    opacity: 0.1,
  },

  // دایره‌های دکوراتیو متحرک در بک‌گراند
  bgDecorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '10%',
    left: '-10%',
    opacity: 0.08,
  },
  bgDecorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: '20%',
    right: '-15%',
    opacity: 0.06,
  },
  bgDecorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: '50%',
    left: '40%',
    opacity: 0.07,
  },
  bgDecorativeCircleLight: {
    backgroundColor: '#4A90E2',
  },
  bgDecorativeCircleDark: {
    backgroundColor: '#6ca8e8',
  },

  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },

  // Page Header
  pageHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pageIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pageIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  pageSubtitleDark: {
    color: '#adb5bd',
  },

  // User Card
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardDark: {
    backgroundColor: '#212529',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
  },

  // Settings Card
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  settingCardDark: {
    backgroundColor: '#212529',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f8f9fa',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  settingValueDark: {
    color: '#adb5bd',
  },
  settingValueInactive: {
    fontSize: 13,
    color: '#adb5bd',
    marginTop: 2,
  },
  settingValueInactiveDark: {
    color: '#6c757d',
  },
  versionText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  versionTextDark: {
    color: '#adb5bd',
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff5f5',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  logoutButtonDark: {
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc3545',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalContentDark: {
    backgroundColor: '#212529',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6c757d',
  },
  modalSubtitleDark: {
    color: '#adb5bd',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f0f7ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  infoBoxDark: {
    backgroundColor: '#1e2a3a',
    borderColor: '#2d3e50',
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#495057',
    lineHeight: 20,
  },
  infoBoxTextDark: {
    color: '#adb5bd',
  },

  // Periods
  periodsContainer: {
    maxHeight: 360,
    marginBottom: 16,
  },
  periodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodCardDark: {
    backgroundColor: '#2d3139',
  },
  periodCardSelected: {
    backgroundColor: '#fff',
    borderColor: '#4A90E2',
  },
  periodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  periodTextContainer: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 3,
  },
  periodLabelDark: {
    color: '#e9ecef',
  },
  periodLabelSelected: {
    color: '#4A90E2',
  },
  periodDays: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  periodDaysDark: {
    color: '#adb5bd',
  },
  checkIcon: {
    marginLeft: 8,
  },

  // Current Schedule
  currentSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f7ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  currentScheduleDark: {
    backgroundColor: '#1e2a3a',
    borderColor: '#2d3e50',
  },
  currentScheduleText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  currentScheduleDate: {
    fontWeight: '700',
    color: '#28a745',
  },

  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  removeButtonDark: {
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc3545',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonDark: {
    backgroundColor: '#2d3139',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6c757d',
  },

  // RTL
  rtl: {
    textAlign: 'right',
  },
  textDark: {
    color: '#e9ecef',
  },
  subtitleDark: {
    color: '#adb5bd',
  },
});