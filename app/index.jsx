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
import {
  Server,
  Globe,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  ArrowRight
} from 'lucide-react-native';

export default function ServerConfigScreen() {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'success', 'error'
  const [error, setError] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
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

    // Check if server is already configured
    checkExistingConfig();

    // Pulse animation for server icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
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

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const validateUrl = (url) => {
    // Remove http:// or https:// if user entered it
    let cleanUrl = url.trim().toLowerCase();
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    cleanUrl = cleanUrl.replace(/\/$/, ''); // Remove trailing slash
    
    // Check if it's a valid domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;
    
    return {
      isValid: domainRegex.test(cleanUrl),
      cleanUrl: cleanUrl
    };
  };

  const testConnection = async (url) => {
    try {
      const fullUrl = `https://${url}/modules.php`;
      const formData = new FormData();
      formData.append('name', 'Icms');
      formData.append('file', 'json'); // jsonBlob یک Blob یا File است
      formData.append('op', 'm_version');

      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(fullUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        // await AsyncStorage.setItem('serverUrl', fullUrl);
        // await AsyncStorage.setItem('version', res);
        return { success: true, data: await response.json() };
      } else {
        return { 
          success: false, 
          error: `خطای سرور: ${response.status}` 
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { 
          success: false, 
          error: 'زمان اتصال به پایان رسید' 
        };
      }
      return { 
        success: false, 
        error: 'عدم اتصال به سرور' 
      };
    }
  };

  const handleConnect = async () => {
    setError('');
    setConnectionStatus(null);

    if (!serverUrl.trim()) {
      setError('لطفا آدرس سرور را وارد کنید');
      shakeAnimation();
      return;
    }

    const validation = validateUrl(serverUrl);
    
    if (!validation.isValid) {
      setError('فرمت آدرس سرور صحیح نیست');
      shakeAnimation();
      return;
    }

    setLoading(true);

    // Test connection
    const result = await testConnection(validation.cleanUrl);
    console.log('result',result)

    setLoading(false);

    if (result.success) {
      setConnectionStatus('success');
      
      // Save to storage
      try {
        await AsyncStorage.setItem('serverUrl', validation.cleanUrl);
        await AsyncStorage.setItem('version', JSON.stringify(result.data));
        
        // Success animation
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
      shakeAnimation();
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
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
      />

      {/* Decorative Circles */}
      <Animated.View 
        style={[
          styles.decorativeCircle1,
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.decorativeCircle2,
          { opacity: fadeAnim }
        ]} 
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
          {/* Server Icon */}
          <Animated.View 
            style={[
              styles.serverIconContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.serverIconGradient}
            >
              <Server size={64} color="#fff" strokeWidth={2} />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>تنظیمات سرور</Text>
          <Text style={styles.subtitle}>
            آدرس سرور را برای اتصال وارد کنید
          </Text>

          {/* Form Card */}
          <Animated.View 
            style={[
              styles.formCard,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <View style={styles.glassOverlay} />
            
            <View style={styles.formContent}>
              {/* Example */}
              <View style={styles.exampleContainer}>
                <Globe size={16} color="#667eea" />
                <Text style={styles.exampleText}>
                  مثال: rasad.feham.ir
                </Text>
              </View>

              {/* Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <View style={styles.protocolBadge}>
                    <Text style={styles.protocolText}>https://</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={serverUrl}
                    onChangeText={setServerUrl}
                    placeholder="rasad.feham.ir"
                    placeholderTextColor="#999"
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {connectionStatus && (
                    <View style={styles.statusIcon}>
                      {connectionStatus === 'success' ? (
                        <CheckCircle2 size={20} color="#28A745" />
                      ) : (
                        <AlertCircle size={20} color="#DC3545" />
                      )}
                    </View>
                  )}
                </View>
                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={14} color="#DC3545" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>

              {/* Connection Info */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Wifi size={16} color="#667eea" />
                  <Text style={styles.infoTitle}>نحوه اتصال</Text>
                </View>
                <Text style={styles.infoText}>
                  سرور باید در آدرس /moduls.php پاسخگو باشد
                </Text>
                <Text style={styles.infoExample}>
                  مثال: https://rasad.feham.ir/moduls.php
                </Text>
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleConnect}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.connectGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.connectText}>اتصال به سرور</Text>
                      <ArrowRight size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Skip Button */}
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>رد شدن این مرحله</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Connection Status Cards */}
          {connectionStatus && (
            <Animated.View 
              style={[
                styles.statusCard,
                connectionStatus === 'success' ? styles.statusCardSuccess : styles.statusCardError
              ]}
            >
              {connectionStatus === 'success' ? (
                <>
                  <CheckCircle2 size={24} color="#28A745" />
                  <View style={styles.statusTextContainer}>
                    <Text style={styles.statusTitle}>اتصال موفق</Text>
                    <Text style={styles.statusMessage}>
                      سرور با موفقیت پیکربندی شد
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <WifiOff size={24} color="#DC3545" />
                  <View style={styles.statusTextContainer}>
                    <Text style={styles.statusTitle}>خطا در اتصال</Text>
                    <Text style={styles.statusMessage}>
                      لطفا آدرس سرور را بررسی کنید
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          )}

          {/* Footer */}
          <Text style={styles.footerText}>
            نسخه ۱.۱ • توسعه یافته توسط شرکت فهام
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  // Server Icon
  serverIconContainer: {
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
  serverIconGradient: {
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

  // Form Card
  formCard: {
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
  formContent: {
    padding: 28,
    position: 'relative',
    zIndex: 1,
  },

  // Example
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  exampleText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },

  // Input
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  protocolBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  protocolText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 16,
    direction: 'ltr',
    textAlign: 'left',
  },
  statusIcon: {
    paddingRight: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    fontWeight: '500',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoExample: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    direction: 'ltr',
  },

  // Connect Button
  connectButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  connectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  connectText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  // Skip Button
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  // Status Card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  statusCardSuccess: {
    backgroundColor: 'rgba(40, 167, 69, 0.15)',
  },
  statusCardError: {
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },

  // Footer
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
});