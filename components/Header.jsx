import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
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

  const { data, isLoading } = useSWR(
    'm_message',
    () => user?.finger ? api.getMessage(user.finger, Date.now()) : []
  );

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
          toValue: 1.05,
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
      {/* Background Gradient - Professional */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1a1d29', '#212529', '#2d3139']
            : ['#4A90E2', '#357ABD', '#2C5F94']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Decorative circles - More subtle */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Left Side - Menu */}
        <TouchableOpacity 
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={handleResetServerConfig}
        >
          <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
            <Menu size={20} color="#fff" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* Center - Logo & Version */}
        <View style={styles.centerContent}>
          <Animated.View 
            style={[
              styles.logoContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
              style={styles.logoGradient}
            >
              {logo ? (
                <Image 
                  source={logo} 
                  style={styles.logoImage}
                  contentFit="contain"
                  transition={300}
                />
              ) : (
                <Shield size={28} color="#fff" strokeWidth={2.5} />
              )}
            </LinearGradient>
          </Animated.View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              v{version || '1.1'}
            </Text>
          </View>
        </View>

        {/* Right Side - Notifications */}
        {user?.finger && (
          <TouchableOpacity 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
              <Bell size={20} color="#fff" strokeWidth={2.5} />
              {/* Notification Badge */}
              {data && data.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {data.length > 9 ? '9+' : data.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1000,
    minHeight: 100,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Decorative Circles - More subtle and professional
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: -40,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    top: 20,
    left: -15,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    bottom: 15,
    right: 40,
  },
  
  // Content - Responsive
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 45, // Reduced for better mobile experience
    paddingBottom: 16,
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 2,
    minHeight: 100,
  },
  
  // Icon Buttons
  iconButton: {
    width: 40,
    height: 40,
    zIndex: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  
  // Center Content - Improved responsiveness
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  
  // Version - Clean and professional
  versionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  versionText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  
  // Notification Badge - Improved
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#f5576c',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});