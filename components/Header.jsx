import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import { Shield, Menu, Bell } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import useSWR from 'swr';
import { api } from '../hooks/api';

export default function Header() {
  const { user, language, isDarkMode, logo, version } = useStore();
  const [ config, setConfig ] = useState(null);
  const t = translations[language];
  const isRTL = language === 'fa';

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkVersion = async () => {
      const value = await AsyncStorage.getItem('version');
      setConfig(JSON.parse(value));
    };
    checkVersion();
  }, []);

  console.log('user finger on header::::', user)

  const { data, isLoading } = useSWR(
    'm_message',
    () => user.finger ? api.getMessage(user.finger, Date.now()) : []
  );

  console.log('data message', data)

  console.log('version on header:', config);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const router = useRouter();

  const handleResetServerConfig = async () => {
    console.log('Resetting server configuration...');
    await AsyncStorage.removeItem('serverUrl');
    await AsyncStorage.removeItem('version');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1a1a2e', '#16213e']
            : ['#667eea', '#764ba2']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Decorative circles */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Left Side - Menu */}
        <TouchableOpacity 
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => {
            console.log('دکمه منو کلیک شد!'); // این باید در کنسول ظاهر شود
            handleResetServerConfig();
          }}
          // onPress={handleResetServerConfig}
        >
          <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
            <Menu size={22} color="#fff" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* Center - Logo & Title */}
        <View style={styles.centerContent}>
          <Animated.View 
            style={[
              styles.logoContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.logoGradient}
            >
              {config ? (
                <img 
                  src={logo} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  alt="Logo"
                />
              ) : (
                <Shield size={32} color="#fff" strokeWidth={2.5} />
              )}
            </LinearGradient>
          </Animated.View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, isRTL && styles.rtl]}>
              {t.appTitle || 'سامانه رصد'}
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>
                v{version}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Side - Notifications */}
        {user && user.finger && <TouchableOpacity 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
            <Bell size={22} color="#fff" strokeWidth={2.5} />
            {/* Notification Badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{data ? data.length : '0'}</Text>
            </View>
          </View>
        </TouchableOpacity>}
      </Animated.View>

      {/* Bottom Wave */}
      <View style={styles.waveContainer}>
        <View style={[styles.wave, isDarkMode && styles.waveDark]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Decorative Circles
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 30,
    left: -20,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 20,
    right: 60,
  },
  
  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 2,
  },
  
  // Icon Buttons
  iconButton: {
    width: 44,
    height: 44,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  
  // Center Content
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Title
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  
  // Notification Badge
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f5576c',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Wave Effect
  waveContainer: {
    position: 'relative',
    height: 20,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  waveDark: {
    backgroundColor: '#0a0a0a',
  },
});