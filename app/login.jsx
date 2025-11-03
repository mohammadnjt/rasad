import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Phone, 
  Eye, 
  EyeOff,
  CheckSquare,
  Square,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react-native';
import { api } from '../hooks/api';

const { height } = Dimensions.get('window');

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  icon: Icon,
  secureTextEntry,
  keyboardType,
  isDarkMode, 
  isRTL, 
  showPassword, 
  onToggleShowPassword 
}) => (
  <View style={styles.inputSection}>
    <Text style={[
      styles.inputLabel, 
      isDarkMode && styles.inputLabelDark,
      isRTL && styles.rtlText
    ]}>
      {label}
    </Text>
    <View style={[
      styles.inputWrapper, 
      error && styles.inputWrapperError,
      isDarkMode && styles.inputWrapperDark
    ]}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={error ? '#dc3545' : '#4A90E2'} />
      </View>
      <TextInput
        style={[
          styles.input, 
          isDarkMode && styles.inputDark, 
          isRTL && styles.rtlTextInput 
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholder={`${label} خود را وارد کنید`}
        placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onToggleShowPassword}
        >
          {showPassword ? (
            <EyeOff size={18} color="#6c757d" />
          ) : (
            <Eye size={18} color="#6c757d" />
          )}
        </TouchableOpacity>
      )}
    </View>
    {error && (
      <Text style={[styles.errorText, isRTL && styles.rtlText]}>
        {error}
      </Text>
    )}
  </View>
);

export default function LoginScreen() {
  const router = useRouter();
  const { language, isDarkMode, logo, version } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa'; 

  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  const validateMobile = (mob) => {
    const cleaned = mob.replace(/\D/g, '');
    if (!cleaned) return t.required || 'الزامی';
    if (!/^09\d{9}$/.test(cleaned)) {
      return language === 'fa' 
        ? 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود'
        : 'Mobile must be 11 digits and start with 09';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = t.required || 'الزامی';
    const mobileError = validateMobile(mobile);
    if (mobileError) newErrors.mobile = mobileError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.login(username, mobile);

      if (response.code === 2) {
        const tempData = {
          username,
          mobile,
          rememberMe
        };
        
        await AsyncStorage.setItem('tempLoginData', JSON.stringify(tempData));

        const successMessage = language === 'fa' 
          ? 'کد تایید به شماره موبایل شما ارسال شد' 
          : 'Verification code sent to your mobile';

        if (Platform.OS === 'web') {
          alert(successMessage);
          router.push('/verifyCode');
        } else {
          Alert.alert(
            language === 'fa' ? '✓ موفق' : 'Success',
            successMessage,
            [{ text: 'OK', onPress: () => router.push('/verifyCode') }]
          );
        }
      } else if (response.code === 1) {
        throw new Error(language === 'fa' ? 'لطفا از صفحه تایید کد استفاده کنید' : 'Please use verification code');
      } else {
        throw new Error(response.message || (language === 'fa' ? 'خطا در ورود' : 'Login failed'));
      }
    } catch (error) {
      const errorTitle = t.error || 'خطا';
      const errorMessage = error.message || (t.loginFailed || 'ورود ناموفق');

      if (Platform.OS === 'web') {
        alert(`${errorTitle}
${errorMessage}`);
      } else {
        Alert.alert(errorTitle, errorMessage);
      }
    } finally {
      setLoading(false);
    }
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.logoGradient}
                >
                  {logo ? 
                    <Image source={logo} style={{ width: 48, height: 48, objectFit: 'contain' }} alt="Logo" /> 
                    : <Shield size={48} color="#fff" strokeWidth={2.5} />
                  }
                </LinearGradient>
              </View>

              <Text style={[styles.title, isDarkMode && styles.titleDark]}>
                {language === 'fa' ? 'ورود به سامانه' : 'System Login'}
              </Text>
              <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
                {language === 'fa' 
                  ? 'برای دسترسی به سامانه، اطلاعات خود را وارد کنید'
                  : 'Enter your credentials to access the system'}
              </Text>
            </View>

            {/* Form Card */}
            <View style={[styles.formCard, isDarkMode && styles.formCardDark]}>
              {/* Username Input */}
              <CustomInput
                label={t.username || 'نام کاربری'}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors({...errors, username: null});
                  }
                }}
                error={errors.username}
                icon={User}
                isDarkMode={isDarkMode}
                isRTL={isRTL}
              />

              {/* Mobile Input */}
              <CustomInput
                label={t.mobile || 'شماره موبایل'}
                value={mobile}
                onChangeText={(text) => {
                  setMobile(text);
                  if (errors.mobile) {
                    setErrors({...errors, mobile: null});
                  }
                }}
                error={errors.mobile}
                icon={Phone}
                keyboardType="phone-pad"
                isDarkMode={isDarkMode}
                isRTL={isRTL}
              />

              {/* Remember Me */}
              <TouchableOpacity
                style={[styles.rememberContainer, isRTL && styles.rtlRow]} 
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                {rememberMe ? (
                  <CheckSquare size={20} color="#4A90E2" strokeWidth={2.5} />
                ) : (
                  <Square size={20} color="#6c757d" strokeWidth={2} />
                )}
                <Text style={[
                  styles.rememberText, 
                  isDarkMode && styles.rememberTextDark,
                  isRTL && styles.rtlText
                ]}>
                  {t.rememberMe || 'مرا به خاطر بسپار'}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#adb5bd', '#adb5bd'] : ['#4A90E2', '#357ABD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginGradient}
                >
                  {loading ? (
                    <Text style={styles.loginButtonText}>
                      {language === 'fa' ? 'در حال ارسال...' : 'Sending...'}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>
                        {language === 'fa' ? 'دریافت کد تایید' : 'Get Verification Code'}
                      </Text>
                      <ArrowRight size={18} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Forgot Link */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={[styles.forgotText, isRTL && styles.rtlText]}>
                  {language === 'fa' ? 'مشکل در ورود دارید؟' : 'Having trouble logging in?'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Info Card */}
            {/* <View style={[styles.demoCard, isDarkMode && styles.demoCardDark]}>
              <View style={styles.demoHeader}>
                <Info size={16} color="#4A90E2" />
                <Text style={[styles.demoTitle, isDarkMode && styles.demoTitleDark]}>
                  {language === 'fa' ? 'اطلاعات آزمایشی' : 'Demo Account'}
                </Text>
              </View>
              <View style={styles.demoContent}>
                <View style={styles.demoRow}>
                  <Text style={[styles.demoLabel, isDarkMode && styles.demoLabelDark]}>
                    {language === 'fa' ? 'نام کاربری:' : 'Username:'}
                  </Text>
                  <Text style={[styles.demoValue, isDarkMode && styles.demoValueDark]}>
                    demo
                  </Text>
                </View>
                <View style={styles.demoRow}>
                  <Text style={[styles.demoLabel, isDarkMode && styles.demoLabelDark]}>
                    {language === 'fa' ? 'موبایل:' : 'Mobile:'}
                  </Text>
                  <Text style={[styles.demoValue, isDarkMode && styles.demoValueDark]}>
                    09123456789
                  </Text>
                </View>
              </View>
            </View> */}

            {/* Footer */}
            <Text style={[styles.footer, isDarkMode && styles.footerDark]}>
              {language === 'fa' 
                ? `نسخه ${version?.version || '1.1'} • شرکت فهام`
                : `Version ${version?.version || '1.1'} • Faham Company`}
            </Text>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    minHeight: height * 0.9,
  },
  content: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
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
  logoGradient: {
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

  // Form Card
  formCard: {
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
  formCardDark: {
    backgroundColor: '#212529',
  },

  // Input Section
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  inputLabelDark: {
    color: '#adb5bd',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  inputWrapperDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
  },
  inputWrapperError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  iconContainer: {
    paddingLeft: 14,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#212529',
    paddingVertical: 14,
    paddingRight: 14,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputDark: {
    color: '#e9ecef',
  },
  rtlTextInput: {
    textAlign: 'right',
  },
  eyeButton: {
    padding: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // Remember Me
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 2,
  },
  rememberText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
    marginLeft: 10,
  },
  rememberTextDark: {
    color: '#adb5bd',
  },

  // Login Button
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Forgot Button
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },

  // Demo Card
  demoCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  demoCardDark: {
    backgroundColor: '#1e2a3a',
    borderColor: '#2d3e50',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d0e7ff',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
  },
  demoTitleDark: {
    color: '#6ca8e8',
  },
  demoContent: {
    gap: 8,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  demoLabelDark: {
    color: '#adb5bd',
  },
  demoValue: {
    fontSize: 13,
    color: '#212529',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  demoValueDark: {
    color: '#e9ecef',
    backgroundColor: '#2d3139',
  },

  // Footer
  footer: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    fontWeight: '500',
  },
  footerDark: {
    color: '#6c757d',
  },

  // RTL Support
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
});