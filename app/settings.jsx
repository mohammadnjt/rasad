import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import {
  Globe,
  Bell,
  Moon,
  Shield,
  LogOut,
  Info,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    language,
    isDarkMode,
    isLoggedIn,
    setLanguage,
    toggleDarkMode,
    logout
  } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      language === 'fa' ? 'آیا مطمئن هستید؟' : 'Are you sure?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const toggleLanguage = async () => {
    const newLang = language === 'fa' ? 'en' : 'fa';
    await setLanguage(newLang);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.settings}
          </Text>

          <View style={[styles.settingCard, isDarkMode && styles.settingCardDark]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Globe size={24} color="#007BFF" />
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.language}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={toggleLanguage}
              >
                <Text style={[styles.languageText, isRTL && styles.rtl]}>
                  {language === 'fa' ? 'فارسی / English' : 'English / فارسی'}
                </Text>
                <ChevronRight size={20} color={isDarkMode ? '#999' : '#666'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Bell size={24} color="#28A745" />
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.notifications}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#007BFF' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Moon size={24} color="#6c757d" />
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.darkMode}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: '#007BFF' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={() => Alert.alert(
                t.privacyPolicy,
                language === 'fa'
                  ? 'سیاست حریم خصوصی ما اطلاعات شما را محافظت می‌کند...'
                  : 'Our privacy policy protects your information...'
              )}
            >
              <View style={styles.settingInfo}>
                <Shield size={24} color="#FFC107" />
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.privacyPolicy}
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#999' : '#666'} />
            </TouchableOpacity>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Info size={24} color="#17A2B8" />
                <Text style={[styles.settingLabel, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                  {t.appVersion}
                </Text>
              </View>
              <Text style={[styles.versionText, isDarkMode && styles.textDark]}>
                1.1.0
              </Text>
            </View>
          </View>

          {isLoggedIn && (
            <CustomButton
              title={t.logout}
              onPress={handleLogout}
              variant="danger"
              style={styles.logoutButton}
            />
          )}
        </View>
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
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  textDark: {
    color: '#e0e0e0',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingCardDark: {
    backgroundColor: '#2a2a2a',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#007BFF',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    marginTop: 20,
  },
});
