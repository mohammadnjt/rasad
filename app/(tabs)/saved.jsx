import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../../store/useStore';
import { translations } from '../../constants/translations';
import Header from '../../components/Header';
import { Trash2, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SavedScreen() {
  const router = useRouter();
  const { language, isDarkMode, reports, savedReports, deleteReport, unsaveReport } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const savedItems = reports.filter(report => savedReports.includes(report.id));

  const handleDelete = (reportId) => {
    Alert.alert(
      t.delete || 'Delete',
      t.confirmDelete || 'Are you sure you want to delete this report?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: () => {
            deleteReport(reportId);
            unsaveReport(reportId);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
          {item.name}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => router.push(`/report-detail?id=${item.id}`)}
            style={styles.iconButton}
          >
            <Eye size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.iconButton}
          >
            <Trash2 size={20} color="#DC3545" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.cardDate, isDarkMode && styles.cardDateDark, isRTL && styles.rtl]}>
        {new Date(item.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
      </Text>
      <Text style={[styles.cardInfo, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
        {t.city}: {item.city}
      </Text>
      <Text style={[styles.cardInfo, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
        {t.severity}: {item.severity}/10
      </Text>
      <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
        <Text style={styles.statusText}>
          {item.status === 'pending' ? (language === 'fa' ? 'در انتظار' : 'Pending') :
           item.status === 'reviewed' ? (language === 'fa' ? 'بررسی شده' : 'Reviewed') :
           (language === 'fa' ? 'بسته شده' : 'Closed')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      {savedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.noSavedItems}
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  card: {
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
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardDateDark: {
    color: '#999',
  },
  cardInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  textDark: {
    color: '#e0e0e0',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statuspending: {
    backgroundColor: '#FFC107',
  },
  statusreviewed: {
    backgroundColor: '#007BFF',
  },
  statusclosed: {
    backgroundColor: '#28A745',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
