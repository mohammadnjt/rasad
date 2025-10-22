// import { View, Text, StyleSheet } from 'react-native';
// import { useStore } from '../store/useStore';
// import { translations } from '../constants/translations';

// export default function Header() {
//   const { language, isDarkMode } = useStore();
//   const t = translations[language];

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Text style={[styles.title, isDarkMode && styles.titleDark]}>
//         {t.appTitle}
//       </Text>
//       <Text style={[styles.version, isDarkMode && styles.versionDark]}>
//         {t.version} 
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#007BFF',
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   containerDark: {
//     backgroundColor: '#0056b3',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textAlign: 'center',
//     writingDirection: 'rtl',
//   },
//   titleDark: {
//     color: '#f0f0f0',
//   },
//   version: {
//     fontSize: 12,
//     color: '#ffffff',
//     marginTop: 5,
//     opacity: 0.8,
//   },
//   versionDark: {
//     color: '#e0e0e0',
//   },
// });

import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import { Shield, Menu, Bell } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

export default function Header() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
              <Shield size={32} color="#fff" strokeWidth={2.5} />
            </LinearGradient>
          </Animated.View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, isRTL && styles.rtl]}>
              {t.appTitle || 'سامانه رصد'}
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>
                {t.version || 'v1.1'}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Side - Notifications */}
        <TouchableOpacity 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
            <Bell size={22} color="#fff" strokeWidth={2.5} />
            {/* Notification Badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
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