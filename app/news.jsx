import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
  LayoutAnimation,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Bell, AlertTriangle, Shield, X, ChevronRight } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import Header from '../components/Header';
import { api } from '../hooks/api';
import { useRouter } from 'expo-router';

export default function NewsScreen() {
  const { language, isDarkMode, user } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 10,
        tension: 45,
        useNativeDriver: true
      })
    ]).start();
  }, [forms]);

  const fetchForms = async () => {
    try {
      const finger = user?.finger || '';
      const now = Date.now();
      const response = await api.news(finger, now);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setForms(
        (response || []).map(item => ({
          ...item,
          readableDate: formatUnixTime(item.time),
          plainBody: stripHtml(item.body),
        }))
      );
    } catch (error) {
      console.log('Error fetching forms', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchForms();
    setRefreshing(false);
  };

  const stripHtml = (html) =>
    html ? html.replace(/<\/?[^>]+(>|$)/g, '').trim() : '';

  const formatUnixTime = (unix) => {
    if (!unix) return '';
    const date = new Date(parseInt(unix, 10) * 1000);
    return date.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryMeta = (type) => {
    const trimmed = type?.trim();
    if (!trimmed) {
      return {
        label: language === 'fa' ? 'پیام عمومی' : 'General message',
        icon: Bell,
        gradient: isDarkMode
          ? ['#1f2a3a', '#192330']
          : ['#eef4ff', '#dbe5ff'],
        textColor: isDarkMode ? '#e9f0ff' : '#1f2a3a',
        badgeColor: isDarkMode ? '#3b4a63' : '#cfd9ec',
      };
    }

    const mapping = [
      {
        match: ['سلامت', 'health'],
        icon: Shield,
        gradient: isDarkMode
          ? ['#1f2a3a', '#1a2332']
          : ['#eef4ff', '#e1eeff'],
        textColor: isDarkMode ? '#d7e3ff' : '#1f2a3a',
        badgeColor: '#4A90E2'
      },
      {
        match: ['هشدار', 'alert'],
        icon: AlertTriangle,
        gradient: isDarkMode
          ? ['#331f23', '#29171a']
          : ['#ffe3e0', '#ffd1d2'],
        textColor: isDarkMode ? '#ffc5c8' : '#7d2633',
        badgeColor: '#DC3545'
      },
    ];

    const hit =
      mapping.find(entry =>
        entry.match.some(keyword =>
          trimmed.toLowerCase().includes(keyword.toLowerCase())
        )
      ) ||
      {
        icon: Shield,
        gradient: isDarkMode
          ? ['#222734', '#1b1f29']
          : ['#f1f4f9', '#e6eaef'],
        textColor: isDarkMode ? '#d7e3ff' : '#1f2a3a',
        badgeColor: isDarkMode ? '#3b4a63' : '#cfd9ec',
      };

    return {
      label: trimmed,
      ...hit
    };
  };

  const renderItem = ({ item, index }) => {
    const meta = categoryMeta(item.type);
    const enabled = item.type?.trim();

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (enabled) {
              router.push({
                pathname: '/public-health',
                params: {
                  id: item.idn,
                  title: item.title,
                  type: item.type,
                  time: item.readableDate,
                  body: item.body,
                  plain: item.plainBody
                }
              });
              return;
            }

            setSelectedItem(item);
            setModalVisible(true);
          }}
        >
          <LinearGradient
            colors={meta.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.newsCard,
              isDarkMode && styles.newsCardDark,
            ]}
          >
            <View style={[
              styles.categoryBadge,
              { backgroundColor: meta.badgeColor }
            ]}>
              <meta.icon size={16} color="#fff" />
              <Text style={styles.categoryText}>
                {meta.label}
              </Text>
            </View>

            <Text
              style={[
                styles.newsTitle,
                { color: meta.textColor },
                isRTL && styles.rtlText
              ]}
            >
              {item.title}
            </Text>

            {item.plainBody ? (
              <Text
                style={[
                  styles.newsExcerpt,
                  isDarkMode && styles.newsExcerptDark,
                  isRTL && styles.rtlText
                ]}
                numberOfLines={3}
              >
                {item.plainBody}
              </Text>
            ) : (
              <Text
                style={[
                  styles.newsExcerptMuted,
                  isDarkMode && styles.newsExcerptMutedDark,
                  isRTL && styles.rtlText
                ]}
              >
                {language === 'fa'
                  ? 'بدون توضیحات تکمیلی'
                  : 'No additional description'}
              </Text>
            )}

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Calendar size={14} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
                <Text
                  style={[
                    styles.newsDate,
                    isDarkMode && styles.newsDateDark
                  ]}
                >
                  {item.readableDate}
                </Text>
              </View>

              {enabled ? (
                <View style={styles.cta}>
                  <Text style={styles.ctaText}>
                    {language === 'fa' ? 'نمایش کامل' : 'View details'}
                  </Text>
                  <ChevronRight size={18} color="#4A90E2" />
                </View>
              ) : (
                <Text
                  style={[
                    styles.infoTag,
                    isDarkMode && styles.infoTagDark
                  ]}
                >
                  {language === 'fa'
                    ? 'در همین صفحه قابل مشاهده است'
                    : 'Displayed inline'}
                </Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1d29', '#11151d'] : ['#f0f4f9', '#e8edf4']}
        style={styles.emptyCard}
      >
        <Bell size={32} color={isDarkMode ? '#d7e3ff' : '#4A90E2'} />
        <Text style={[
          styles.emptyTitle,
          isDarkMode && styles.textDark
        ]}>
          {language === 'fa'
            ? 'پیامی برای نمایش وجود ندارد'
            : 'No announcements yet'}
        </Text>
        <Text style={[
          styles.emptySubtitle,
          isDarkMode && styles.emptySubtitleDark,
          isRTL && styles.rtlText
        ]}>
          {language === 'fa'
            ? 'به‌محض ارسال پیام جدید، در همین صفحه نمایش داده می‌شود.'
            : 'As soon as new messages arrive, they will appear here.'}
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />

      <FlatList
        data={forms}
        renderItem={renderItem}
        keyExtractor={(item) => item.idn}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90E2"
            colors={['#4A90E2']}
          />
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isDarkMode && styles.modalContentDark
          ]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={[
                  styles.modalBadge,
                  { backgroundColor: '#4A90E2' }
                ]}>
                  <Bell size={16} color="#fff" />
                  <Text style={styles.modalBadgeText}>
                    {language === 'fa' ? 'پیام عمومی' : 'General message'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    isDarkMode && styles.textDark,
                    isRTL && styles.rtlText
                  ]}
                >
                  {selectedItem?.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color={isDarkMode ? '#e3e9f6' : '#1f2a3a'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalMeta}>
              <Calendar size={14} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
              <Text
                style={[
                  styles.modalDate,
                  isDarkMode && styles.textDark
                ]}
              >
                {selectedItem?.readableDate}
              </Text>
            </View>

            <Text
              style={[
                styles.modalText,
                isDarkMode && styles.textDark,
                isRTL && styles.rtlText
              ]}
            >
              {selectedItem?.plainBody ||
                (language === 'fa'
                  ? 'بدون توضیحات تکمیلی.'
                  : 'No further description provided.')}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f7' },
  containerDark: { backgroundColor: '#151822' },
  listContainer: { padding: 16, gap: 14 },
  newsCard: {
    borderRadius: 18,
    padding: 18,
    shadowColor: '#0c1b33',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 12,
  },
  newsCardDark: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  newsExcerpt: {
    fontSize: 13,
    color: '#3f506d',
    lineHeight: 20,
    marginBottom: 14,
  },
  newsExcerptDark: { color: '#c7d1eb' },
  newsExcerptMuted: {
    fontSize: 13,
    color: '#8c9ab4',
    marginBottom: 14,
    fontStyle: 'italic',
  },
  newsExcerptMutedDark: { color: '#95a3c1' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newsDate: {
    fontSize: 12,
    color: '#6c7a90',
    fontWeight: '600',
  },
  newsDateDark: {
    color: '#adb5bd',
  },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A90E2',
  },
  infoTag: {
    fontSize: 11,
    color: '#6c7a90',
    fontWeight: '600',
  },
  infoTagDark: { color: '#9aa6c2' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 25, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '45%',
  },
  modalContentDark: {
    backgroundColor: '#1f2735',
  },
  modalHeader: { flexDirection: 'row', marginBottom: 16 },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  modalBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2a3a',
    lineHeight: 28,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(74,144,226,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74,144,226,0.12)',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3f506d',
  },
  modalText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1f2a3a',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    width: '85%',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2a3a',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#53617f',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptySubtitleDark: {
    color: '#9aa6c2',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});