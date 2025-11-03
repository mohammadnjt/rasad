import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated // اضافه شد
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { Heading, Calendar, ArrowLeft, Shield, AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PublicHealthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language, isDarkMode } = useStore();
  const isRTL = language === 'fa';

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
        friction: 9,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const primaryGradient = isDarkMode
    ? ['#1f2735', '#121722']
    : ['#eef4ff', '#dbe2f5'];

  const contentGradient = isDarkMode
    ? ['#1a1f2b', '#11151f']
    : ['#ffffff', '#f5f7fb'];

  const MetaIcon = params.type?.toLowerCase().includes('هشدار') ? AlertTriangle : Shield;

  const cleanText = params.plain || params.body?.replace(/<\/?[^>]+(>|$)/g, '') || '';

  return (
    <LinearGradient colors={primaryGradient} style={styles.container}>
      <Animated.View
        style={[
          styles.headerTop,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={[styles.backButton, isDarkMode && styles.backButtonDark]}
        >
          <ArrowLeft size={20} color={isDarkMode ? '#d7e3ff' : '#4A90E2'} />
        </TouchableOpacity>

        <View style={styles.metaContainer}>
          <View style={[styles.typeBadge, isDarkMode && styles.typeBadgeDark]}>
            <MetaIcon size={16} color={isDarkMode ? '#d7e3ff' : '#1f4f8f'} />
            <Text style={[
              styles.typeText,
              isDarkMode && styles.typeTextDark,
              isRTL && styles.rtl
            ]}>
              {params.type || (language === 'fa' ? 'اعلان' : 'Announcement')}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Calendar size={14} color={isDarkMode ? '#adb5bd' : '#6c7a90'} />
            <Text style={[
              styles.dateText,
              isDarkMode && styles.dateTextDark
            ]}>
              {params.time}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.title,
            isDarkMode && styles.titleDark,
            isRTL && styles.rtl
          ]}
        >
          {params.title}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, 0.6) }],
          },
        ]}
      >
        <LinearGradient
          colors={contentGradient}
          style={[
            styles.contentCard,
            isDarkMode && styles.contentCardDark,
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                styles.bodyText,
                isDarkMode && styles.bodyTextDark,
                isRTL && styles.rtl
              ]}
            >
              {cleanText || (language === 'fa'
                ? 'متن این پیام در حال حاضر در دسترس نیست.'
                : 'The body of this message is currently unavailable.')}
            </Text>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 60,
  },
  headerTop: {
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonDark: {
    backgroundColor: '#1a1f2b',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  metaContainer: {
    marginTop: 18,
    marginBottom: 16,
    gap: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'flex-start',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  typeBadgeDark: {
    backgroundColor: '#1f2735',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f4f8f',
    letterSpacing: 0.3,
  },
  typeTextDark: {
    color: '#d7e3ff',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6c7a90',
    fontWeight: '600',
  },
  dateTextDark: {
    color: '#adb5bd',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2a3a',
    lineHeight: 32,
  },
  titleDark: {
    color: '#e9f0ff',
  },
  contentWrapper: {
    flex: 1,
  },
  contentCard: {
    borderRadius: 24,
    padding: 24,
    flex: 1,
    shadowColor: '#0c1b33',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  contentCardDark: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#1f2a3a',
  },
  bodyTextDark: {
    color: '#d7e3ff',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});