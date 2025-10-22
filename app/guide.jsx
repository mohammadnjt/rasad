import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useStore } from '../store/useStore';
import { translations } from '../constants/translations';
import Header from '../components/Header';
import { BookOpen, Circle as HelpCircle, Download, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function GuideScreen() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const guideContent = {
    howToUse: {
      title: language === 'fa' ? 'نحوه استفاده' : 'How to Use',
      items: [
        {
          title: language === 'fa' ? 'گزارش علائم' : 'Report Symptoms',
          description: language === 'fa'
            ? 'برای گزارش علائم خود، به بخش "علایم شبه کرونا" بروید و فرم را تکمیل کنید.'
            : 'To report symptoms, go to "COVID-like Symptoms" section and fill out the form.'
        },
        {
          title: language === 'fa' ? 'آپلود رسانه' : 'Upload Media',
          description: language === 'fa'
            ? 'می‌توانید عکس و ویدیوهای مرتبط با تهدیدات زیستی را در بخش "عکس و فیلم" آپلود کنید.'
            : 'You can upload photos and videos related to biological threats in the "Photos and Videos" section.'
        },
        {
          title: language === 'fa' ? 'مشاهده اخبار' : 'View News',
          description: language === 'fa'
            ? 'از بخش "اخبار" می‌توانید آخرین اطلاعات درباره تهدیدات زیستی را مشاهده کنید.'
            : 'From the "News" section, you can view the latest information about biological threats.'
        },
        {
          title: language === 'fa' ? 'آموزش' : 'Education',
          description: language === 'fa'
            ? 'در بخش "آموزش" مقالات و ویدیوهای آموزشی مفیدی در دسترس است.'
            : 'In the "Education" section, useful articles and educational videos are available.'
        },
      ]
    },
    faqs: {
      title: language === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions',
      items: [
        {
          question: language === 'fa'
            ? 'آیا اطلاعات من محفوظ است؟'
            : 'Is my information secure?',
          answer: language === 'fa'
            ? 'بله، تمام اطلاعات شما به صورت رمزگذاری شده ذخیره می‌شود و محفوظ است.'
            : 'Yes, all your information is stored encrypted and is secure.'
        },
        {
          question: language === 'fa'
            ? 'چگونه می‌توانم گزارش خود را حذف کنم؟'
            : 'How can I delete my report?',
          answer: language === 'fa'
            ? 'در بخش "ذخیره شده" می‌توانید گزارش‌های خود را مشاهده و حذف کنید.'
            : 'In the "Saved" section, you can view and delete your reports.'
        },
        {
          question: language === 'fa'
            ? 'چه زمانی به گزارش من پاسخ داده می‌شود؟'
            : 'When will my report be reviewed?',
          answer: language === 'fa'
            ? 'تیم ما تلاش می‌کند تا ظرف ۲۴-۴۸ ساعت به گزارش‌های ارسالی پاسخ دهد.'
            : 'Our team strives to review submitted reports within 24-48 hours.'
        },
        {
          question: language === 'fa'
            ? 'آیا می‌توانم بدون ثبت‌نام استفاده کنم؟'
            : 'Can I use without registration?',
          answer: language === 'fa'
            ? 'بله، می‌توانید بیشتر قابلیت‌ها را بدون ثبت‌نام استفاده کنید، اما برای ذخیره گزارش‌ها نیاز به ورود دارید.'
            : 'Yes, you can use most features without registration, but you need to login to save reports.'
        },
      ]
    },
    installation: {
      title: language === 'fa' ? 'نصب برنامه' : 'Install Application',
      description: language === 'fa'
        ? 'برای نصب نسخه اندروید برنامه، روی دکمه زیر کلیک کنید و فایل APK را دانلود کنید.'
        : 'To install the Android version of the app, click the button below and download the APK file.',
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.mainTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
            {t.guide}
          </Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <BookOpen size={24} color="#007BFF" />
              <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {guideContent.howToUse.title}
              </Text>
            </View>

            {guideContent.howToUse.items.map((item, index) => (
              <View key={index} style={styles.guideItem}>
                <CheckCircle size={20} color="#28A745" />
                <View style={styles.guideItemContent}>
                  <Text style={[styles.guideItemTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.guideItemText, isDarkMode && styles.guideItemTextDark, isRTL && styles.rtl]}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <HelpCircle size={24} color="#FFC107" />
              <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {guideContent.faqs.title}
              </Text>
            </View>

            {guideContent.faqs.items.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <AlertCircle size={18} color="#007BFF" />
                  <Text style={[styles.faqQuestionText, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                    {item.question}
                  </Text>
                </View>
                <Text style={[styles.faqAnswer, isDarkMode && styles.faqAnswerDark, isRTL && styles.rtl]}>
                  {item.answer}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Download size={24} color="#28A745" />
              <Text style={[styles.cardTitle, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
                {guideContent.installation.title}
              </Text>
            </View>

            <Text style={[styles.installDescription, isDarkMode && styles.textDark, isRTL && styles.rtl]}>
              {guideContent.installation.description}
            </Text>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                // Mock download link
                Linking.openURL('https://example.com/app.apk').catch(() => {});
              }}
            >
              <Download size={20} color="#ffffff" />
              <Text style={styles.downloadButtonText}>
                {language === 'fa' ? 'دانلود APK' : 'Download APK'}
              </Text>
            </TouchableOpacity>
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
  mainTitle: {
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  guideItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  guideItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  guideItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  guideItemText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  guideItemTextDark: {
    color: '#999',
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 26,
  },
  faqAnswerDark: {
    color: '#999',
  },
  installDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
