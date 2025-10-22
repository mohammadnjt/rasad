import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Mail, Phone, MapPin, Send } from 'lucide-react-native';

export default function ContactScreen() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const contactInfo = {
    email: 'info@rasad.feham.ir',
    phone: '+98 21 1234 5678',
    address: language === 'fa'
      ? 'تهران، خیابان ولیعصر، پلاک ۱۲۳'
      : 'Tehran, Valiasr Street, No. 123',
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!formData.subject.trim()) newErrors.subject = t.required;
    if (!formData.message.trim()) newErrors.message = t.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        t.success || 'Success',
        language === 'fa'
          ? 'پیام شما با موفقیت ارسال شد'
          : 'Your message has been sent successfully',
        [{ text: 'OK', onPress: resetForm }]
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setErrors({});
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.contactUs}
          </Text>

          <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`mailto:${contactInfo.email}`)}
            >
              <Mail size={20} color="#007BFF" />
              <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                {contactInfo.email}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${contactInfo.phone.replace(/\s/g, '')}`)}
            >
              <Phone size={20} color="#28A745" />
              <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                {contactInfo.phone}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <MapPin size={20} color="#DC3545" />
              <Text style={[styles.infoText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {contactInfo.address}
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <CustomInput
              label={t.name}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              error={errors.name}
            />

            <CustomInput
              label={t.email}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              error={errors.email}
            />

            <CustomInput
              label={t.phone}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />

            <CustomInput
              label={t.subject}
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
              error={errors.subject}
            />

            <CustomInput
              label={t.message}
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
              multiline
              error={errors.message}
            />

            <CustomButton
              title={t.send}
              onPress={handleSubmit}
              variant="success"
              style={styles.submitButton}
            />
          </View>
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardDark: {
    backgroundColor: '#2a2a2a',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    marginTop: 8,
  },
});
