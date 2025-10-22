import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal
} from 'react-native';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import { mockNews } from '../constants/mockData';
import Header from '../components/Header';
import { Calendar, CircleAlert as AlertCircle, X, ChevronRight } from 'lucide-react-native';

export default function NewsScreen() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [refreshing, setRefreshing] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'گزارش رسمی':
      case 'Official Report':
        return '#007BFF';
      case 'هشدار':
      case 'Alert':
        return '#DC3545';
      case 'پیشگیری':
      case 'Prevention':
        return '#28A745';
      default:
        return '#6c757d';
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.newsCard, isDarkMode && styles.newsCardDark]}
      onPress={() => {
        setSelectedNews(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
        <AlertCircle size={14} color="#ffffff" />
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <Text style={[styles.newsTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
        {item.title}
      </Text>

      <Text style={[styles.newsExcerpt, isDarkMode && styles.newsExcerptDark, isRTL && styles.rtl]}>
        {item.excerpt}
      </Text>

      <View style={styles.newsFooter}>
        <View style={styles.newsInfo}>
          <Calendar size={14} color={isDarkMode ? '#999' : '#666'} />
          <Text style={[styles.newsDate, isDarkMode && styles.newsDateDark]}>
            {item.date}
          </Text>
          <Text style={[styles.newsSource, isDarkMode && styles.newsSourceDark]}>
            • {item.source}
          </Text>
        </View>
        <ChevronRight size={20} color="#007BFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />

      <FlatList
        data={mockNews}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007BFF"
            colors={['#007BFF']}
          />
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(selectedNews?.category), marginBottom: 12 }
                ]}>
                  <AlertCircle size={14} color="#ffffff" />
                  <Text style={styles.categoryText}>{selectedNews?.category}</Text>
                </View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {selectedNews?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginLeft: 12 }}>
                <X size={24} color={isDarkMode ? '#e0e0e0' : '#333'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalMeta}>
              <Calendar size={14} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.modalDate, isDarkMode && styles.textDark]}>
                {selectedNews?.date}
              </Text>
              <Text style={[styles.modalSource, isDarkMode && styles.textDark]}>
                • {selectedNews?.source}
              </Text>
            </View>

            <Text style={[styles.modalText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
              {selectedNews?.excerpt}
            </Text>
            <Text style={[styles.modalText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
              {language === 'fa'
                ? 'در این گزارش جامع، تمامی جوانب موضوع بررسی شده و توصیه‌های لازم برای پیشگیری و مدیریت تهدیدات زیستی ارائه شده است. همچنین اقدامات پیشنهادی برای افزایش آمادگی سازمان‌ها و افراد در مواجهه با این تهدیدات مورد بحث قرار گرفته است.'
                : 'This comprehensive report examines all aspects of the issue and provides necessary recommendations for preventing and managing biological threats. Additionally, suggested measures for increasing preparedness of organizations and individuals in facing these threats have been discussed.'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  listContainer: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsCardDark: {
    backgroundColor: '#2a2a2a',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  newsExcerptDark: {
    color: '#999',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
  },
  newsDateDark: {
    color: '#999',
  },
  newsSource: {
    fontSize: 12,
    color: '#666',
  },
  newsSourceDark: {
    color: '#999',
  },
  textDark: {
    color: '#e0e0e0',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalDate: {
    fontSize: 12,
    color: '#666',
  },
  modalSource: {
    fontSize: 12,
    color: '#666',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
});
