import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  error,
  style,
}) {
  const { isDarkMode, language } = useStore();
  const isRTL = language === 'fa';

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark, isRTL && styles.rtl]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.inputDark,
          multiline && styles.inputMultiline,
          error && styles.inputError,
          isRTL && styles.rtl,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#999' : '#666'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlign={isRTL ? 'right' : 'left'}
      />
      {error && (
        <Text style={[styles.errorText, isRTL && styles.rtl]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  labelDark: {
    color: '#e0e0e0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#e0e0e0',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: 4,
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
