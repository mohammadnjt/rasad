import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  ImageBackground
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
  HelpCircle,
  ArrowRight
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16 padding + 16 gap

export default function HomeScreen() {
  const router = useRouter();
  const { user, language, isDarkMode, isLoggedIn } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  // انیمیشن‌ها
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([]).current;

  // انیمیشن‌های بک‌گراند دایره‌ها
  const bgPulseAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  const menuItems = [
    {
      id: 'login',
      title: t.login,
      subtitle: isRTL ? 'ورود به حساب' : 'Sign in',
      icon: User,
      route: '/login',
      color: '#4A90E2',
      show: !isLoggedIn
    },
    {
      id: 'education',
      title: t.education,
      subtitle: isRTL ? 'آموزش و یادگیری' : 'Learning',
      icon: BookOpen,
      route: '/education',
      color: '#357ABD',
      show: true
    },
    {
      id: 'news',
      title: t.news,
      subtitle: isRTL ? 'اخبار و اطلاعیه' : 'News',
      icon: Newspaper,
      route: '/news',
      color: '#2C5F94',
      show: true
    },
    {
      id: 'contact',
      title: t.contactUs,
      subtitle: isRTL ? 'ارتباط با ما' : 'Contact',
      icon: Mail,
      route: '/contact',
      color: '#1F4B6F',
      show: true
    },
    {
      id: 'settings',
      title: t.settings,
      subtitle: isRTL ? 'تنظیمات برنامه' : 'Settings',
      icon: SettingsIcon,
      route: '/settings',
      color: '#4A90E2',
      show: true
    },
    {
      id: 'guide',
      title: t.guide,
      subtitle: isRTL ? 'راهنمای استفاده' : 'Help',
      icon: HelpCircle,
      route: '/guide',
      color: '#357ABD',
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
        80,
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

  const AnimatedMenuItem = ({ item, index }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnim,
            margin: 'auto',
            transform: [
              {
                scale: scaleAnims[index] || new Animated.Value(1),
              },
              {
                scale: pressAnim,
              },
            ],
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push(item.route)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.touchable}
        >
          <View style={[
            styles.menuCard,
            isDarkMode && styles.menuCardDark,
          ]}>
            {/* دایره‌های دکوراتیو */}
            <View style={[styles.decorativeCircle1, { backgroundColor: `${item.color}15` }]} />
            <View style={[styles.decorativeCircle2, { backgroundColor: `${item.color}10` }]} />
            
            {/* آیکون */}
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <item.icon size={28} color={item.color} strokeWidth={2.5} />
            </View>

            {/* متن */}
            <View style={styles.textContainer}>
              <Text style={[
                styles.menuItemTitle,
                isDarkMode && styles.menuItemTitleDark,
                isRTL && styles.rtl
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.menuItemSubtitle,
                isDarkMode && styles.menuItemSubtitleDark,
                isRTL && styles.rtl
              ]}>
                {item.subtitle}
              </Text>
            </View>

            {/* فلش */}
            <View style={[
              styles.arrowContainer,
              { backgroundColor: `${item.color}15` }
            ]}>
              <ArrowRight 
                size={16} 
                color={item.color} 
                strokeWidth={2.5}
                style={isRTL && { transform: [{ rotate: '180deg' }] }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      
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
              isDarkMode && styles.welcomeTitleDark,
              isRTL && styles.rtl
            ]}>
              {isRTL ? '👋 خوش آمدید' : 'Welcome 👋'}
            </Text>
            {user?.name && (
              <Text style={[
                styles.welcomeName,
                isDarkMode && styles.welcomeNameDark,
                isRTL && styles.rtl
              ]}>
                {user.name}
              </Text>
            )}
            <Text style={[
              styles.welcomeSubtitle,
              isDarkMode && styles.welcomeSubtitleDark,
              isRTL && styles.rtl
            ]}>
              {isRTL ? 'سامانه رصد و پایش' : 'Monitoring System'}
            </Text>
          </View>
        </Animated.View>

        {/* Menu Grid - دو ستونی */}
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

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Welcome Section
  welcomeContainer: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  welcomeTitleDark: {
    color: '#e9ecef',
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 6,
  },
  welcomeNameDark: {
    color: '#6ca8e8',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6c757d',
    fontWeight: '500',
  },
  welcomeSubtitleDark: {
    color: '#adb5bd',
  },

  // Menu Grid - دو ستونی
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  cardWrapper: {
    width: cardWidth,
  },
  touchable: {
    width: '100%',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuCardDark: {
    backgroundColor: '#212529',
    shadowOpacity: 0.2,
  },

  // دایره‌های دکوراتیو
  decorativeCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -20,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: -10,
    left: -10,
  },

  // Icon Container
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 1,
  },

  // Text Container
  textContainer: {
    flex: 1,
    zIndex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  menuItemTitleDark: {
    color: '#e9ecef',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  menuItemSubtitleDark: {
    color: '#adb5bd',
  },

  // Arrow Container
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 1,
  },

  // RTL
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});