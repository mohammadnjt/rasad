import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  I18nManager
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { translations } from '../../constants/translations';
import Header from '../../components/Header';
import {
  User,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  ChevronDown,
  X,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react-native';

// Force RTL layout
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function SavedScreen() {
  const router = useRouter();
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [activeTab, setActiveTab] = useState('individual');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: '',
    ageRange: '',
    status: 'all'
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  // Test Data - Individual Reports
  const individualReports = [
    {
      id: '1',
      name: 'احمد محمدی',
      gender: 'مرد',
      age: 35,
      occupation: 'پزشک',
      workplace: 'بیمارستان امام خمینی',
      nationalId: '0123456789',
      symptoms: ['تب', 'سرفه', 'تنگی نفس'],
      severity: 7,
      city: 'تهران',
      district: 'منطقه 1',
      date: '1403/07/20',
      status: 'active',
      nationality: 'ایرانی'
    },
    {
      id: '2',
      name: 'فاطمه رضایی',
      gender: 'زن',
      age: 28,
      occupation: 'پرستار',
      workplace: 'بیمارستان مدرس',
      nationalId: '9876543210',
      symptoms: ['سردرد', 'خستگی', 'از دست دادن بو و مزه'],
      severity: 5,
      city: 'تهران',
      district: 'منطقه 3',
      date: '1403/07/19',
      status: 'recovered',
      nationality: 'ایرانی'
    },
    {
      id: '3',
      name: 'علی احمدی',
      gender: 'مرد',
      age: 42,
      occupation: 'معلم',
      workplace: 'دبیرستان شهید بهشتی',
      nationalId: '5647382910',
      symptoms: ['تب', 'درد بدن', 'گلو درد'],
      severity: 6,
      city: 'مشهد',
      district: 'منطقه 2',
      date: '1403/07/18',
      status: 'active',
      nationality: 'ایرانی'
    },
    {
      id: '4',
      name: 'مریم کریمی',
      gender: 'زن',
      age: 31,
      occupation: 'داروساز',
      workplace: 'داروخانه سپهر',
      nationalId: '1928374650',
      symptoms: ['حالت تهوع', 'اسهال', 'خستگی'],
      severity: 4,
      city: 'اصفهان',
      district: 'منطقه 5',
      date: '1403/07/17',
      status: 'monitoring',
      nationality: 'ایرانی'
    },
  ];

  // Test Data - Group Reports
  const groupReports = [
    {
      id: '1',
      location: 'بیمارستان امام خمینی - تهران',
      center: 'مرکز',
      gender: 'ترکیبی',
      ageGroups: ['20-29', '30-39', '40-49'],
      totalCases: 15,
      date: '1403/07/20',
      nationality: 'ایرانی',
      status: 'active'
    },
    {
      id: '2',
      location: 'دانشگاه تهران - دانشکده پزشکی',
      center: 'دانشگاه',
      gender: 'ترکیبی',
      ageGroups: ['15-19', '20-29'],
      totalCases: 8,
      date: '1403/07/19',
      nationality: 'ایرانی',
      status: 'monitoring'
    },
    {
      id: '3',
      location: 'شرکت پارس خودرو - کارخانه تهران',
      center: 'صنعتی',
      gender: 'مرد',
      ageGroups: ['30-39', '40-49', '50-59'],
      totalCases: 12,
      date: '1403/07/18',
      nationality: 'ایرانی',
      status: 'active'
    },
  ];

  const tabs = [
    { id: 'individual', label: 'فردی', icon: User },
    { id: 'group', label: 'گروهی', icon: Users }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#DC3545';
      case 'recovered':
        return '#28A745';
      case 'monitoring':
        return '#FFC107';
      default:
        return '#6C757D';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'recovered':
        return 'بهبود یافته';
      case 'monitoring':
        return 'تحت نظر';
      default:
        return 'نامشخص';
    }
  };

  const renderIndividualReport = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          })
        }]
      }}
    >
      <TouchableOpacity
        style={[styles.reportCard, isDarkMode && styles.reportCardDark]}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderLeft}>
            <View style={[styles.avatarContainer, { backgroundColor: item.gender === 'مرد' ? '#667eea' : '#f093fb' }]}>
              <User size={24} color="#fff" strokeWidth={2.5} />
            </View>
            <View style={styles.reportHeaderInfo}>
              <Text style={[styles.reportName, isDarkMode && styles.textDark, styles.rtlText]}>
                {item.name}
              </Text>
              <Text style={[styles.reportMeta, isDarkMode && styles.metaDark, styles.rtlText]}>
                {item.gender} • {item.age} ساله
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }, styles.rtlText]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        {/* Occupation */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, styles.rtlRow]}>
            <Text style={[styles.infoValue, isDarkMode && styles.textDark, styles.rtlText]}>{item.occupation}</Text>
            <Text style={[styles.infoLabel, isDarkMode && styles.metaDark, styles.rtlText]}>شغل:</Text>
            <Activity size={16} color="#667eea" />
          </View>
        </View>

        {/* Workplace */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, styles.rtlRow]}>
            <Text style={[styles.infoValue, isDarkMode && styles.textDark, styles.rtlText]}>{item.workplace}</Text>
            <Text style={[styles.infoLabel, isDarkMode && styles.metaDark, styles.rtlText]}>محل خدمت:</Text>
            <MapPin size={16} color="#667eea" />
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, styles.rtlRow]}>
            <Text style={[styles.infoValue, isDarkMode && styles.textDark, styles.rtlText]}>
              {item.city} - {item.district}
            </Text>
            <Text style={[styles.infoLabel, isDarkMode && styles.metaDark, styles.rtlText]}>شهر:</Text>
            <MapPin size={16} color="#667eea" />
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.symptomsContainer}>
          <Text style={[styles.symptomsTitle, isDarkMode && styles.metaDark, styles.rtlText]}>علائم:</Text>
          <View style={[styles.symptomsGrid, styles.rtlRow]}>
            {item.symptoms.map((symptom, idx) => (
              <View key={idx} style={styles.symptomTag}>
                <Text style={[styles.symptomText, styles.rtlText]}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.severityContainer}>
          <Text style={[styles.severityLabel, isDarkMode && styles.metaDark, styles.rtlText]}>
            شدت علائم: {item.severity}/10
          </Text>
          <View style={styles.severityBar}>
            <View
              style={[
                styles.severityFill,
                {
                  width: `${item.severity * 10}%`,
                  backgroundColor: item.severity >= 7 ? '#DC3545' : item.severity >= 4 ? '#FFC107' : '#28A745'
                }
              ]}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.reportFooter, styles.rtlRow]}>
          <View style={[styles.footerItem, styles.rtlRow]}>
            <Text style={[styles.footerText, isDarkMode && styles.metaDark, styles.rtlText]}>کد ملی: {item.nationalId}</Text>
            <FileText size={14} color={isDarkMode ? '#999' : '#666'} />
          </View>
          <View style={[styles.footerItem, styles.rtlRow]}>
            <Text style={[styles.footerText, isDarkMode && styles.metaDark, styles.rtlText]}>{item.date}</Text>
            <Calendar size={14} color={isDarkMode ? '#999' : '#666'} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGroupReport = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          })
        }]
      }}
    >
      <TouchableOpacity
        style={[styles.reportCard, isDarkMode && styles.reportCardDark]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.05)']}
          style={styles.groupCardGradient}
        >
          {/* Header */}
          <View style={[styles.groupHeader, styles.rtlRow]}>
            <View style={styles.groupHeaderInfo}>
              <Text style={[styles.groupTitle, isDarkMode && styles.textDark, styles.rtlText]}>
                {item.location}
              </Text>
              <View style={[styles.groupMetaRow, styles.rtlRow]}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }, styles.rtlText]}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
                <View style={[styles.groupMetaItem, styles.rtlRow]}>
                  <Text style={[styles.groupMetaText, isDarkMode && styles.metaDark, styles.rtlText]}>
                    {item.totalCases} مورد
                  </Text>
                  <Users size={14} color="#667eea" />
                </View>
              </View>
            </View>
            <View style={styles.groupIconContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.groupIconGradient}
              >
                <Users size={24} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
            </View>
          </View>

          {/* Info */}
          <View style={styles.groupInfoContainer}>
            <View style={[styles.groupInfoRow, styles.rtlRow]}>
              <Text style={[styles.groupInfoValue, isDarkMode && styles.textDark, styles.rtlText]}>{item.center}</Text>
              <Text style={[styles.groupInfoLabel, isDarkMode && styles.metaDark, styles.rtlText]}>مرکز:</Text>
            </View>
            <View style={[styles.groupInfoRow, styles.rtlRow]}>
              <Text style={[styles.groupInfoValue, isDarkMode && styles.textDark, styles.rtlText]}>{item.gender}</Text>
              <Text style={[styles.groupInfoLabel, isDarkMode && styles.metaDark, styles.rtlText]}>جنسیت:</Text>
            </View>
          </View>

          {/* Age Groups */}
          <View style={styles.ageGroupsContainer}>
            <Text style={[styles.ageGroupsTitle, isDarkMode && styles.metaDark, styles.rtlText]}>محدوده سنی:</Text>
            <View style={[styles.ageGroupsGrid, styles.rtlRow]}>
              {item.ageGroups.map((age, idx) => (
                <View key={idx} style={styles.ageGroupTag}>
                  <Text style={[styles.ageGroupText, styles.rtlText]}>{age}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.groupFooter, styles.rtlRow]}>
            <View style={[styles.footerItem, styles.rtlRow]}>
              <Text style={[styles.footerText, isDarkMode && styles.metaDark, styles.rtlText]}>{item.nationality}</Text>
              <MapPin size={14} color={isDarkMode ? '#999' : '#666'} />
            </View>
            <View style={[styles.footerItem, styles.rtlRow]}>
              <Text style={[styles.footerText, isDarkMode && styles.metaDark, styles.rtlText]}>{item.date}</Text>
              <Calendar size={14} color={isDarkMode ? '#999' : '#666'} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />

      {/* Stats Cards */}
      <View style={[styles.statsContainer, styles.rtlRow]}>
        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statCardGradient}
          >
            <TrendingUp size={24} color="#fff" />
            <Text style={[styles.statValue, styles.rtlText]}>{individualReports.length + groupReports.length}</Text>
            <Text style={[styles.statLabel, styles.rtlText]}>کل گزارش‌ها</Text>
          </LinearGradient>
        </View>

        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <LinearGradient
            colors={['#DC3545', '#C82333']}
            style={styles.statCardGradient}
          >
            <AlertCircle size={24} color="#fff" />
            <Text style={[styles.statValue, styles.rtlText]}>
              {individualReports.filter(r => r.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, styles.rtlText]}>موارد فعال</Text>
          </LinearGradient>
        </View>

        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <LinearGradient
            colors={['#28A745', '#218838']}
            style={styles.statCardGradient}
          >
            <CheckCircle size={24} color="#fff" />
            <Text style={[styles.statValue, styles.rtlText]}>
              {individualReports.filter(r => r.status === 'recovered').length}
            </Text>
            <Text style={[styles.statLabel, styles.rtlText]}>بهبود یافته</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, isDarkMode && styles.tabsContainerDark, styles.rtlRow]}>
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.tabGradient}
                >
                  <Text style={[styles.tabTextActive, styles.rtlText]}>{tab.label}</Text>
                  <TabIcon size={20} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
              ) : (
                <>
                  <Text style={[styles.tabText, isDarkMode && styles.tabTextDark, styles.rtlText]}>
                    {tab.label}
                  </Text>
                  <TabIcon size={20} color={isDarkMode ? '#666' : '#999'} />
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={[styles.filterButton, isDarkMode && styles.filterButtonDark, styles.rtlRow]}
        onPress={() => setFilterModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.filterButtonText, isDarkMode && styles.textDark, styles.rtlText]}>فیلتر گزارش‌ها</Text>
        <Filter size={18} color="#667eea" />
      </TouchableOpacity>

      {/* Reports List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reportsContainer}>
          {activeTab === 'individual' ? (
            <FlatList
              data={individualReports}
              renderItem={renderIndividualReport}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <FlatList
              data={groupReports}
              renderItem={renderGroupReport}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Report Button */}
      <TouchableOpacity
        style={[styles.fab, { right: 24, left: undefined }]} // Changed to right for RTL
        onPress={() => router.push('/covid-symptoms')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.fabGradient}
        >
          <Text style={[styles.fabText, styles.rtlText]}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
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

  // RTL Styles
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row-reverse',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardDark: {
    shadowOpacity: 0.3,
  },
  statCardGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabsContainerDark: {
    backgroundColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 6,
  },
  tabActive: {
    overflow: 'hidden',
  },
  tabGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  tabTextDark: {
    color: '#666',
  },
  tabTextActive: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },

  // Filter Button
  filterButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },

  // Content
  content: {
    flex: 1,
  },
  reportsContainer: {
    padding: 16,
    marginBottom: 100,
  },

  // Report Card
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  reportCardDark: {
    backgroundColor: '#1a1a1a',
  },

  // Individual Report
  reportHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportHeaderLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportHeaderInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 13,
    color: '#666',
  },
  metaDark: {
    color: '#999',
  },
  textDark: {
    color: '#e0e0e0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },

  symptomsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  symptomsTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  symptomsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  severityContainer: {
    marginBottom: 12,
  },
  severityLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  severityBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    borderRadius: 4,
  },

  reportFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
  },

  // Group Report
  groupCardGradient: {
    borderRadius: 20,
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  groupIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  groupIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupHeaderInfo: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  groupMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupMetaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  groupMetaText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },

  groupInfoContainer: {
    marginBottom: 12,
    gap: 8,
  },
  groupInfoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  groupInfoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    width: 80,
  },
  groupInfoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },

  ageGroupsContainer: {
    marginBottom: 12,
  },
  ageGroupsTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  ageGroupsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageGroupTag: {
    backgroundColor: '#f093fb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ageGroupText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  groupFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -4,
  },
});


