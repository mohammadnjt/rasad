import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';

export default function StatCard({ title, value, color = '#007BFF' }) {
  const { isDarkMode, language } = useStore();
  const isRTL = language === 'fa';

  return (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <Text style={[styles.value, isDarkMode && styles.valueDark]}>{value}</Text>
      <Text style={[styles.title, isDarkMode && styles.titleDark, isRTL && styles.rtl]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    position: 'relative',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  colorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  valueDark: {
    color: '#ffffff',
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
  titleDark: {
    color: '#999',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
