import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useStore } from '../store/useStore';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style
}) {
  const { isDarkMode } = useStore();

  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;
    switch (variant) {
      case 'success':
        return styles.buttonSuccess;
      case 'danger':
        return styles.buttonDanger;
      case 'secondary':
        return isDarkMode ? styles.buttonSecondaryDark : styles.buttonSecondary;
      default:
        return styles.buttonPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: '#007BFF',
  },
  buttonSuccess: {
    backgroundColor: '#28A745',
  },
  buttonDanger: {
    backgroundColor: '#DC3545',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonSecondaryDark: {
    backgroundColor: '#495057',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
