// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useStore } from '../../store/useStore';
// import { translations } from '../../constants/translations';
// import Header from '../../components/Header';
// import { User, BookOpen, Newspaper, Mail, Settings as SettingsIcon, Circle as HelpCircle, ChevronRight } from 'lucide-react-native';

// export default function HomeScreen() {
//   const router = useRouter();
//   const { language, isDarkMode, isLoggedIn } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const menuItems = [
//     {
//       id: 'login',
//       title: t.login,
//       icon: User,
//       route: '/login',
//       show: !isLoggedIn
//     },
//     {
//       id: 'education',
//       title: t.education,
//       icon: BookOpen,
//       route: '/education',
//       show: true
//     },
//     {
//       id: 'news',
//       title: t.news,
//       icon: Newspaper,
//       route: '/news',
//       show: true
//     },
//     {
//       id: 'contact',
//       title: t.contactUs,
//       icon: Mail,
//       route: '/contact',
//       show: true
//     },
//     {
//       id: 'settings',
//       title: t.settings,
//       icon: SettingsIcon,
//       route: '/settings',
//       show: true
//     },
//     {
//       id: 'guide',
//       title: t.guide,
//       icon: HelpCircle,
//       route: '/guide',
//       show: true
//     },
//   ];

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />
//       <ScrollView style={styles.content}>
//         <View style={styles.menuGrid}>
//           {menuItems.filter(item => item.show).map(item => (
//             <TouchableOpacity
//               key={item.id}
//               style={[styles.menuItem, isDarkMode && styles.menuItemDark]}
//               onPress={() => router.push(item.route)}
//               activeOpacity={0.7}
//             >
//               <item.icon size={32} color="#007BFF" />
//               <Text style={[
//                 styles.menuItemText,
//                 isDarkMode && styles.menuItemTextDark,
//                 isRTL && styles.rtl
//               ]}>
//                 {item.title}
//               </Text>
//               <ChevronRight
//                 size={20}
//                 color={isDarkMode ? '#666' : '#999'}
//                 style={isRTL ? styles.chevronLeft : styles.chevronRight}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   containerDark: {
//     backgroundColor: '#121212',
//   },
//   content: {
//     flex: 1,
//   },
//   menuGrid: {
//     padding: 16,
//   },
//   menuItem: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   menuItemDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   menuItemText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     marginLeft: 16,
//   },
//   menuItemTextDark: {
//     color: '#e0e0e0',
//   },
//   rtl: {
//     writingDirection: 'rtl',
//     textAlign: 'right',
//   },
//   chevronRight: {
//     marginLeft: 'auto',
//   },
//   chevronLeft: {
//     marginRight: 'auto',
//     transform: [{ rotate: '180deg' }],
//   },
// });


import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { translations } from '../../constants/translations';
import Header from '../../components/Header';
import { 
  User, 
  BookOpen, 
  Newspaper, 
  Mail, 
  Settings as SettingsIcon, 
  Circle as HelpCircle 
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient'; // نصب کنید: expo install expo-linear-gradient

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { language, isDarkMode, isLoggedIn } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  // انیمیشن‌ها
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([]).current;

  const menuItems = [
    {
      id: 'login',
      title: t.login,
      subtitle: 'ورود به حساب کاربری',
      icon: User,
      route: '/login',
      gradient: ['#667eea', '#764ba2'],
      show: !isLoggedIn
    },
    {
      id: 'education',
      title: t.education,
      subtitle: 'آموزش و یادگیری',
      icon: BookOpen,
      route: '/education',
      gradient: ['#f093fb', '#f5576c'],
      show: true
    },
    {
      id: 'news',
      title: t.news,
      subtitle: 'اخبار و اطلاعیه‌ها',
      icon: Newspaper,
      route: '/news',
      gradient: ['#4facfe', '#00f2fe'],
      show: true
    },
    {
      id: 'contact',
      title: t.contactUs,
      subtitle: 'ارتباط با ما',
      icon: Mail,
      route: '/contact',
      gradient: ['#43e97b', '#38f9d7'],
      show: true
    },
    {
      id: 'settings',
      title: t.settings,
      subtitle: 'تنظیمات برنامه',
      icon: SettingsIcon,
      route: '/settings',
      gradient: ['#fa709a', '#fee140'],
      show: true
    },
    {
      id: 'guide',
      title: t.guide,
      subtitle: 'راهنمای استفاده',
      icon: HelpCircle,
      route: '/guide',
      gradient: ['#30cfd0', '#330867'],
      show: true
    },
  ];

  const visibleItems = menuItems.filter(item => item.show);

  // Initialize scale animations
  useEffect(() => {
    scaleAnims.length = 0;
    visibleItems.forEach(() => {
      scaleAnims.push(new Animated.Value(0));
    });
  }, [visibleItems.length]);

  useEffect(() => {
    // انیمیشن ورود صفحه
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // انیمیشن stagger برای کارت‌ها
      Animated.stagger(
        100,
        scaleAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const AnimatedMenuItem = ({ item, index }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              scale: scaleAnims[index] || new Animated.Value(1),
            },
            {
              scale: pressAnim,
            },
          ],
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(item.route)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.menuItem,
              isDarkMode && styles.menuItemDark,
            ]}
          >
            {/* طبقه شیشه‌ای */}
            <View style={[
              styles.glassOverlay,
              isDarkMode && styles.glassOverlayDark
            ]} />
            
            <View style={styles.menuItemContent}>
              {/* آیکون */}
              <View style={styles.iconContainer}>
                <item.icon size={32} color="#ffffff" strokeWidth={2.5} />
              </View>

              {/* متن */}
              <View style={styles.textContainer}>
                <Text style={[
                  styles.menuItemTitle,
                  isRTL && styles.rtl
                ]}>
                  {item.title}
                </Text>
                <Text style={[
                  styles.menuItemSubtitle,
                  isRTL && styles.rtl
                ]}>
                  {item.subtitle}
                </Text>
              </View>

              {/* فلش */}
              <View style={[
                styles.arrowContainer,
                isRTL && styles.arrowContainerRTL
              ]}>
                <Text style={styles.arrow}>
                  {isRTL ? '←' : '→'}
                </Text>
              </View>
            </View>

            {/* دایره دکوراتیو */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode 
            ? ['#1a1a2e', '#16213e', '#0f3460']
            : ['#667eea', '#764ba2', '#f093fb']
        }
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* عنوان خوش‌آمدگویی */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.welcomeContainer}>
            <Text style={[
              styles.welcomeTitle,
              isRTL && styles.rtl
            ]}>
              {isRTL ? '👋 خوش آمدید' : 'Welcome 👋'}
            </Text>
            <Text style={[
              styles.welcomeSubtitle,
              isRTL && styles.rtl
            ]}>
              {isRTL ? 'رصد و پایش تهدیدات زیست' : 'Threat Monitoring System'}
            </Text>
          </View>
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {visibleItems.map((item, index) => (
            <AnimatedMenuItem key={item.id} item={item} index={index} />
          ))}
        </View>

        {/* فاصله انتهایی */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    opacity: 0.1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeContainer: {
    padding: 24,
    paddingTop: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  menuGrid: {
    paddingHorizontal: 16,
    marginBottom: 50,
    gap: 16,
  },
  menuItem: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItemDark: {
    shadowColor: '#000',
    shadowOpacity: 0.6,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  glassOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainerRTL: {
    transform: [{ rotate: '180deg' }],
  },
  arrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  // دایره‌های دکوراتیو
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -10,
    left: 20,
  },
});