import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking
} from 'react-native';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import { mockEducationItems } from '../constants/mockData';
import Header from '../components/Header';
import { BookOpen, Video, Clock, X, ChevronRight } from 'lucide-react-native';

export default function EducationScreen() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const articles = mockEducationItems.filter(item => item.type === 'article');
  const videos = mockEducationItems.filter(item => item.type === 'video');

  const openVideo = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const renderArticleCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardIcon}>
        <BookOpen size={24} color="#007BFF" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
          {item.title}
        </Text>
        <Text style={[styles.cardExcerpt, isDarkMode && styles.cardExcerptDark, isRTL && styles.rtl]}>
          {item.excerpt}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.durationContainer}>
            <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
            <Text style={[styles.duration, isDarkMode && styles.durationDark]}>
              {item.duration}
            </Text>
          </View>
          <ChevronRight size={20} color="#007BFF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVideoCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={() => openVideo(item.url)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardIcon, styles.videoIcon]}>
        <Video size={24} color="#DC3545" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
          {item.title}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.durationContainer}>
            <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
            <Text style={[styles.duration, isDarkMode && styles.durationDark]}>
              {item.duration}
            </Text>
          </View>
          <ChevronRight size={20} color="#007BFF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.articles}
          </Text>
          {articles.map(renderArticleCard)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.videos}
          </Text>
          {videos.map(renderVideoCard)}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {selectedItem?.title}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDarkMode ? '#e0e0e0' : '#333'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {selectedItem?.content}
              </Text>
            </ScrollView>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoIcon: {
    backgroundColor: '#FFEBEE',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardExcerptDark: {
    color: '#999',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  durationDark: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  modalBody: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
