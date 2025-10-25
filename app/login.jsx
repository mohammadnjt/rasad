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
  LogIn,
  Shield
} from 'lucide-react-native';
import { api } from '../hooks/api';

const { width, height } = Dimensions.get('window');

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  icon: Icon,
  secureTextEntry,
  keyboardType,
  animValue, 
  isDarkMode, 
  isRTL, 
  showPassword, 
  onToggleShowPassword 
}) => (
  <Animated.View
    style={{
      opacity: animValue, 
      transform: [{
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        })
      }],
      marginBottom: 20,
    }}
  >
    <Text style={[
      styles.inputLabel, 
      isDarkMode && styles.textDark,
      isRTL && styles.rtlText
    ]}>
      {label}
    </Text>
    <View style={[
      styles.inputWrapper, 
      error && styles.inputWrapperError,
      isDarkMode && styles.inputWrapperDark,
      isRTL && styles.rtlInputWrapper
    ]}>
      <View style={isRTL ? styles.iconContainerRTL : styles.iconContainerLTR}>
        <Icon size={20} color="#667eea" />
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
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onToggleShowPassword}
        >
          {showPassword ? (
            <EyeOff size={20} color="#999" />
          ) : (
            <Eye size={20} color="#999" />
          )}
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={[styles.errorText, isRTL && styles.rtlText]}>{error}</Text>}
  </Animated.View>
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

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const inputAnims = useRef([new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.spring(inputAnims[0], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(inputAnims[1], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
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
      // Call login API
      const response = await api.login(username, mobile);

      if (response.code === 2) {
        // Code sent successfully - save temp data and navigate to verify
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
        // Direct login without verification
        throw new Error(language === 'fa' ? 'لطفا از صفحه تایید کد استفاده کنید' : 'Please use verification code');
      } else {
        throw new Error(response.message || (language === 'fa' ? 'خطا در ورود' : 'Login failed'));
      }
    } catch (error) {
      const errorTitle = t.error || 'خطا';
      const errorMessage = error.message || (t.loginFailed || 'ورود ناموفق');

      if (Platform.OS === 'web') {
        alert(`${errorTitle}\n${errorMessage}`);
      } else {
        Alert.alert(errorTitle, errorMessage);
      }
    } finally {
      setLoading(false);
    }
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { opacity: fadeAnim, transform: [{ scale: logoScale }] }
            ]}
          >
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.logoGradient}
              >
                {logo ? 
                  <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" /> 
                  : <Shield size={64} color="#fff" strokeWidth={2} />
                }
              </LinearGradient>
            </View>
            <Text style={styles.logoTitle}>
              {language === 'fa' ? 'سامانه رصد و پایش' : 'Monitoring System'}
            </Text>
            <Text style={styles.logoSubtitle}>
              {language === 'fa' ? 'Threat Monitoring System' : 'Version 1.1'}
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View 
            style={[
              styles.formCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={[styles.glassOverlay, isDarkMode && styles.glassOverlayDark]} />

            <View style={styles.formContent}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, isDarkMode && styles.textDark, isRTL && styles.rtlText]}>
                  {t.login || 'ورود به سامانه'}
                </Text>
                <Text style={[styles.formSubtitle, isDarkMode && styles.subtitleDark, isRTL && styles.rtlText]}>
                  {language === 'fa' ? 'برای ادامه وارد شوید' : 'Sign in to continue'}
                </Text>
              </View>

              {/* Username Input */}
              <CustomInput
                label={t.username || 'نام کاربری'}
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                icon={User}
                animValue={inputAnims[0]}
                isDarkMode={isDarkMode}
                isRTL={isRTL}
              />

              {/* Mobile Input */}
              <CustomInput
                label={t.mobile || 'شماره موبایل'}
                value={mobile}
                onChangeText={setMobile}
                error={errors.mobile}
                icon={Phone}
                keyboardType="phone-pad"
                animValue={inputAnims[1]}
                isDarkMode={isDarkMode}
                isRTL={isRTL}
              />

              {/* Remember Me */}
              <TouchableOpacity
                style={[styles.rememberContainer, isRTL && styles.rtlRow]} 
                onPress={() => setRememberMe(!rememberMe)}
              >
                {rememberMe ? (
                  <CheckSquare size={22} color="#667eea" strokeWidth={2.5} />
                ) : (
                  <Square size={22} color={isDarkMode ? '#666' : '#999'} strokeWidth={2} />
                )}
                <Text style={[styles.rememberText, isDarkMode && styles.textDark, isRTL && styles.rtlText, isRTL && styles.rtlMargin]}>
                  {t.rememberMe || 'مرا به خاطر بسپار'}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.loginGradient, isRTL && styles.rtlRow]}
                >
                  {loading ? (
                    <Text style={[styles.loginButtonText, isRTL && styles.rtlText]}>
                      {language === 'fa' ? 'در حال ارسال...' : 'Sending...'}
                    </Text>
                  ) : (
                    <>
                      <Text style={[styles.loginButtonText, isRTL && styles.rtlText]}>
                        {language === 'fa' ? 'دریافت کد' : 'Get Code'}
                      </Text>
                      <LogIn size={20} color="#fff" style={isRTL && styles.rtlMargin} /> 
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Demo Info */}
              <View style={[styles.demoCard, isDarkMode && styles.demoCardDark]}>
                <View style={[styles.demoHeader, isRTL && styles.rtlRow]}>
                  <View style={[styles.demoBadge, isRTL && styles.rtlMargin]}>
                    <Text style={styles.demoBadgeText}>DEMO</Text>
                  </View>
                  <Text style={[styles.demoTitle, isDarkMode && styles.textDark, isRTL && styles.rtlText]}>
                    {language === 'fa' ? 'اطلاعات آزمایشی' : 'Demo Credentials'}
                  </Text>
                </View>
                <View style={[styles.demoRow, isRTL && styles.rtlRow]}>
                  <Text style={[styles.demoLabel, isDarkMode && styles.demoLabelDark, isRTL && styles.rtlText]}>
                    {language === 'fa' ? 'نام کاربری:' : 'Username:'}
                  </Text>
                  <Text style={[styles.demoValue, isDarkMode && styles.demoValueDark]}>
                    demo
                  </Text>
                </View>
                <View style={[styles.demoRow, isRTL && styles.rtlRow]}>
                  <Text style={[styles.demoLabel, isDarkMode && styles.demoLabelDark, isRTL && styles.rtlText]}>
                    {language === 'fa' ? 'موبایل:' : 'Mobile:'}
                  </Text>
                  <Text style={[styles.demoValue, isDarkMode && styles.demoValueDark]}>
                    09123456789
                  </Text>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={[styles.forgotText, isRTL && styles.rtlText]}>
                  {language === 'fa' ? 'مشکل در ورود؟' : 'Trouble logging in?'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <Text style={[styles.footerText, isRTL && styles.rtlText]}>
              {language === 'fa' 
                ? `نسخه ${version} • توسعه یافته توسط فهام`
                : `Version ${version} • Developed by Faham`}
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#667eea' },
  containerDark: { backgroundColor: '#0a0a0a' },
  backgroundGradient: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
  decorativeCircle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 255, 255, 0.1)', top: -100, right: -100 },
  decorativeCircle2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.08)', bottom: -50, left: -50 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20, minHeight: height * 0.9 },
  logoContainer: { alignItems: 'center', marginBottom: 40, marginTop: 60 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  logoGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  logoTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8, textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  logoSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', fontWeight: '500' },
  formCard: { borderRadius: 32, overflow: 'hidden', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 12 },
  glassOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.95)' },
  glassOverlayDark: { backgroundColor: 'rgba(26, 26, 26, 0.95)' },
  formContent: { padding: 28, position: 'relative', zIndex: 1 },
  formHeader: { alignItems: 'center', marginBottom: 32 },
  formTitle: { fontSize: 26, fontWeight: '700', color: '#333', marginBottom: 8 },
  formSubtitle: { fontSize: 14, color: '#666', fontWeight: '500' },
  subtitleDark: { color: '#999' },
  textDark: { color: '#e0e0e0' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginRight: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 16, borderWidth: 2, borderColor: 'transparent', paddingHorizontal: 16, height: 56 },
  inputWrapperDark: { backgroundColor: '#2a2a2a' },
  inputWrapperError: { borderColor: '#DC3545' },
  iconContainerLTR: { marginLeft: 12, marginRight: 8 },
  iconContainerRTL: { marginRight: 12, marginLeft: 8 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 0, textAlign: 'left', ...(Platform.OS === 'web' && { outlineStyle: 'none' }) },
  inputDark: { color: '#e0e0e0' },
  eyeButton: { padding: 8 },
  errorText: { color: '#DC3545', fontSize: 12, marginTop: 6, marginRight: 4 },
  rememberContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  rememberText: { fontSize: 14, color: '#333', fontWeight: '500', marginRight: 8, textAlign: 'left' },
  loginButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 20, shadowColor: '#667eea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  loginGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 8 },
  loginButtonText: { fontSize: 18, fontWeight: '700', color: '#fff', marginLeft: 8, textAlign: 'left' },
  demoCard: { backgroundColor: '#f8f9fa', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e9ecef' },
  demoCardDark: { backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' },
  demoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  demoBadge: { backgroundColor: '#667eea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  demoBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  demoTitle: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'left' },
  demoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  demoLabel: { fontSize: 13, color: '#666', fontWeight: '500', textAlign: 'left' },
  demoLabelDark: { color: '#999' },
  demoValue: { fontSize: 13, color: '#333', fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  demoValueDark: { color: '#e0e0e0', backgroundColor: '#1a1a1a' },
  forgotButton: { alignItems: 'center', paddingVertical: 8 },
  forgotText: { fontSize: 14, color: '#667eea', fontWeight: '600', textAlign: 'center' },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500', textAlign: 'center' },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  rtlInputWrapper: { flexDirection: 'row-reverse' },
  rtlTextInput: { textAlign: 'right', writingDirection: 'rtl' },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlMargin: { marginRight: 0, marginLeft: 8 }
});