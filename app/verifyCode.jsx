import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import { api } from '../hooks/api';
import {
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Clock
} from 'lucide-react-native';

// Generate unique finger ID
const generateFinger = () => {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
};

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { language, isDarkMode, setUser } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  // States
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [finger] = useState(generateFinger());

  // Refs for inputs
  const inputRefs = useRef([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer countdown
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleCodeChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) return;

    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);
    setError('');

    // Auto focus next input
    if (numericText && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all filled
    if (index === 4 && numericText) {
      const fullCode = [...newCode.slice(0, 4), numericText].join('');
      if (fullCode.length === 5) {
        setTimeout(() => handleVerify(fullCode), 300);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verifyCode = null) => {
    const fullCode = verifyCode || code.join('');

    if (fullCode.length !== 5) {
      setError(language === 'fa' ? 'لطفا کد ۵ رقمی را وارد کنید' : 'Please enter 5-digit code');
      shakeAnimation();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.verify(finger, fullCode);

      if (response.code === 1) {
        const user = {
          username: response.username || 'user',
          name: response.name || (language === 'fa' ? 'کاربر' : 'User'),
          email: response.email || '',
          mobile: response.mobile || '',
          token: response.token || '',
          finger: finger,
        };

        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('finger', finger);

        if (Platform.OS === 'web') {
          alert(language === 'fa' ? 'ورود موفقیت‌آمیز' : 'Login successful');
          router.replace('/(tabs)/home');
        } else {
          Alert.alert(
            language === 'fa' ? '✓ موفق' : 'Success',
            language === 'fa' ? 'ورود با موفقیت انجام شد' : 'Login successful',
            [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
          );
        }
      } else {
        throw new Error(response.message || (language === 'fa' ? 'کد تایید نادرست است' : 'Invalid verification code'));
      }
    } catch (error) {
      setError(error.message || (language === 'fa' ? 'خطا در تایید کد' : 'Verification error'));
      shakeAnimation();
      setCode(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const userDataStr = await AsyncStorage.getItem('tempLoginData');
      if (!userDataStr) {
        throw new Error(language === 'fa' ? 'اطلاعات ورود یافت نشد' : 'Login data not found');
      }

      const userData = JSON.parse(userDataStr);
      const response = await api.login(userData.username, userData.mobile);

      if (response.code === 2) {
        setResendTimer(120);
        setCanResend(false);
        
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        if (Platform.OS === 'web') {
          alert(language === 'fa' ? 'کد مجددا ارسال شد' : 'Code resent successfully');
        } else {
          Alert.alert(
            language === 'fa' ? 'موفق' : 'Success',
            language === 'fa' ? 'کد تایید مجددا ارسال شد' : 'Verification code resent'
          );
        }
      }
    } catch (error) {
      setError(error.message || (language === 'fa' ? 'خطا در ارسال مجدد کد' : 'Resend error'));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Background Gradient - Subtle */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1a1d29', '#212529', '#2d3139']
            : ['#f8f9fa', '#e9ecef', '#dee2e6']
        }
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.iconGradient}
              >
                <KeyRound size={48} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
            </Animated.View>

            <Text style={[styles.title, isDarkMode && styles.titleDark]}>
              {language === 'fa' ? 'تایید کد امنیتی' : 'Verify Security Code'}
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
              {language === 'fa'
                ? 'کد ۵ رقمی ارسال شده به موبایل خود را وارد نمایید'
                : 'Enter the 5-digit code sent to your mobile'}
            </Text>
          </View>

          {/* Main Card */}
          <Animated.View
            style={[
              styles.mainCard,
              isDarkMode && styles.mainCardDark,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            {/* Code Inputs */}
            <View style={styles.codeSection}>
              <View style={styles.codeInputsContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      digit && styles.codeInputFilled,
                      isDarkMode && styles.codeInputDark,
                      error && styles.codeInputError
                    ]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    editable={!loading}
                  />
                ))}
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#dc3545" />
                  <Text style={[styles.errorText, isRTL && styles.rtlText]}>
                    {error}
                  </Text>
                </View>
              )}
            </View>

            {/* Timer Section */}
            <View style={[styles.timerSection, isDarkMode && styles.timerSectionDark]}>
              <Clock size={16} color={resendTimer > 30 ? '#28a745' : '#dc3545'} />
              <Text style={[
                styles.timerText,
                isDarkMode && styles.timerTextDark,
                resendTimer <= 30 && styles.timerTextWarning
              ]}>
                {language === 'fa'
                  ? `زمان باقی‌مانده: ${formatTime(resendTimer)}`
                  : `Time remaining: ${formatTime(resendTimer)}`}
              </Text>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.verifyButton, (loading || code.join('').length !== 5) && styles.verifyButtonDisabled]}
              onPress={() => handleVerify()}
              disabled={loading || code.join('').length !== 5}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  loading || code.join('').length !== 5 
                    ? ['#adb5bd', '#adb5bd'] 
                    : ['#4A90E2', '#357ABD']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.verifyGradient}
              >
                {loading ? (
                  <Text style={styles.verifyText}>
                    {language === 'fa' ? 'در حال بررسی...' : 'Verifying...'}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.verifyText}>
                      {language === 'fa' ? 'تایید کد' : 'Verify Code'}
                    </Text>
                    <CheckCircle2 size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Resend Code */}
            <TouchableOpacity
              style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
              onPress={handleResendCode}
              disabled={!canResend || loading}
              activeOpacity={0.7}
            >
              <RefreshCw size={16} color={canResend ? '#4A90E2' : '#adb5bd'} />
              <Text style={[
                styles.resendText,
                isDarkMode && styles.resendTextDark,
                !canResend && styles.resendTextDisabled,
                isRTL && styles.rtlText
              ]}>
                {language === 'fa' ? 'ارسال مجدد کد' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Info Card */}
          <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
            <Shield size={18} color="#4A90E2" />
            <Text style={[styles.infoText, isDarkMode && styles.infoTextDark, isRTL && styles.rtlText]}>
              {language === 'fa'
                ? 'کد تایید به شماره موبایل ثبت شده شما ارسال گردیده است'
                : 'Verification code has been sent to your registered mobile number'}
            </Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
            <Text style={[styles.backText, isDarkMode && styles.backTextDark, isRTL && styles.rtlText]}>
              {language === 'fa' ? 'بازگشت به صفحه ورود' : 'Back to Login'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
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
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: '#e9ecef',
  },
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  subtitleDark: {
    color: '#adb5bd',
  },

  // Main Card
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  mainCardDark: {
    backgroundColor: '#212529',
  },

  // Code Section
  codeSection: {
    marginBottom: 24,
  },
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  codeInput: {
    width: 56,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#212529',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  codeInputFilled: {
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInputDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
    color: '#e9ecef',
  },
  codeInputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#dc3545',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Timer Section
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f7ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  timerSectionDark: {
    backgroundColor: '#1e2a3a',
  },
  timerText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  timerTextDark: {
    color: '#adb5bd',
  },
  timerTextWarning: {
    color: '#dc3545',
  },

  // Verify Button
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Resend Button
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  resendTextDark: {
    color: '#6ca8e8',
  },
  resendTextDisabled: {
    color: '#adb5bd',
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#f0f7ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  infoCardDark: {
    backgroundColor: '#1e2a3a',
    borderColor: '#2d3e50',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#495057',
    lineHeight: 20,
  },
  infoTextDark: {
    color: '#adb5bd',
  },

  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  backTextDark: {
    color: '#adb5bd',
  },

  // RTL Support
  rtlText: {
    textAlign: 'right',
  },
});