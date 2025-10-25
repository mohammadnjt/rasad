import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
  TextInput
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
  ArrowRight
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
  const [resendTimer, setResendTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [finger] = useState(generateFinger());

  // Refs for inputs
  const inputRefs = useRef([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

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
    // Only allow numbers
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
      // Call verify API
      const response = await api.verify(finger, fullCode);

      if (response.code === 1) {
        // Success - save user and navigate
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

        // Success animation and navigate
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
      // Get username and mobile from navigation params or storage
      const userDataStr = await AsyncStorage.getItem('tempLoginData');
      if (!userDataStr) {
        throw new Error(language === 'fa' ? 'اطلاعات ورود یافت نشد' : 'Login data not found');
      }

      const userData = JSON.parse(userDataStr);
      const response = await api.login(userData.username, userData.mobile);

      if (response.code === 2) {
        setResendTimer(120);
        setCanResend(false);
        
        // Restart timer
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
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1a1a2e', '#16213e', '#0f3460']
            : ['#667eea', '#764ba2', '#f093fb']
        }
        style={styles.backgroundGradient}
      />

      {/* Decorative Circles */}
      <Animated.View style={[styles.decorativeCircle1, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.decorativeCircle2, { opacity: fadeAnim }]} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.iconGradient}
          >
            <KeyRound size={64} color="#fff" strokeWidth={2} />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Text style={[styles.title, isRTL && styles.rtl]}>
          {language === 'fa' ? 'تایید کد' : 'Verify Code'}
        </Text>
        <Text style={[styles.subtitle, isRTL && styles.rtl]}>
          {language === 'fa'
            ? 'کد ۵ رقمی ارسال شده را وارد کنید'
            : 'Enter the 5-digit code sent to you'}
        </Text>

        {/* Code Inputs Card */}
        <Animated.View
          style={[
            styles.codeCard,
            { transform: [{ translateX: shakeAnim }] }
          ]}
        >
          <View style={[styles.glassOverlay, isDarkMode && styles.glassOverlayDark]} />

          <View style={styles.codeContent}>
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
                <AlertCircle size={16} color="#DC3545" />
                <Text style={[styles.errorText, isRTL && styles.rtl]}>{error}</Text>
              </View>
            )}

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, isDarkMode && styles.timerTextDark, isRTL && styles.rtl]}>
                {language === 'fa'
                  ? `زمان باقی‌مانده: ${formatTime(resendTimer)}`
                  : `Time remaining: ${formatTime(resendTimer)}`}
              </Text>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => handleVerify()}
              disabled={loading || code.join('').length !== 5}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading || code.join('').length !== 5 ? ['#999', '#666'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyGradient}
              >
                {loading ? (
                  <Text style={styles.verifyText}>
                    {language === 'fa' ? 'در حال تایید...' : 'Verifying...'}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.verifyText}>
                      {language === 'fa' ? 'تایید' : 'Verify'}
                    </Text>
                    <CheckCircle2 size={20} color="#fff" />
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
              <RefreshCw size={16} color={canResend ? '#667eea' : '#999'} />
              <Text style={[
                styles.resendText,
                isDarkMode && styles.resendTextDark,
                !canResend && styles.resendTextDisabled,
                isRTL && styles.rtl
              ]}>
                {language === 'fa' ? 'ارسال مجدد کد' : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowRight size={18} color="#667eea" />
              <Text style={[styles.backText, isRTL && styles.rtl]}>
                {language === 'fa' ? 'بازگشت' : 'Back'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Card */}
        <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
          <Shield size={20} color="#667eea" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark, isRTL && styles.rtl]}>
            {language === 'fa'
              ? 'کد تایید به شماره موبایل شما ارسال شده است'
              : 'Verification code has been sent to your mobile'}
          </Text>
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, isRTL && styles.rtl]}>
          {language === 'fa'
            ? 'کد را دریافت نکردید؟ پس از اتمام زمان مجددا ارسال کنید'
            : "Didn't receive the code? Resend after timer ends"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -50,
    left: -50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  // Icon
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },

  // Code Card
  codeCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  glassOverlayDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
  },
  codeContent: {
    padding: 32,
    position: 'relative',
    zIndex: 1,
  },

  // Code Inputs
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  codeInput: {
    width: 56,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
  },
  codeInputFilled: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  codeInputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
    color: '#e0e0e0',
  },
  codeInputError: {
    borderColor: '#DC3545',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#DC3545',
    fontWeight: '600',
  },

  // Timer
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  timerTextDark: {
    color: '#999',
  },

  // Verify Button
  verifyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  // Resend Button
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  resendTextDark: {
    color: '#667eea',
  },
  resendTextDisabled: {
    color: '#999',
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
    color: '#667eea',
    fontWeight: '600',
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoCardDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  infoTextDark: {
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Footer
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },

  // RTL
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});