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
  Dimensions
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
  CheckCircle2
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
    logout
  } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [currentResetTime, setCurrentResetTime] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    loadResetTime();
  }, []);

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
      gradient: ['#667eea', '#764ba2']
    },
    { 
      id: 'month', 
      label: language === 'fa' ? 'یک ماه' : 'One Month',
      days: 30,
      icon: Calendar,
      gradient: ['#f093fb', '#f5576c']
    },
    { 
      id: 'three_months', 
      label: language === 'fa' ? 'سه ماه' : 'Three Months',
      days: 90,
      icon: Calendar,
      gradient: ['#4facfe', '#00f2fe']
    },
    { 
      id: 'six_months', 
      label: language === 'fa' ? 'شش ماه' : 'Six Months',
      days: 180,
      icon: Calendar,
      gradient: ['#43e97b', '#38f9d7']
    },
    { 
      id: 'year', 
      label: language === 'fa' ? 'یک سال' : 'One Year',
      days: 365,
      icon: Calendar,
      gradient: ['#fa709a', '#fee140']
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
      
      Alert.alert(
        language === 'fa' ? '✓ موفق' : 'Success',
        language === 'fa' 
          ? `داده‌ها در ${period.label} پاک خواهند شد`
          : `Data will be cleared in ${period.label}`
      );
    } catch (error) {
      Alert.alert(
        language === 'fa' ? 'خطا' : 'Error',
        language === 'fa' ? 'خطا در تنظیم زمان' : 'Error setting time'
      );
    }
  };

  const handleClearResetTime = async () => {
    Alert.alert(
      language === 'fa' ? 'حذف زمان‌بندی' : 'Remove Schedule',
      language === 'fa' ? 'آیا از حذف زمان‌بندی مطمئن هستید؟' : 'Are you sure you want to remove the schedule?',
      [
        { text: language === 'fa' ? 'انصراف' : 'Cancel', style: 'cancel' },
        {
          text: language === 'fa' ? 'حذف' : 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('resetTime');
              await AsyncStorage.removeItem('resetPeriod');
              setCurrentResetTime(null);
              setSelectedPeriod(null);
            } catch (error) {
              console.log('Error removing reset time:', error);
            }
          }
        }
      ]
    );
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

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      language === 'fa' ? 'آیا مطمئن هستید؟' : 'Are you sure?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const toggleLanguage = async () => {
    const newLang = language === 'fa' ? 'en' : 'fa';
    await setLanguage(newLang);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.settings}
          </Text>

          {/* Settings Card */}
          <View style={[styles.settingCard, isDarkMode && styles.settingCardDark]}>
            {/* Language */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Globe size={24} color="#007BFF" />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.language}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={toggleLanguage}
              >
                <Text style={[styles.languageText, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'فارسی / English' : 'English / فارسی'}
                </Text>
                <ChevronRight size={20} color={isDarkMode ? '#999' : '#666'} />
              </TouchableOpacity>
            </View>

            {/* Notifications */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Bell size={24} color="#28A745" />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.notifications}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#007BFF' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>

            {/* Dark Mode */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Moon size={24} color="#6c757d" />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.darkMode}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: '#007BFF' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            </View>

            {/* Auto Reset Data */}
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={openResetModal}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Trash2 size={24} color="#DC3545" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {language === 'fa' ? 'پاک‌سازی خودکار' : 'Auto Clear Data'}
                  </Text>
                  {currentResetTime && (
                    <Text style={[styles.settingSubtitle, isDarkMode && styles.settingSubtitleDark, isRTL && styles.rtl]}>
                      {language === 'fa' ? 'پاک‌سازی در: ' : 'Clear on: '}
                      {formatDate(currentResetTime)}
                    </Text>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#999' : '#666'} />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={() => Alert.alert(
                t.privacyPolicy,
                language === 'fa'
                  ? 'سیاست حریم خصوصی ما اطلاعات شما را محافظت می‌کند...'
                  : 'Our privacy policy protects your information...'
              )}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Shield size={24} color="#FFC107" />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.privacyPolicy}
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#999' : '#666'} />
            </TouchableOpacity>

            {/* App Version */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Info size={24} color="#17A2B8" />
                </View>
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.appVersion}
                </Text>
              </View>
              <Text style={[styles.versionText, isDarkMode && styles.textDark]}>
                1.1.0
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          {isLoggedIn && (
            <CustomButton
              title={t.logout}
              onPress={handleLogout}
              variant="danger"
              style={styles.logoutButton}
            />
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
          <Animated.View
            style={[
              styles.modalBackdrop,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeResetModal}
            />
          </Animated.View>

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
              <View style={styles.modalTitleContainer}>
                <Clock size={28} color="#667eea" />
                <Text style={[styles.modalTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'تنظیم زمان پاک‌سازی' : 'Set Clear Schedule'}
                </Text>
              </View>
              <TouchableOpacity onPress={closeResetModal} style={styles.closeButton}>
                <X size={24} color={isDarkMode ? '#e0e0e0' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Modal Description */}
            <Text style={[styles.modalDescription, isDarkMode && styles.modalDescriptionDark, isRTL && styles.rtl]}>
              {language === 'fa'
                ? 'یک بازه زمانی را انتخاب کنید. داده‌های برنامه به صورت خودکار پس از این مدت پاک خواهند شد.'
                : 'Select a time period. App data will be automatically cleared after this duration.'}
            </Text>

            {/* Period Options */}
            <ScrollView style={styles.periodsContainer} showsVerticalScrollIndicator={false}>
              {periods.map((period, index) => {
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
                    <LinearGradient
                      colors={isSelected ? period.gradient : ['transparent', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.periodGradient,
                        !isSelected && styles.periodGradientInactive
                      ]}
                    >
                      <View style={styles.periodContent}>
                        <View style={[
                          styles.periodIconContainer,
                          isSelected && styles.periodIconContainerActive
                        ]}>
                          <PeriodIcon 
                            size={28} 
                            color={isSelected ? '#fff' : '#667eea'} 
                            strokeWidth={2.5}
                          />
                        </View>
                        <View style={styles.periodTextContainer}>
                          <Text style={[
                            styles.periodLabel,
                            isSelected && styles.periodLabelActive,
                            isDarkMode && !isSelected && styles.textDark,
                            isRTL && styles.rtl
                          ]}>
                            {period.label}
                          </Text>
                          <Text style={[
                            styles.periodDays,
                            isSelected && styles.periodDaysActive,
                            isDarkMode && !isSelected && styles.periodDaysDark,
                            isRTL && styles.rtl
                          ]}>
                            {period.days} {language === 'fa' ? 'روز' : 'days'}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkIcon}>
                            <CheckCircle2 size={24} color="#fff" />
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Current Schedule */}
            {currentResetTime && (
              <View style={[styles.currentSchedule, isDarkMode && styles.currentScheduleDark]}>
                <Clock size={16} color="#667eea" />
                <Text style={[styles.currentScheduleText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'زمان‌بندی فعلی: ' : 'Current schedule: '}
                  {formatDate(currentResetTime)}
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
                  <Trash2 size={18} color="#DC3545" />
                  <Text style={styles.removeButtonText}>
                    {language === 'fa' ? 'حذف زمان‌بندی' : 'Remove Schedule'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.cancelButton}
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
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  textDark: {
    color: '#e0e0e0',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingCardDark: {
    backgroundColor: '#2a2a2a',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  settingSubtitleDark: {
    color: '#999',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
  },
  modalContentDark: {
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalDescriptionDark: {
    color: '#999',
  },

  // Periods
  periodsContainer: {
    maxHeight: 400,
    marginBottom: 16,
  },
  periodCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  periodCardDark: {
    borderColor: '#3a3a3a',
  },
  periodCardSelected: {
    borderColor: 'transparent',
  },
  periodGradient: {
    padding: 16,
  },
  periodGradientInactive: {
    backgroundColor: '#f8f9fa',
  },
  periodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  periodIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodTextContainer: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  periodLabelActive: {
    color: '#fff',
  },
  periodDays: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  periodDaysActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  periodDaysDark: {
    color: '#999',
  },
  checkIcon: {
    marginLeft: 8,
  },

  // Current Schedule
  currentSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  currentScheduleDark: {
    backgroundColor: '#2a2a2a',
  },
  currentScheduleText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },

  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderWidth: 2,
    borderColor: '#DC3545',
  },
  removeButtonDark: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC3545',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
});