import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import {
  Server,
  Globe,
  CheckCircle2,
  AlertCircle,
  Wifi,
  ArrowRight
} from 'lucide-react-native';

export default function ServerConfigScreen() {
  const router = useRouter();
  const {setVersion, isDarkMode} = useStore();
  const [serverUrl, setServerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // انیمیشن‌های بک‌گراند دایره‌ها
  const bgPulseAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

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

    checkExistingConfig();
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

  const checkExistingConfig = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('serverUrl');
      if (savedUrl) {
        setServerUrl(savedUrl);
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.log('Error checking config:', error);
    }
  };

  const validateUrl = (url) => {
    let cleanUrl = url.trim().toLowerCase();
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    cleanUrl = cleanUrl.replace(/\/$/, '');
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;
    
    return {
      isValid: domainRegex.test(cleanUrl),
      cleanUrl: cleanUrl
    };
  };

  const testConnection = async (url) => {
    try {
      const baseUrl = `https://${url}/modules.php`;

      const formData = new URLSearchParams();
      formData.append('name', 'Icms');
      formData.append('file', 'json');
      formData.append('op', 'm_version');

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString()
      });

      if (response.ok) {
        const jsonData = await response.json();
        setVersion({...jsonData, baseUrl, serverUrl: `https://${url}`})
        return { success: true, data: jsonData };
      } else {
        return { 
          success: false, 
          error: `خطای سرور: ${response.status}`
        };
      }
    } catch (error) {
      console.error('Full error:', error);
      return { 
        success: false, 
        error: 'عدم اتصال به سرور',
        details: error.message
      };
    }
  };

  const handleConnect = async () => {
    setError('');
    setConnectionStatus(null);

    if (!serverUrl.trim()) {
      setError('لطفا آدرس سرور را وارد کنید');
      return;
    }

    const validation = validateUrl(serverUrl);
    
    if (!validation.isValid) {
      setError('فرمت آدرس سرور صحیح نیست');
      return;
    }

    setLoading(true);

    const result = await testConnection(validation.cleanUrl);
    console.log('result',result)

    setLoading(false);

    if (result.success) {
      setConnectionStatus('success');
      
      try {       
        setTimeout(() => {
          Alert.alert(
            '✓ موفق',
            'اتصال با موفقیت برقرار شد',
            [
              { 
                text: 'ادامه',
                onPress: () => router.replace('/(tabs)/home')
              }
            ]
          );
          router.replace('/(tabs)/home');
        }, 500);
      } catch (error) {
        setError('خطا در ذخیره‌سازی تنظیمات');
      }
    } else {
      setConnectionStatus('error');
      setError(result.error);
    }
  };

  const handleSkip = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('بدون تنظیم سرور، برخی امکانات در دسترس نخواهند بود. آیا مطمئن هستید؟')) {
        router.replace('/(tabs)/home');
      }
    } else {
      Alert.alert(
        'توجه',
        'بدون تنظیم سرور، برخی امکانات در دسترس نخواهند بود. آیا مطمئن هستید؟',
        [
          { text: 'انصراف', style: 'cancel' },
          { 
            text: 'ادامه',
            onPress: () => router.replace('/(tabs)/home')
          }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
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
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.iconGradient}
              >
                <Server size={32} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
            </View>

            <Text style={styles.title}>پیکربندی سرور</Text>
            <Text style={styles.subtitle}>
              برای استفاده از سامانه، آدرس سرور را وارد کنید
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Server URL Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>آدرس سرور</Text>
              
              <View style={[
                styles.inputWrapper,
                error && styles.inputWrapperError,
                connectionStatus === 'success' && styles.inputWrapperSuccess
              ]}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixText}>https://</Text>
                </View>
                
                <TextInput
                  style={styles.input}
                  value={serverUrl}
                  onChangeText={(text) => {
                    setServerUrl(text);
                    setError('');
                    setConnectionStatus(null);
                  }}
                  placeholder="example.domain.com"
                  placeholderTextColor="#adb5bd"
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                {connectionStatus === 'success' && (
                  <CheckCircle2 size={20} color="#28a745" style={styles.statusIcon} />
                )}
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#dc3545" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Example */}
              <View style={styles.hintContainer}>
                <Globe size={14} color="#6c757d" />
                <Text style={styles.hintText}>
                  مثال: rasad.feham.ir
                </Text>
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoHeader}>
                <Wifi size={16} color="#4A90E2" />
                <Text style={styles.infoTitle}>نکته</Text>
              </View>
              <Text style={styles.infoText}>
                سرور باید در مسیر <Text style={styles.infoPath}>/modules.php</Text> پاسخگو باشد
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleConnect}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#adb5bd', '#adb5bd'] : ['#4A90E2', '#357ABD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>اتصال به سرور</Text>
                    <ArrowRight size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>رد کردن این مرحله</Text>
            </TouchableOpacity>
          </View>

          {/* Success/Error Message */}
          {connectionStatus && (
            <Animated.View 
              style={[
                styles.messageCard,
                connectionStatus === 'success' ? styles.messageCardSuccess : styles.messageCardError
              ]}
            >
              <View style={styles.messageContent}>
                {connectionStatus === 'success' ? (
                  <>
                    <CheckCircle2 size={20} color="#28a745" />
                    <Text style={styles.messageText}>اتصال با موفقیت برقرار شد</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} color="#dc3545" />
                    <Text style={styles.messageText}>عدم اتصال به سرور</Text>
                  </>
                )}
              </View>
            </Animated.View>
          )}

          {/* Footer */}
          <Text style={styles.footer}>
            نسخه ۱.۱ • شرکت فهام
          </Text>
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
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
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

  // Input Section
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  inputWrapperSuccess: {
    borderColor: '#28a745',
    backgroundColor: '#f0fff4',
  },
  prefixContainer: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#212529',
    paddingHorizontal: 14,
    paddingVertical: 14,
    direction: 'ltr',
    textAlign: 'left',
  },
  statusIcon: {
    marginRight: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#dc3545',
    fontWeight: '500',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#6c757d',
  },

  // Info Box
  infoBox: {
    backgroundColor: '#f0f7ff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A90E2',
  },
  infoText: {
    fontSize: 12,
    color: '#495057',
    lineHeight: 18,
  },
  infoPath: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
    color: '#4A90E2',
  },

  // Buttons
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },

  // Message Card
  messageCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  messageCardSuccess: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  messageCardError: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },

  // Footer
  footer: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    fontWeight: '500',
  },
});