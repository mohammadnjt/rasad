// cloude UI
import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform,
  Animated,
  Modal,
  I18nManager
} from 'react-native';
import { useStore } from '../../store/useStore';
import { translations } from '../../constants/translations';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import { 
  SquareCheck as CheckSquare, 
  Square,
  Upload,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  User,
  Briefcase,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Users,
  Heart,
  FileInput
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '../../components/Loading';
import { api } from '../../hooks/api';

export default function CovidSymptomsScreen() {
  const { user, language, isDarkMode, addReport } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [currentStep, setCurrentStep] = useState(0);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showCenterPicker, setShowCenterPicker] = useState(false);
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [pickerOptions, setPickerOptions] = useState([]);
  const [activePickerField, setActivePickerField] = useState(null);
  const [pickerTitle, setPickerTitle] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  console.log(user, 'm_forms api:::', user?.finger)
  // console.log('m_forms api:::', api.forms(user.finger, Date.now()))

  useEffect(() => {
    if(user?.finger){
      api.forms(user.finger, Date.now())
      .then((res) => setForms(res))
      .catch(() => setForms([]))
      .finally(() => setLoading(false))
    }
  }, [user])
  // const { data, isLoading } = useSWR(
  //   'm_forms',
  //   () => user?.finger ? api.forms(user.finger, Date.now()) : []
  // );

  console.log('loading', loading)
  console.log('m_forms', forms)
  console.log('currentStep', currentStep)

  // فرم اطلاعات فردی
  const [formData, setFormData] = useState({
    occupation: '',
    workplace: '',
    gender: '',
    age: '',
    nationality: 'ایرانی',
    nationalId: '',
    idCardPhoto: null,
    personalPhoto: null,
    name: '',
    phone: '',
    symptoms: [],
    onsetDate: '',
    city: '',
    address: '',
    severity: 5,
  });

  // فرم اطلاعات گروهی
  const [groupFormData, setGroupFormData] = useState({
    center: '',
    gender: '',
    ageRanges: [],
    nationality: 'iranian',
    letterFile: null,
    imageFile: null,
  });

  // فرم تست (فرم سوم)
  const [medicalFormData, setMedicalFormData] = useState({
    testName: '',
    testDate: '',
    testResult: '',
    doctorName: '',
  });

  const [errors, setErrors] = useState({});

  const centers = [
    { value: 'center1', label: 'مرکز بهداشت شماره 1' },
    { value: 'center2', label: 'مرکز بهداشت شماره 2' },
    { value: 'center3', label: 'مرکز بهداشت شماره 3' },
    { value: 'center4', label: 'مرکز بهداشت شماره 4' },
  ];

  const ageRanges = [
    { id: '0-4', label: '0-4' },
    { id: '5-14', label: '5-14' },
    { id: '15-19', label: '15-19' },
    { id: '20-29', label: '20-29' },
    { id: '30-39', label: '30-39' },
    { id: '40-49', label: '40-49' },
    { id: '50-59', label: '50-59' },
    { id: '60-69', label: '60-69' },
    { id: '70+', label: '70+' },
  ];

  const symptoms = [
    { id: 'fever', label: 'تب', icon: '🌡️' },
    { id: 'cough', label: 'سرفه', icon: '😷' },
    { id: 'shortnessOfBreath', label: 'تنگی نفس', icon: '😮‍💨' },
    { id: 'fatigue', label: 'خستگی', icon: '😴' },
    { id: 'lossOfTasteSmell', label: 'از دست دادن بو و مزه', icon: '👃' },
    { id: 'headache', label: 'سردرد', icon: '🤕' },
    { id: 'bodyAche', label: 'درد بدن', icon: '💪' },
    { id: 'soreThroat', label: 'گلو درد', icon: '🗣️' },
    { id: 'nausea', label: 'حالت تهوع', icon: '🤢' },
    { id: 'diarrhea', label: 'اسهال', icon: '🚽' },
  ];

  const genders = [
    { value: 'male', label: 'مرد', icon: '👨' },
    { value: 'female', label: 'زن', icon: '👩' },
    { value: 'other', label: 'سایر', icon: '⚧️' },
  ];

  const ages = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1)
  }));

  // Steps - این می‌تواند از سرور بیاید
  const steps = [
    {
      id: 0,
      title: 'مشخصات فردی',
      subtitle: 'اطلاعات شخصی',
      icon: User,
    },
    {
      id: 1,
      title: 'اطلاعات گروهی',
      subtitle: 'ثبت گروهی',
      icon: Users,
    },
    {
      id: 2,
      title: 'سوابق پزشکی',
      subtitle: 'آزمایشات و سوابق',
      icon: Heart,
    },
  ];

  useEffect(() => {
    animateSlide();
  }, [currentStep]);

  useEffect(() => {
    try {
      I18nManager.allowRTL(true);
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
    } catch (e) {
      // ignore
    }
  }, [isRTL]);

  const animateSlide = () => {
    slideAnim.setValue(300);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleSymptom = (symptomId) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(s => s !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const toggleAgeRange = (rangeId) => {
    setGroupFormData(prev => ({
      ...prev,
      ageRanges: prev.ageRanges.includes(rangeId)
        ? prev.ageRanges.filter(r => r !== rangeId)
        : [...prev.ageRanges, rangeId]
    }));
  };

  const pickDocument = async (type, isGroup = false) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        if (isGroup) {
          setGroupFormData(prev => ({ ...prev, [type]: result }));
        } else {
          setFormData(prev => ({ ...prev, [type]: result }));
        }
      }
    } catch (error) {
      Alert.alert('خطا', 'خطا در انتخاب فایل');
    }
  };

  const pickImage = async (type, isGroup = false) => {
    if (Platform.OS === 'web') {
      Alert.alert('اطلاعات', 'دوربین در وب در دسترس نیست');
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      if (isGroup) {
        setGroupFormData(prev => ({ ...prev, [type]: result.assets[0] }));
      } else {
        setFormData(prev => ({ ...prev, [type]: result.assets[0] }));
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
      if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
      if (!formData.gender) newErrors.gender = 'الزامی';
      if (!formData.age) newErrors.age = 'الزامی';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
      if (!formData.name.trim()) newErrors.name = 'الزامی';
      if (!formData.phone.trim()) newErrors.phone = 'الزامی';
      if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
      if (!formData.city.trim()) newErrors.city = 'الزامی';
    } else if (currentStep === 1) {
      if (!groupFormData.center) newErrors.center = 'الزامی';
      if (!groupFormData.gender) newErrors.gender = 'الزامی';
      if (groupFormData.ageRanges.length === 0) newErrors.ageRanges = 'الزامی';
    } else if (currentStep === 2) {
      if (!medicalFormData.testName.trim()) newErrors.testName = 'الزامی';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      let dataToSubmit;
      if (currentStep === 0) {
        dataToSubmit = { ...formData, type: 'individual' };
      } else if (currentStep === 1) {
        dataToSubmit = { ...groupFormData, type: 'group' };
      } else {
        dataToSubmit = { ...medicalFormData, type: 'medical' };
      }

      addReport({
        ...dataToSubmit,
        date: new Date().toISOString(),
        status: 'pending',
      });

      Alert.alert(
        'موفق',
        'گزارش شما با موفقیت ثبت شد',
        [{ text: 'باشه', onPress: resetForm }]
      );
    }
  };

  const resetForm = () => {
    setFormData({
      occupation: '',
      workplace: '',
      gender: '',
      age: '',
      nationality: 'ایرانی',
      nationalId: '',
      idCardPhoto: null,
      personalPhoto: null,
      name: '',
      phone: '',
      symptoms: [],
      onsetDate: '',
      city: '',
      address: '',
      severity: 5,
    });
    setGroupFormData({
      center: '',
      gender: '',
      ageRanges: [],
      nationality: 'iranian',
      letterFile: null,
      imageFile: null,
    });
    setMedicalFormData({
      testName: '',
      testDate: '',
      testResult: '',
      doctorName: '',
    });
    setErrors({});
    setCurrentStep(0);
  };

  const PickerModal = ({ visible, onClose, items, onSelect, title }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
          <Text style={[styles.modalTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            {title}
          </Text>
          <ScrollView style={styles.modalScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.modalItem, isDarkMode && styles.modalItemDark]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
                <Text style={[styles.modalItemText, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const CustomPicker = ({ visible, onClose, items, onSelect, title }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
        >
          <Text style={[styles.modalTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            {title}
          </Text>
          <ScrollView style={styles.modalScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.modalItem, isDarkMode && styles.modalItemDark]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
                <Text style={[styles.modalItemText, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );


  const commonInputProps = {
    inputStyle: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
      color: isDarkMode ? '#e9ecef' : '#212529',
      backgroundColor: isDarkMode ? '#2d3139' : '#f8f9fa',
    },
    labelStyle: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
      color: isDarkMode ? '#e9ecef' : '#212529',
    },
    containerStyle: {
      backgroundColor: 'transparent',
    }
  };

  const renderComponents = (json) => {
    console.log('json', json);
    
    if (!json || !Array.isArray(json)) return null;

    return json.map((section, sectionIndex) => {
        const [sectionId, sectionTitle, sectionType, fields] = section;
        
        return (
          <Animated.View 
            key={sectionId} 
            style={{ transform: [{ translateX: slideAnim }], paddingBottom: 8, marginBottom:0 }}
          >
            <View style={[styles.stepCard, isDarkMode && styles.stepCardDark]}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, isDarkMode && styles.sectionIconContainerDark]}>
                  <User size={22} color="#4A90E2" strokeWidth={2.5} />
                </View>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                  {sectionTitle}
                </Text>
              </View>

              {/* Render Fields */}
              {Array.isArray(fields) && fields.map((field, fieldIndex) => {
                const [fieldId, fieldLabel, fieldType, fieldOptions] = field;
                const fieldKey = `field_${fieldId}`;

                // Text Input (type: 0)
                if (fieldType === 0) {
                  const maxLength = fieldOptions ? parseInt(fieldOptions) : undefined;
                  return (
                    <CustomInput
                      key={fieldKey}
                      label={fieldLabel}
                      value={formData[fieldKey] || ''}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, [fieldKey]: text }))}
                      error={errors[fieldKey]}
                      maxLength={maxLength}
                      {...commonInputProps}
                    />
                  );
                }

                // Numeric Input (type: 11)
                if (fieldType === 11) {
                  return (
                    <CustomInput
                      key={fieldKey}
                      label={fieldLabel}
                      value={formData[fieldKey] || ''}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, [fieldKey]: text }))}
                      error={errors[fieldKey]}
                      keyboardType="numeric"
                      maxLength={fieldOptions || 10}
                      {...commonInputProps}
                    />
                  );
                }

                // Single Select Dropdown (type: 4)
                if (fieldType === 4 && Array.isArray(fieldOptions)) {
                  const options = fieldOptions.map(opt => {
                    const optionId = Object.keys(opt)[0];
                    const optionLabel = opt[optionId];
                    return { value: optionId, label: optionLabel };
                  });

                  return (
                    <View key={fieldKey}>
                      <TouchableOpacity
                        style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
                        onPress={() => {
                          setPickerOptions(options);
                          setActivePickerField(fieldKey);
                          setPickerTitle(fieldLabel);
                          setShowCustomPicker(true);
                        }}
                      >
                        <View style={styles.dropdownContent}>
                          <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                            {fieldLabel}
                          </Text>
                          <View style={styles.dropdownValueContainer}>
                            <Text style={[styles.dropdownValue, isDarkMode && styles.dropdownValueDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                              {formData[fieldKey] ? options.find(o => o.value === formData[fieldKey])?.label : 'انتخاب کنید'}
                            </Text>
                            <ChevronDown size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
                          </View>
                        </View>
                      </TouchableOpacity>
                      {errors[fieldKey] && <Text style={styles.errorText}>{errors[fieldKey]}</Text>}
                    </View>
                  );
                }

                // Multi Select (type: 5)
                if (fieldType === 5 && Array.isArray(fieldOptions)) {
                  const options = fieldOptions.map(opt => {
                    const optionId = Object.keys(opt)[0];
                    const optionLabel = opt[optionId];
                    return { id: optionId, label: optionLabel };
                  });

                  return (
                    <View key={fieldKey} style={styles.symptomsSection}>
                      <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                        {fieldLabel}
                      </Text>
                      <View style={styles.symptomsGrid}>
                        {options.map(option => {
                          const isSelected = formData[fieldKey]?.includes(option.id);
                          return (
                            <TouchableOpacity
                              key={option.id}
                              style={[
                                styles.symptomCard,
                                isSelected && styles.symptomCardActive,
                                isDarkMode && styles.symptomCardDark
                              ]}
                              onPress={() => {
                                setFormData(prev => {
                                  const currentValues = prev[fieldKey] || [];
                                  const newValues = currentValues.includes(option.id)
                                    ? currentValues.filter(id => id !== option.id)
                                    : [...currentValues, option.id];
                                  return { ...prev, [fieldKey]: newValues };
                                });
                              }}
                            >
                              <Text style={[
                                styles.symptomLabel,
                                isSelected && styles.symptomLabelActive,
                                isDarkMode && !isSelected && styles.textDark,
                                { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: 'center' }
                              ]}>
                                {option.label}
                              </Text>
                              {isSelected && (
                                <View style={styles.symptomCheck}>
                                  <CheckCircle2 size={16} color="#fff" strokeWidth={2.5} />
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {errors[fieldKey] && <Text style={styles.errorText}>{errors[fieldKey]}</Text>}
                    </View>
                  );
                }

                return null;
              })}

              {/* Add divider between sections if not last section */}
              {sectionIndex < json.length - 1 && (
                <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
              )}
            </View>
          </Animated.View>
        );
      }
    );
  };

  const renderStep1 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={[styles.stepCard, isDarkMode && styles.stepCardDark]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, isDarkMode && styles.sectionIconContainerDark]}>
            <User size={22} color="#4A90E2" strokeWidth={2.5} />
          </View>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            اطلاعات شخصی
          </Text>
        </View>

        <CustomInput
          label="شغل بیماری"
          value={formData.occupation}
          onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
          error={errors.occupation}
          icon={<Briefcase size={20} color="#4A90E2" />}
          {...commonInputProps}
        />

        <CustomInput
          label="محل خدمت بیماری"
          value={formData.workplace}
          onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
          error={errors.workplace}
          icon={<MapPin size={20} color="#4A90E2" />}
          {...commonInputProps}
        />

        <TouchableOpacity
          style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
          onPress={() => setShowGenderPicker(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              جنسیت بیماری
            </Text>
            <View style={styles.dropdownValueContainer}>
              <Text style={[styles.dropdownValue, isDarkMode && styles.dropdownValueDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
              </Text>
              <ChevronDown size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </View>
          </View>
        </TouchableOpacity>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        <TouchableOpacity
          style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
          onPress={() => setShowAgePicker(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              سن بیماری
            </Text>
            <View style={styles.dropdownValueContainer}>
              <Text style={[styles.dropdownValue, isDarkMode && styles.dropdownValueDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                {formData.age || 'انتخاب کنید'}
              </Text>
              <ChevronDown size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </View>
          </View>
        </TouchableOpacity>
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

        <CustomInput
          label="ملیت"
          value={formData.nationality}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nationality: text }))}
          {...commonInputProps}
        />

        <CustomInput
          label="کد ملی بیماری"
          value={formData.nationalId}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
          keyboardType="numeric"
          error={errors.nationalId}
          maxLength={10}
          {...commonInputProps}
        />

        <View style={styles.uploadSection}>
          <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            مدارک
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument('idCardPhoto', false)}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadGradient}
            >
              <FileText size={22} color="#fff" strokeWidth={2.5} />
              <Text style={styles.uploadButtonText}>
                {formData.idCardPhoto ? '✓ فیش بارگذاری شد' : 'بارگذاری فیش'}
              </Text>
              {!formData.idCardPhoto && <Upload size={18} color="#fff" strokeWidth={2.5} />}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage('personalPhoto', false)}
          >
            <LinearGradient
              colors={['#357ABD', '#2C5F94']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadGradient}
            >
              <ImageIcon size={22} color="#fff" strokeWidth={2.5} />
              <Text style={styles.uploadButtonText}>
                {formData.personalPhoto ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
              </Text>
              {!formData.personalPhoto && <Upload size={18} color="#fff" strokeWidth={2.5} />}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

        {/* بخش اطلاعات بیماری */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, isDarkMode && styles.sectionIconContainerDark]}>
            <Briefcase size={22} color="#4A90E2" strokeWidth={2.5} />
          </View>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            مطالعه بیماری
          </Text>
        </View>

        <CustomInput
          label="نام و نام خانوادگی"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          error={errors.name}
          {...commonInputProps}
        />

        <CustomInput
          label="شماره تماس"
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
          error={errors.phone}
          {...commonInputProps}
        />

        <View style={styles.symptomsSection}>
          <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            علائم بیماری
          </Text>
          <View style={styles.symptomsGrid}>
            {symptoms.map(symptom => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  formData.symptoms.includes(symptom.id) && styles.symptomCardActive,
                  isDarkMode && styles.symptomCardDark
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                <Text style={[
                  styles.symptomLabel,
                  formData.symptoms.includes(symptom.id) && styles.symptomLabelActive,
                  isDarkMode && !formData.symptoms.includes(symptom.id) && styles.textDark,
                  { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: 'center' }
                ]}>
                  {symptom.label}
                </Text>
                {formData.symptoms.includes(symptom.id) && (
                  <View style={styles.symptomCheck}>
                    <CheckCircle2 size={16} color="#fff" strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {errors.symptoms && <Text style={styles.errorText}>{errors.symptoms}</Text>}
        </View>

        <CustomInput
          label="تاریخ شروع علائم"
          value={formData.onsetDate}
          onChangeText={(text) => setFormData(prev => ({ ...prev, onsetDate: text }))}
          placeholder="1403/01/15"
          {...commonInputProps}
        />

        <CustomInput
          label="شهر"
          value={formData.city}
          onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
          error={errors.city}
          {...commonInputProps}
        />

        <CustomInput
          label="آدرس"
          value={formData.address}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
          multiline
          numberOfLines={3}
          {...commonInputProps}
        />

        <View style={styles.severitySection}>
          <Text style={[styles.severityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            شدت علائم: {formData.severity}/10
          </Text>
          <View style={styles.severityContainer}>
            {[1,2,3,4,5,6,7,8,9,10].map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.severityButton,
                  formData.severity >= level && styles.severityButtonActive,
                  isDarkMode && styles.severityButtonDark
                ]}
                onPress={() => setFormData(prev => ({ ...prev, severity: level }))}
              >
                <Text style={[
                  styles.severityButtonText,
                  formData.severity >= level && styles.severityButtonTextActive,
                  isDarkMode && styles.severityButtonTextDark
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderGroupForm = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={[styles.stepCard, isDarkMode && styles.stepCardDark]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, isDarkMode && styles.sectionIconContainerDark]}>
            <Users size={22} color="#4A90E2" strokeWidth={2.5} />
          </View>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            دریافت علائم بیماران گروهی
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
          onPress={() => setShowCenterPicker(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              مرکز
            </Text>
            <View style={styles.dropdownValueContainer}>
              <Text style={[styles.dropdownValue, isDarkMode && styles.dropdownValueDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
              </Text>
              <ChevronDown size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </View>
          </View>
        </TouchableOpacity>
        {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

        <TouchableOpacity
          style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
          onPress={() => setShowGenderPicker(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              جنسیت
            </Text>
            <View style={styles.dropdownValueContainer}>
              <Text style={[styles.dropdownValue, isDarkMode && styles.dropdownValueDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
              </Text>
              <ChevronDown size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} />
            </View>
          </View>
        </TouchableOpacity>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        <View style={styles.ageRangeSection}>
          <Text style={[styles.ageRangeTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            محدوده سنی
          </Text>
          <View style={styles.ageRangeGrid}>
            {ageRanges.map(range => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.ageRangeCard,
                  groupFormData.ageRanges.includes(range.id) && styles.ageRangeCardActive,
                  isDarkMode && styles.ageRangeCardDark
                ]}
                onPress={() => toggleAgeRange(range.id)}
              >
                {groupFormData.ageRanges.includes(range.id) ? (
                  <CheckSquare size={20} color="#fff" strokeWidth={2.5} />
                ) : (
                  <Square size={20} color={isDarkMode ? '#6c757d' : '#adb5bd'} strokeWidth={2.5} />
                )}
                <Text style={[
                  styles.ageRangeLabel,
                  groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
                  isDarkMode && !groupFormData.ageRanges.includes(range.id) && styles.textDark,
                  { writingDirection: isRTL ? 'rtl' : 'ltr' }
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.ageRanges && <Text style={styles.errorText}>{errors.ageRanges}</Text>}
        </View>

        <View style={styles.nationalitySection}>
          <Text style={[styles.nationalityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            ملیت
          </Text>
          <View style={styles.nationalityContainer}>
            <TouchableOpacity
              style={[
                styles.nationalityButton,
                groupFormData.nationality === 'iranian' && styles.nationalityButtonActive,
                isDarkMode && styles.nationalityButtonDark
              ]}
              onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'iranian' }))}
            >
              <View style={[
                styles.radioCircle,
                groupFormData.nationality === 'iranian' && styles.radioCircleActive,
                isDarkMode && styles.radioCircleDark
              ]}>
                {groupFormData.nationality === 'iranian' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[
                styles.nationalityText,
                isDarkMode && styles.textDark,
                { writingDirection: isRTL ? 'rtl' : 'ltr' }
              ]}>
                ایرانی
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nationalityButton,
                groupFormData.nationality === 'non-iranian' && styles.nationalityButtonActive,
                isDarkMode && styles.nationalityButtonDark
              ]}
              onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'non-iranian' }))}
            >
              <View style={[
                styles.radioCircle,
                groupFormData.nationality === 'non-iranian' && styles.radioCircleActive,
                isDarkMode && styles.radioCircleDark
              ]}>
                {groupFormData.nationality === 'non-iranian' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[
                styles.nationalityText,
                isDarkMode && styles.textDark,
                { writingDirection: isRTL ? 'rtl' : 'ltr' }
              ]}>
                غیر ایرانی
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.uploadSection}>
          <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            بارگذاری مدارک
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument('letterFile', true)}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadGradient}
            >
              <FileText size={22} color="#fff" strokeWidth={2.5} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.uploadButtonText}>
                  {groupFormData.letterFile ? '✓ مکتب بارگذاری شد' : 'بارگذاری مکتب'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  فقط فرمت های: png, gif, jpg
                </Text>
              </View>
              {!groupFormData.letterFile && <Upload size={18} color="#fff" strokeWidth={2.5} />}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage('imageFile', true)}
          >
            <LinearGradient
              colors={['#357ABD', '#2C5F94']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadGradient}
            >
              <ImageIcon size={22} color="#fff" strokeWidth={2.5} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.uploadButtonText}>
                  {groupFormData.imageFile ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  فقط فرمت های: png, gif, jpg
                </Text>
              </View>
              {!groupFormData.imageFile && <Upload size={18} color="#fff" strokeWidth={2.5} />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderMedicalForm = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={[styles.stepCard, isDarkMode && styles.stepCardDark]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, isDarkMode && styles.sectionIconContainerDark]}>
            <Heart size={22} color="#4A90E2" strokeWidth={2.5} />
          </View>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            سوابق پزشکی
          </Text>
        </View>

        <CustomInput
          label="نام آزمایش"
          value={medicalFormData.testName}
          onChangeText={(text) => setMedicalFormData(prev => ({ ...prev, testName: text }))}
          error={errors.testName}
          {...commonInputProps}
        />

        <CustomInput
          label="تاریخ آزمایش"
          value={medicalFormData.testDate}
          onChangeText={(text) => setMedicalFormData(prev => ({ ...prev, testDate: text }))}
          placeholder="1403/01/15"
          {...commonInputProps}
        />

        <CustomInput
          label="نام پزشک"
          value={medicalFormData.doctorName}
          onChangeText={(text) => setMedicalFormData(prev => ({ ...prev, doctorName: text }))}
          {...commonInputProps}
        />

        <CustomInput
          label="نتیجه آزمایش"
          value={medicalFormData.testResult}
          onChangeText={(text) => setMedicalFormData(prev => ({ ...prev, testResult: text }))}
          multiline
          numberOfLines={4}
          {...commonInputProps}
        />

        <View style={[styles.infoBox, isDarkMode && styles.infoBoxDark]}>
          <Text style={[styles.infoBoxText, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            💡 این بخش برای ثبت سوابق پزشکی و آزمایشات گذشته بیمار می‌باشد
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      
      {/* Horizontal Scrollable Headers */}
      <View style={[styles.progressContainer, isDarkMode && styles.progressContainerDark]}>
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepsContainer}
        >
          {steps.map((step, index) => (
            <TouchableOpacity 
              key={step.id} 
              style={[
                styles.stepIndicator,
                index < steps.length - 1 && styles.stepIndicatorWithBorder
              ]}
              onPress={() => {
                setCurrentStep(step.id);
                scrollViewRef.current?.scrollTo({ 
                  x: index * 140, 
                  animated: true 
                });
              }}
            >
              <View style={[
                styles.stepCircle,
                currentStep === step.id && styles.stepCircleActive,
                isDarkMode && styles.stepCircleDark
              ]}>
                <step.icon size={20} color={currentStep === step.id ? '#fff' : (isDarkMode ? '#6c757d' : '#adb5bd')} strokeWidth={2.5} />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[
                  styles.stepText,
                  currentStep === step.id && styles.stepTextActive,
                  isDarkMode && styles.stepTextDark,
                  { writingDirection: isRTL ? 'rtl' : 'ltr' }
                ]}>
                  {step.title}
                </Text>
                <Text style={[
                  styles.stepSubtext,
                  isDarkMode && styles.stepSubtextDark,
                  { writingDirection: isRTL ? 'rtl' : 'ltr' }
                ]}>
                  {step.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {forms && !loading ? forms.map((step, index) => (
            <TouchableOpacity 
              key={step.idfr} 
              style={[
                styles.stepIndicator,
                index < forms.length - 1 && styles.stepIndicatorWithBorder
              ]}
              onPress={() => {
                setCurrentStep(step.idfr);
                scrollViewRef.current?.scrollTo({ 
                  x: index * 140, 
                  animated: true 
                });
              }}
            >
              <View style={[
                styles.stepCircle,
                currentStep === step.idfr && styles.stepCircleActive,
                isDarkMode && styles.stepCircleDark
              ]}>
                <FileText size={20} color={currentStep === step.idfr ? '#fff' : (isDarkMode ? '#6c757d' : '#adb5bd')} strokeWidth={2.5} />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[
                  styles.stepText,
                  currentStep === step.idfr && styles.stepTextActive,
                  isDarkMode && styles.stepTextDark,
                  { writingDirection: isRTL ? 'rtl' : 'ltr' }
                ]}>
                  {step.name}
                </Text>
              </View>
            </TouchableOpacity>
          )): <Loading 
            type="simple" 
            message="در حال بارگذری ..." 
          />}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderGroupForm()}
          {currentStep === 2 && renderMedicalForm()}
          {currentStep > 3 && forms && renderComponents(forms.find((f) => (f.idfr === currentStep))?.jsonform)}

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={[styles.submitButtonText, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                  ذخیره و ارسال
                </Text>
                <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      <PickerModal
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        items={genders}
        onSelect={(value) => {
          if (currentStep === 0) {
            setFormData(prev => ({ ...prev, gender: value }));
          } else {
            setGroupFormData(prev => ({ ...prev, gender: value }));
          }
        }}
        title="انتخاب جنسیت"
      />

      {/* CustomPicker Modal */}
      <CustomPicker
        visible={showCustomPicker}
        onClose={() => setShowCustomPicker(false)}
        items={pickerOptions}
        title={pickerTitle}
        onSelect={(value) => {
          if (activePickerField) {
            setFormData(prev => ({ ...prev, [activePickerField]: value }));
          }
        }}
      />

      <PickerModal
        visible={showAgePicker}
        onClose={() => setShowAgePicker(false)}
        items={ages}
        onSelect={(value) => setFormData(prev => ({ ...prev, age: value }))}
        title="انتخاب سن"
      />

      <PickerModal
        visible={showCenterPicker}
        onClose={() => setShowCenterPicker(false)}
        items={centers}
        onSelect={(value) => setGroupFormData(prev => ({ ...prev, center: value }))}
        title="انتخاب مرکز"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 80,
  },
  containerDark: {
    backgroundColor: '#1a1d29',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  
  // Progress Container
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressContainerDark: {
    backgroundColor: '#212529',
    borderBottomColor: '#2d3139',
  },
  
  // Steps (Horizontal Scroll)
  stepsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  stepIndicatorWithBorder: {
    paddingRight: 16,
    marginRight: 16,
    borderRightWidth: 2,
    borderRightColor: '#e9ecef',
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  stepCircleDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
  },
  stepCircleActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  stepTextContainer: {
    maxWidth: 100,
  },
  stepText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 2,
  },
  stepTextDark: {
    color: '#adb5bd',
  },
  stepTextActive: {
    color: '#4A90E2',
  },
  stepSubtext: {
    fontSize: 11,
    color: '#adb5bd',
  },
  stepSubtextDark: {
    color: '#6c757d',
  },
  
  // Step Card
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  stepCardDark: {
    backgroundColor: '#212529',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionIconContainerDark: {
    backgroundColor: '#1e2a3a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  dividerDark: {
    backgroundColor: '#2d3139',
  },
  textDark: {
    color: '#e9ecef',
  },
  
  // Dropdown
  dropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  dropdownButtonDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
  },
  dropdownContent: {},
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  dropdownValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontSize: 15,
    color: '#6c757d',
  },
  dropdownValueDark: {
    color: '#adb5bd',
  },
  
  // Age Range
  ageRangeSection: {
    marginVertical: 16,
  },
  ageRangeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  ageRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  ageRangeCard: {
    width: '31%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ageRangeCardDark: {
    backgroundColor: '#2d3139',
  },
  ageRangeCardActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  ageRangeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 8,
  },
  ageRangeLabelActive: {
    color: '#fff',
  },
  
  // Nationality
  nationalitySection: {
    marginVertical: 16,
  },
  nationalityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  nationalityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nationalityButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  nationalityButtonDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
  },
  nationalityButtonActive: {
    borderColor: '#4A90E2',
  },
  nationalityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 10,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleDark: {
    borderColor: '#3a3f47',
  },
  radioCircleActive: {
    borderColor: '#4A90E2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  
  // Upload
  uploadSection: {
    marginTop: 20,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  uploadSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  
  // Symptoms
  symptomsSection: {
    marginVertical: 16,
  },
  symptomsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  symptomCard: {
    width: '47%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    margin: 6,
  },
  symptomCardDark: {
    backgroundColor: '#2d3139',
  },
  symptomCardActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  symptomIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  symptomLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  symptomLabelActive: {
    color: '#fff',
  },
  symptomCheck: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  
  // Severity
  severitySection: {
    marginTop: 20,
  },
  severityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  severityButtonDark: {
    backgroundColor: '#2d3139',
    borderColor: '#3a3f47',
  },
  severityButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  severityButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6c757d',
  },
  severityButtonTextDark: {
    color: '#adb5bd',
  },
  severityButtonTextActive: {
    color: '#fff',
  },
  
  // Info Box
  infoBox: {
    backgroundColor: '#f0f7ff',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  infoBoxDark: {
    backgroundColor: '#1e2a3a',
    borderColor: '#2d3e50',
  },
  infoBoxText: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 20,
  },
  
  // Navigation
  navigationButtons: {
    marginTop: 24,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    padding: 20,
  },
  modalContentDark: {
    backgroundColor: '#212529',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemDark: {
    backgroundColor: '#2d3139',
  },
  modalItemIcon: {
    fontSize: 22,
    marginLeft: 12,
  },
  modalItemText: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});

//chatGPT ui
// import { useState, useRef, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Alert, 
//   Platform,
//   Animated,
//   Modal,
//   I18nManager
// } from 'react-native';
// import { useStore } from '../../store/useStore';
// import { translations } from '../../constants/translations';
// import Header from '../../components/Header';
// import CustomInput from '../../components/CustomInput';
// import { 
//   SquareCheck as CheckSquare, 
//   Square,
//   Upload,
//   FileText,
//   Image as ImageIcon,
//   ChevronDown,
//   User,
//   Briefcase,
//   MapPin,
//   CheckCircle2,
//   ArrowLeft,
//   Users,
//   Shield
// } from 'lucide-react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// import { LinearGradient } from 'expo-linear-gradient';

// const PRIMARY_GRADIENT_LIGHT = ['#4A90E2', '#357ABD'];
// const PRIMARY_GRADIENT_DARK = ['#1F2A3A', '#192330'];
// const CARD_GRADIENT_LIGHT = ['#f4f7fb', '#edf2f8'];
// const CARD_GRADIENT_DARK = ['#242b3a', '#1e2430'];

// export default function CovidSymptomsScreen() {
//   const { language, isDarkMode, addReport } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const [currentStep, setCurrentStep] = useState(0);
//   const [showGenderPicker, setShowGenderPicker] = useState(false);
//   const [showAgePicker, setShowAgePicker] = useState(false);
//   const [showCenterPicker, setShowCenterPicker] = useState(false);

//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const [scrollHintVisible, setScrollHintVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     occupation: '',
//     workplace: '',
//     gender: '',
//     age: '',
//     nationality: 'ایرانی',
//     nationalId: '',
//     idCardPhoto: null,
//     personalPhoto: null,
//     name: '',
//     phone: '',
//     symptoms: [],
//     onsetDate: '',
//     city: '',
//     address: '',
//     severity: 5,
//   });

//   const [groupFormData, setGroupFormData] = useState({
//     center: '',
//     gender: '',
//     ageRanges: [],
//     nationality: 'iranian',
//     letterFile: null,
//     imageFile: null,
//   });

//   const [environmentFormData, setEnvironmentFormData] = useState({
//     location: '',
//     supervisor: '',
//     description: '',
//     attachment: null,
//   });

//   const [errors, setErrors] = useState({});

//   const centers = [
//     { value: 'center1', label: 'مرکز بهداشت شماره ۱' },
//     { value: 'center2', label: 'مرکز بهداشت شماره ۲' },
//     { value: 'center3', label: 'مرکز بهداشت شماره ۳' },
//     { value: 'center4', label: 'مرکز بهداشت شماره ۴' },
//   ];

//   const ageRanges = [
//     { id: '0-4', label: '0-4' },
//     { id: '5-14', label: '5-14' },
//     { id: '15-19', label: '15-19' },
//     { id: '20-29', label: '20-29' },
//     { id: '30-39', label: '30-39' },
//     { id: '40-49', label: '40-49' },
//     { id: '50-59', label: '50-59' },
//     { id: '60-69', label: '60-69' },
//     { id: '70+', label: '70+' },
//   ];

//   const symptoms = [
//     { id: 'fever', label: 'تب', icon: '🌡️' },
//     { id: 'cough', label: 'سرفه', icon: '😷' },
//     { id: 'shortnessOfBreath', label: 'تنگی نفس', icon: '😮‍💨' },
//     { id: 'fatigue', label: 'خستگی', icon: '😴' },
//     { id: 'lossOfTasteSmell', label: 'از دست دادن بو و مزه', icon: '👃' },
//     { id: 'headache', label: 'سردرد', icon: '🤕' },
//     { id: 'bodyAche', label: 'درد بدن', icon: '💪' },
//     { id: 'soreThroat', label: 'گلودرد', icon: '🗣️' },
//     { id: 'nausea', label: 'حالت تهوع', icon: '🤢' },
//     { id: 'diarrhea', label: 'اسهال', icon: '🚽' },
//   ];

//   const genders = [
//     { value: 'male', label: 'مرد', icon: '👨' },
//     { value: 'female', label: 'زن', icon: '👩' },
//     { value: 'other', label: 'سایر', icon: '⚧️' },
//   ];

//   const ages = Array.from({ length: 100 }, (_, i) => ({
//     value: String(i + 1),
//     label: String(i + 1)
//   }));

//   const steps = [
//     {
//       id: 0,
//       title: isRTL ? 'مشخصات فردی' : 'Individual',
//       icon: User,
//     },
//     {
//       id: 1,
//       title: isRTL ? 'اطلاعات بیماری' : 'Symptoms',
//       icon: Briefcase,
//     },
//     {
//       id: 2,
//       title: isRTL ? 'گزارش گروهی' : 'Group Report',
//       icon: Users,
//     },
//     {
//       id: 3,
//       title: isRTL ? 'فرم نمونه محیطی' : 'Env. Sample',
//       icon: Shield,
//     },
//   ];

//   useEffect(() => {
//     animateSlide();
//   }, [currentStep]);

//   useEffect(() => {
//     const hintTimeout = setTimeout(() => setScrollHintVisible(false), 3500);
//     return () => clearTimeout(hintTimeout);
//   }, [scrollHintVisible]);

//   useEffect(() => {
//     try {
//       I18nManager.allowRTL(true);
//       if (I18nManager.isRTL !== isRTL) {
//         I18nManager.forceRTL(isRTL);
//       }
//     } catch (e) {
//       // ignore
//     }
//   }, [isRTL]);

//   const animateSlide = () => {
//     slideAnim.setValue(300);
//     Animated.spring(slideAnim, {
//       toValue: 0,
//       friction: 8,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const toggleSymptom = (symptomId) => {
//     setFormData(prev => ({
//       ...prev,
//       symptoms: prev.symptoms.includes(symptomId)
//         ? prev.symptoms.filter(s => s !== symptomId)
//         : [...prev.symptoms, symptomId]
//     }));
//   };

//   const toggleAgeRange = (rangeId) => {
//     setGroupFormData(prev => ({
//       ...prev,
//       ageRanges: prev.ageRanges.includes(rangeId)
//         ? prev.ageRanges.filter(r => r !== rangeId)
//         : [...prev.ageRanges, rangeId]
//     }));
//   };

//   const pickDocument = async (type, target = 'individual') => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//         copyToCacheDirectory: true,
//       });

//       if (result.type === 'success') {
//         if (target === 'group') {
//           setGroupFormData(prev => ({ ...prev, [type]: result }));
//         } else if (target === 'environment') {
//           setEnvironmentFormData(prev => ({ ...prev, [type]: result }));
//         } else {
//           setFormData(prev => ({ ...prev, [type]: result }));
//         }
//       }
//     } catch (error) {
//       Alert.alert('خطا', 'خطا در انتخاب فایل');
//     }
//   };

//   const pickImage = async (type, target = 'individual') => {
//     if (Platform.OS === 'web') {
//       Alert.alert('اطلاعات', 'دوربین در وب در دسترس نیست');
//       return;
//     }

//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       const asset = result.assets[0];
//       if (target === 'group') {
//         setGroupFormData(prev => ({ ...prev, [type]: asset }));
//       } else if (target === 'environment') {
//         setEnvironmentFormData(prev => ({ ...prev, [type]: asset }));
//       } else {
//         setFormData(prev => ({ ...prev, [type]: asset }));
//       }
//     }
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     if (currentStep === 0 || currentStep === 1) {
//       if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
//       if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
//       if (!formData.gender) newErrors.gender = 'الزامی';
//       if (!formData.age) newErrors.age = 'الزامی';
//       if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
//       if (!formData.name.trim()) newErrors.name = 'الزامی';
//       if (!formData.phone.trim()) newErrors.phone = 'الزامی';
//       if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
//       if (!formData.city.trim()) newErrors.city = 'الزامی';
//     } else if (currentStep === 2) {
//       if (!groupFormData.center) newErrors.center = 'الزامی';
//       if (!groupFormData.gender) newErrors.gender = 'الزامی';
//       if (groupFormData.ageRanges.length === 0) newErrors.ageRanges = 'الزامی';
//     } else {
//       if (!environmentFormData.location.trim()) newErrors.location = 'الزامی';
//       if (!environmentFormData.supervisor.trim()) newErrors.supervisor = 'الزامی';
//       if (!environmentFormData.description.trim()) newErrors.description = 'الزامی';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validateStep()) return;

//     if (currentStep === 3) {
//       Alert.alert(
//         'فرم نمایشی',
//         'این فرم صرفاً جهت نمایش قابلیت اسکرول مراحل است.'
//       );
//       return;
//     }

//     const dataToSubmit = currentStep <= 1 
//       ? { ...formData, type: 'individual' }
//       : { ...groupFormData, type: 'group' };

//     addReport({
//       ...dataToSubmit,
//       date: new Date().toISOString(),
//       status: 'pending',
//     });

//     Alert.alert(
//       'موفق',
//       'گزارش شما با موفقیت ثبت شد',
//       [{ text: 'باشه', onPress: resetForm }]
//     );
//   };

//   const resetForm = () => {
//     setFormData({
//       occupation: '',
//       workplace: '',
//       gender: '',
//       age: '',
//       nationality: 'ایرانی',
//       nationalId: '',
//       idCardPhoto: null,
//       personalPhoto: null,
//       name: '',
//       phone: '',
//       symptoms: [],
//       onsetDate: '',
//       city: '',
//       address: '',
//       severity: 5,
//     });
//     setGroupFormData({
//       center: '',
//       gender: '',
//       ageRanges: [],
//       nationality: 'iranian',
//       letterFile: null,
//       imageFile: null,
//     });
//     setEnvironmentFormData({
//       location: '',
//       supervisor: '',
//       description: '',
//       attachment: null,
//     });
//     setErrors({});
//     setCurrentStep(0);
//   };

//   const PickerModal = ({ visible, onClose, items, onSelect, title }) => (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <TouchableOpacity 
//         style={styles.modalOverlay}
//         activeOpacity={1}
//         onPress={onClose}
//       >
//         <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
//           <Text style={[styles.modalTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//             {title}
//           </Text>
//           <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator>
//             {items.map((item) => (
//               <TouchableOpacity
//                 key={item.value}
//                 style={[styles.modalItem, isDarkMode && styles.modalItemDark]}
//                 onPress={() => {
//                   onSelect(item.value);
//                   onClose();
//                 }}
//               >
//                 {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
//                 <Text style={[
//                   styles.modalItemText,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }
//                 ]}>
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );

//   const commonInputProps = {
//     inputStyle: {
//       textAlign: isRTL ? 'right' : 'left',
//       writingDirection: isRTL ? 'rtl' : 'ltr',
//       color: isDarkMode ? '#e3e9f6' : '#1f2a3a',
//       backgroundColor: isDarkMode ? '#202637' : undefined,
//     },
//     labelStyle: {
//       textAlign: isRTL ? 'right' : 'left',
//       writingDirection: isRTL ? 'rtl' : 'ltr',
//       color: isDarkMode ? '#e3e9f6' : '#1f2a3a',
//     },
//     containerStyle: {
//       backgroundColor: 'transparent',
//     }
//   };

//   const renderIndividualDetails = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? CARD_GRADIENT_DARK : CARD_GRADIENT_LIGHT}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <View style={[styles.sectionIcon, isDarkMode && styles.sectionIconDark]}>
//               <User size={20} color={isDarkMode ? '#d7e3ff' : '#1f4f8f'} />
//             </View>
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'اطلاعات شخصی' : 'Personal information'}
//             </Text>
//           </View>

//           <CustomInput
//             label="شغل بیماری"
//             value={formData.occupation}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
//             error={errors.occupation}
//             icon={<Briefcase size={18} color="#4A90E2" />}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="محل خدمت بیماری"
//             value={formData.workplace}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
//             error={errors.workplace}
//             icon={<MapPin size={18} color="#4A90E2" />}
//             {...commonInputProps}
//           />

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//             activeOpacity={0.85}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 {isRTL ? 'جنسیت بیماری' : 'Gender'}
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[
//                   styles.dropdownValue,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }
//                 ]}>
//                   {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={18} color={isDarkMode ? '#8a94a6' : '#6c7a90'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowAgePicker(true)}
//             activeOpacity={0.85}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 {isRTL ? 'سن بیماری' : 'Age'}
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[
//                   styles.dropdownValue,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }
//                 ]}>
//                   {formData.age || 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={18} color={isDarkMode ? '#8a94a6' : '#6c7a90'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

//           <CustomInput
//             label="ملیت"
//             value={formData.nationality}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationality: text }))}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="کد ملی بیماری"
//             value={formData.nationalId}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
//             keyboardType="numeric"
//             error={errors.nationalId}
//             maxLength={10}
//             {...commonInputProps}
//           />

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'مدارک' : 'Documents'}
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('idCardPhoto')}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <FileText size={20} color="#fff" />
//                 <Text style={styles.uploadButtonText}>
//                   {formData.idCardPhoto ? '✓ فایل اضافه شد' : 'بارگذاری فیش'}
//                 </Text>
//                 {!formData.idCardPhoto && <Upload size={18} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickImage('personalPhoto')}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <ImageIcon size={20} color="#fff" />
//                 <Text style={styles.uploadButtonText}>
//                   {formData.personalPhoto ? '✓ تصویر اضافه شد' : 'بارگذاری تصویر'}
//                 </Text>
//                 {!formData.personalPhoto && <Upload size={18} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   const renderIndividualSymptoms = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? CARD_GRADIENT_DARK : CARD_GRADIENT_LIGHT}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <View style={[styles.sectionIcon, isDarkMode && styles.sectionIconDark]}>
//               <Briefcase size={20} color={isDarkMode ? '#d7e3ff' : '#1f4f8f'} />
//             </View>
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'اطلاعات بیماری' : 'Case details'}
//             </Text>
//           </View>

//           <CustomInput
//             label="نام و نام خانوادگی"
//             value={formData.name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//             error={errors.name}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="شماره تماس"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             keyboardType="phone-pad"
//             error={errors.phone}
//             {...commonInputProps}
//           />

//           <View style={styles.symptomsSection}>
//             <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'علائم بیماری' : 'Symptoms'}
//             </Text>
//             <View style={styles.symptomsGrid}>
//               {symptoms.map(symptom => (
//                 <TouchableOpacity
//                   key={symptom.id}
//                   style={[
//                     styles.symptomCard,
//                     isDarkMode && styles.symptomCardDark,
//                     formData.symptoms.includes(symptom.id) && styles.symptomCardActive
//                   ]}
//                   onPress={() => toggleSymptom(symptom.id)}
//                   activeOpacity={0.85}
//                 >
//                   <Text style={styles.symptomIcon}>{symptom.icon}</Text>
//                   <Text style={[
//                     styles.symptomLabel,
//                     isDarkMode && styles.textDark,
//                     formData.symptoms.includes(symptom.id) && styles.symptomLabelActive,
//                     { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: 'center' }
//                   ]}>
//                     {symptom.label}
//                   </Text>
//                   {formData.symptoms.includes(symptom.id) && (
//                     <View style={styles.symptomCheck}>
//                       <CheckCircle2 size={16} color="#fff" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {errors.symptoms && <Text style={styles.errorText}>{errors.symptoms}</Text>}
//           </View>

//           <CustomInput
//             label="تاریخ شروع علائم"
//             value={formData.onsetDate}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, onsetDate: text }))}
//             placeholder="1403/01/15"
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="شهر"
//             value={formData.city}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
//             error={errors.city}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="آدرس"
//             value={formData.address}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
//             multiline
//             numberOfLines={3}
//             {...commonInputProps}
//           />

//           <View style={styles.severitySection}>
//             <Text style={[styles.severityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? `شدت علائم: ${formData.severity}/10` : `Severity: ${formData.severity}/10`}
//             </Text>
//             <View style={styles.severityContainer}>
//               {[1,2,3,4,5,6,7,8,9,10].map(level => (
//                 <TouchableOpacity
//                   key={level}
//                   style={[
//                     styles.severityButton,
//                     formData.severity >= level && styles.severityButtonActive,
//                   ]}
//                   onPress={() => setFormData(prev => ({ ...prev, severity: level }))}
//                 >
//                   <Text style={[
//                     styles.severityButtonText,
//                     formData.severity >= level && styles.severityButtonTextActive
//                   ]}>
//                     {level}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   const renderGroupForm = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? CARD_GRADIENT_DARK : CARD_GRADIENT_LIGHT}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <View style={[styles.sectionIcon, isDarkMode && styles.sectionIconDark]}>
//               <Users size={20} color={isDarkMode ? '#d7e3ff' : '#1f4f8f'} />
//             </View>
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'گزارش گروهی' : 'Group report'}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowCenterPicker(true)}
//             activeOpacity={0.85}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 {isRTL ? 'مرکز' : 'Center'}
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[
//                   styles.dropdownValue,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }
//                 ]}>
//                   {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={18} color={isDarkMode ? '#8a94a6' : '#6c7a90'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//             activeOpacity={0.85}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 {isRTL ? 'جنسیت' : 'Gender'}
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[
//                   styles.dropdownValue,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }
//                 ]}>
//                   {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={18} color={isDarkMode ? '#8a94a6' : '#6c7a90'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <View style={styles.ageRangeSection}>
//             <Text style={[styles.ageRangeTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'محدوده سنی' : 'Age ranges'}
//             </Text>
//             <View style={styles.ageRangeGrid}>
//               {ageRanges.map(range => (
//                 <TouchableOpacity
//                   key={range.id}
//                   style={[
//                     styles.ageRangeCard,
//                     isDarkMode && styles.ageRangeCardDark,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeCardActive
//                   ]}
//                   onPress={() => toggleAgeRange(range.id)}
//                   activeOpacity={0.85}
//                 >
//                   {groupFormData.ageRanges.includes(range.id) ? (
//                     <CheckSquare size={18} color="#fff" />
//                   ) : (
//                     <Square size={18} color={isDarkMode ? '#8a94a6' : '#6c7a90'} />
//                   )}
//                   <Text style={[
//                     styles.ageRangeLabel,
//                     isDarkMode && styles.textDark,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
//                     { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                   ]}>
//                     {range.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {errors.ageRanges && <Text style={styles.errorText}>{errors.ageRanges}</Text>}
//           </View>

//           <View style={styles.nationalitySection}>
//             <Text style={[styles.nationalityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'ملیت' : 'Nationality'}
//             </Text>
//             <View style={styles.nationalityContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.nationalityButton,
//                   isDarkMode && styles.nationalityButtonDark,
//                   groupFormData.nationality === 'iranian' && styles.nationalityButtonActive
//                 ]}
//                 onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'iranian' }))}
//                 activeOpacity={0.85}
//               >
//                 <View style={[
//                   styles.radioCircle,
//                   groupFormData.nationality === 'iranian' && styles.radioCircleActive
//                 ]}>
//                   {groupFormData.nationality === 'iranian' && <View style={styles.radioInner} />}
//                 </View>
//                 <Text style={[
//                   styles.nationalityText,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                 ]}>
//                   {isRTL ? 'ایرانی' : 'Iranian'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.nationalityButton,
//                   isDarkMode && styles.nationalityButtonDark,
//                   groupFormData.nationality === 'non-iranian' && styles.nationalityButtonActive
//                 ]}
//                 onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'non-iranian' }))}
//                 activeOpacity={0.85}
//               >
//                 <View style={[
//                   styles.radioCircle,
//                   groupFormData.nationality === 'non-iranian' && styles.radioCircleActive
//                 ]}>
//                   {groupFormData.nationality === 'non-iranian' && <View style={styles.radioInner} />}
//                 </View>
//                 <Text style={[
//                   styles.nationalityText,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                 ]}>
//                   {isRTL ? 'غیر ایرانی' : 'Non Iranian'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'بارگذاری مدارک' : 'Attachments'}
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('letterFile', 'group')}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradientRow}
//               >
//                 <FileText size={20} color="#fff" />
//                 <View style={styles.uploadTextColumn}>
//                   <Text style={styles.uploadButtonText}>
//                     {groupFormData.letterFile ? '✓ سند اضافه شد' : 'بارگذاری مکاتبه'}
//                   </Text>
//                   <Text style={styles.uploadSubtext}>
//                     PDF یا تصویر (png, jpg)
//                   </Text>
//                 </View>
//                 {!groupFormData.letterFile && <Upload size={18} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickImage('imageFile', 'group')}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradientRow}
//               >
//                 <ImageIcon size={20} color="#fff" />
//                 <View style={styles.uploadTextColumn}>
//                   <Text style={styles.uploadButtonText}>
//                     {groupFormData.imageFile ? '✓ تصویر اضافه شد' : 'بارگذاری تصویر'}
//                   </Text>
//                   <Text style={styles.uploadSubtext}>
//                     PNG, JPG, HEIC
//                   </Text>
//                 </View>
//                 {!groupFormData.imageFile && <Upload size={18} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   const renderEnvironmentForm = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? CARD_GRADIENT_DARK : CARD_GRADIENT_LIGHT}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <View style={[styles.sectionIcon, isDarkMode && styles.sectionIconDark]}>
//               <Shield size={20} color={isDarkMode ? '#d7e3ff' : '#1f4f8f'} />
//             </View>
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               {isRTL ? 'فرم محیطی (نمونه)' : 'Environmental sample'}
//             </Text>
//           </View>

//           <Text style={[styles.infoBadge, isDarkMode && styles.infoBadgeDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//             {isRTL ? 'این فرم صرفاً جهت نمایش اسکرول تب‌ها است.' : 'This section is for demonstrating horizontal scrolling with additional forms.'}
//           </Text>

//           <CustomInput
//             label={isRTL ? 'محل بررسی' : 'Inspection site'}
//             value={environmentFormData.location}
//             onChangeText={(text) => setEnvironmentFormData(prev => ({ ...prev, location: text }))}
//             error={errors.location}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label={isRTL ? 'مسئول پایگاه' : 'Site supervisor'}
//             value={environmentFormData.supervisor}
//             onChangeText={(text) => setEnvironmentFormData(prev => ({ ...prev, supervisor: text }))}
//             error={errors.supervisor}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label={isRTL ? 'یادداشت‌ها' : 'Notes'}
//             value={environmentFormData.description}
//             onChangeText={(text) => setEnvironmentFormData(prev => ({ ...prev, description: text }))}
//             multiline
//             numberOfLines={4}
//             error={errors.description}
//             {...commonInputProps}
//           />

//           <TouchableOpacity
//             style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//             onPress={() => pickDocument('attachment', 'environment')}
//             activeOpacity={0.85}
//           >
//             <LinearGradient
//               colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.uploadGradient}
//             >
//               <FileText size={20} color="#fff" />
//               <Text style={styles.uploadButtonText}>
//                 {environmentFormData.attachment ? '✓ فایل اضافه شد' : 'بارگذاری پیوست'}
//               </Text>
//               {!environmentFormData.attachment && <Upload size={18} color="#fff" />}
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />
      
//       <View style={[styles.progressContainer, isDarkMode && styles.progressContainerDark]}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.stepsContainer}
//           onScrollBeginDrag={() => setScrollHintVisible(false)}
//           onContentSizeChange={(contentWidth, contentHeight) => {
//             if (contentWidth > styles.stepsContainer.minWidth) {
//               setScrollHintVisible(true);
//             }
//           }}
//         >
//           {steps.map((step) => (
//             <TouchableOpacity 
//               key={step.id} 
//               style={styles.stepIndicator}
//               activeOpacity={0.85}
//               onPress={() => setCurrentStep(step.id)}
//             >
//               <View style={[
//                 styles.stepCircle,
//                 isDarkMode && styles.stepCircleDark,
//                 currentStep === step.id && styles.stepCircleActive
//               ]}>
//                 <step.icon size={18} color={currentStep === step.id ? '#fff' : (isDarkMode ? '#8a94a6' : '#6c7a90')} />
//               </View>
//               <Text style={[
//                 styles.stepText,
//                 isDarkMode && styles.textDark,
//                 currentStep === step.id && styles.stepTextActive,
//                 { writingDirection: isRTL ? 'rtl' : 'ltr' }
//               ]}>
//                 {step.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {steps.length > 2 && scrollHintVisible && (
//           <Animated.View style={styles.scrollHint}>
//             <Text style={styles.scrollHintText}>
//               {isRTL ? 'برای فرم‌های بیشتر بکشید ←' : 'Swipe for more forms →'}
//             </Text>
//           </Animated.View>
//         )}

//         {steps.length > 2 && (
//           <>
//             <LinearGradient
//               colors={isDarkMode ? ['rgba(31,42,58,0)', 'rgba(31,42,58,0.95)'] : ['rgba(244,247,251,0)', 'rgba(244,247,251,1)']}
//               style={styles.fadeRight}
//               pointerEvents="none"
//             />
//             <LinearGradient
//               colors={isDarkMode ? ['rgba(31,42,58,0.95)', 'rgba(31,42,58,0)'] : ['rgba(244,247,251,1)', 'rgba(244,247,251,0)']}
//               style={styles.fadeLeft}
//               pointerEvents="none"
//             />
//           </>
//         )}
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>
//           {currentStep === 0 && renderIndividualDetails()}
//           {currentStep === 1 && renderIndividualSymptoms()}
//           {currentStep === 2 && renderGroupForm()}
//           {currentStep === 3 && renderEnvironmentForm()}

//           <View style={styles.navigationButtons}>
//             <TouchableOpacity
//               style={[styles.navButton, styles.nextButton]}
//               onPress={handleSubmit}
//               activeOpacity={0.9}
//             >
//               <LinearGradient
//                 colors={isDarkMode ? PRIMARY_GRADIENT_DARK : PRIMARY_GRADIENT_LIGHT}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.nextButtonGradient}
//               >
//                 <Text style={[styles.nextButtonText, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                   {currentStep === 3 ? (isRTL ? 'فرم نمایشی است' : 'Demo form') : (isRTL ? 'ذخیره و ارسال' : 'Save & submit')}
//                 </Text>
//                 <ArrowLeft size={18} color="#fff" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>

//       <PickerModal
//         visible={showGenderPicker}
//         onClose={() => setShowGenderPicker(false)}
//         items={genders}
//         onSelect={(value) => {
//           if (currentStep <= 1) {
//             setFormData(prev => ({ ...prev, gender: value }));
//           } else {
//             setGroupFormData(prev => ({ ...prev, gender: value }));
//           }
//         }}
//         title={isRTL ? 'انتخاب جنسیت' : 'Choose gender'}
//       />

//       <PickerModal
//         visible={showAgePicker}
//         onClose={() => setShowAgePicker(false)}
//         items={ages}
//         onSelect={(value) => setFormData(prev => ({ ...prev, age: value }))}
//         title={isRTL ? 'انتخاب سن' : 'Choose age'}
//       />

//       <PickerModal
//         visible={showCenterPicker}
//         onClose={() => setShowCenterPicker(false)}
//         items={centers}
//         onSelect={(value) => setGroupFormData(prev => ({ ...prev, center: value }))}
//         title={isRTL ? 'انتخاب مرکز' : 'Choose center'}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eff2f7',
//   },
//   containerDark: {
//     backgroundColor: '#12141c',
//   },
//   content: {
//     flex: 1,
//   },
//   form: {
//     padding: 16,
//   },
//   progressContainer: {
//     backgroundColor: '#f4f7fb',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     position: 'relative',
//   },
//   progressContainerDark: {
//     backgroundColor: '#1f2a3a',
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     columnGap: 16,
//     minWidth: '100%',
//   },
//   stepIndicator: {
//     alignItems: 'center',
//     width: 90,
//   },
//   stepCircle: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: '#d9e3f5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 6,
//   },
//   stepCircleDark: {
//     backgroundColor: '#253042',
//   },
//   stepCircleActive: {
//     backgroundColor: '#4A90E2',
//   },
//   stepText: {
//     fontSize: 12,
//     color: '#65748b',
//     fontWeight: '600',
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   stepTextActive: {
//     color: '#4A90E2',
//   },
//   scrollHint: {
//     position: 'absolute',
//     bottom: 6,
//     right: 16,
//     backgroundColor: 'rgba(36,52,80,0.85)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   scrollHintText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   fadeRight: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     bottom: 0,
//     width: 32,
//   },
//   fadeLeft: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 32,
//   },
//   stepCard: {
//     marginBottom: 20,
//   },
//   cardGradient: {
//     borderRadius: 18,
//     padding: 18,
//     shadowColor: '#0c1b33',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.08,
//     shadowRadius: 18,
//     elevation: 5,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 18,
//     gap: 12,
//   },
//   sectionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: 'rgba(74,144,226,0.12)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   sectionIconDark: {
//     backgroundColor: 'rgba(215,227,255,0.15)',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1f2a3a',
//   },
//   textDark: {
//     color: '#e3e9f6',
//   },
//   dropdownButton: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: '#d9e3f5',
//   },
//   dropdownButtonDark: {
//     backgroundColor: '#1c2330',
//     borderColor: '#283247',
//   },
//   dropdownContent: {},
//   dropdownLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1f2a3a',
//     marginBottom: 6,
//   },
//   dropdownValueContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dropdownValue: {
//     fontSize: 15,
//     color: '#54617a',
//   },
//   ageRangeSection: {
//     marginVertical: 16,
//   },
//   ageRangeTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1f2a3a',
//     marginBottom: 12,
//   },
//   ageRangeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   ageRangeCard: {
//     width: '30%',
//     minWidth: 96,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     gap: 8,
//   },
//   ageRangeCardDark: {
//     backgroundColor: '#1c2330',
//   },
//   ageRangeCardActive: {
//     borderColor: '#4A90E2',
//     backgroundColor: '#4A90E2',
//   },
//   ageRangeLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1f2a3a',
//   },
//   ageRangeLabelActive: {
//     color: '#fff',
//   },
//   nationalitySection: {
//     marginVertical: 16,
//   },
//   nationalityTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1f2a3a',
//     marginBottom: 12,
//   },
//   nationalityContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   nationalityButton: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 2,
//     borderColor: '#d9e3f5',
//   },
//   nationalityButtonDark: {
//     backgroundColor: '#1c2330',
//     borderColor: '#283247',
//   },
//   nationalityButtonActive: {
//     borderColor: '#4A90E2',
//   },
//   nationalityText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1f2a3a',
//   },
//   radioCircle: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     borderColor: '#b6c4da',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioCircleActive: {
//     borderColor: '#4A90E2',
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#4A90E2',
//   },
//   uploadSection: {
//     marginTop: 20,
//     gap: 12,
//   },
//   uploadTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1f2a3a',
//   },
//   uploadButton: {
//     borderRadius: 14,
//     overflow: 'hidden',
//   },
//   uploadButtonDark: {
//     opacity: 0.96,
//   },
//   uploadGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     gap: 12,
//   },
//   uploadGradientRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     gap: 12,
//   },
//   uploadTextColumn: {
//     flex: 1,
//   },
//   uploadButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   uploadSubtext: {
//     fontSize: 11,
//     color: 'rgba(255,255,255,0.85)',
//     marginTop: 2,
//   },
//   symptomsSection: {
//     marginVertical: 16,
//   },
//   symptomsTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1f2a3a',
//     marginBottom: 12,
//   },
//   symptomsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   symptomCard: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     position: 'relative',
//   },
//   symptomCardDark: {
//     backgroundColor: '#1c2330',
//   },
//   symptomCardActive: {
//     borderColor: '#4A90E2',
//     backgroundColor: '#4A90E2',
//   },
//   symptomIcon: {
//     fontSize: 28,
//     marginBottom: 6,
//   },
//   symptomLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1f2a3a',
//     textAlign: 'center',
//   },
//   symptomLabelActive: {
//     color: '#fff',
//   },
//   symptomCheck: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//   },
//   severitySection: {
//     marginTop: 20,
//   },
//   severityTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1f2a3a',
//     marginBottom: 12,
//   },
//   severityContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   severityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: '#d9e3f5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   severityButtonActive: {
//     backgroundColor: '#4A90E2',
//   },
//   severityButtonText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#54617a',
//   },
//   severityButtonTextActive: {
//     color: '#fff',
//   },
//   navigationButtons: {
//     marginTop: 24,
//   },
//   navButton: {
//     borderRadius: 14,
//     overflow: 'hidden',
//   },
//   nextButton: {
//     width: '100%',
//   },
//   nextButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     gap: 10,
//   },
//   nextButtonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '70%',
//     padding: 20,
//   },
//   modalContentDark: {
//     backgroundColor: '#1a1f2b',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1f2a3a',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalScroll: {
//     maxHeight: 360,
//   },
//   modalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     backgroundColor: '#f4f7fb',
//     borderRadius: 12,
//     marginBottom: 8,
//     gap: 12,
//   },
//   modalItemDark: {
//     backgroundColor: '#1f2735',
//   },
//   modalItemIcon: {
//     fontSize: 22,
//   },
//   modalItemText: {
//     fontSize: 15,
//     color: '#1f2a3a',
//     fontWeight: '500',
//   },
//   errorText: {
//     color: '#e45a68',
//     fontSize: 11,
//     marginTop: -4,
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   infoBadge: {
//     fontSize: 13,
//     color: '#1f4f8f',
//     backgroundColor: 'rgba(74,144,226,0.12)',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//   },
//   infoBadgeDark: {
//     color: '#d7e3ff',
//     backgroundColor: 'rgba(215,227,255,0.12)',
//   },
// });
// old version view
// import { useState, useRef, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Alert, 
//   Platform,
//   Animated,
//   Modal,
//   I18nManager
// } from 'react-native';
// import { useStore } from '../../store/useStore';
// import { translations } from '../../constants/translations';
// import Header from '../../components/Header';
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';
// import { 
//   SquareCheck as CheckSquare, 
//   Square,
//   Upload,
//   FileText,
//   Image as ImageIcon,
//   ChevronDown,
//   User,
//   Briefcase,
//   MapPin,
//   CheckCircle2,
//   ArrowRight,
//   ArrowLeft,
//   Users
// } from 'lucide-react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function CovidSymptomsScreen() {
//   const { language, isDarkMode, addReport } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const [currentStep, setCurrentStep] = useState(0);
//   const [showGenderPicker, setShowGenderPicker] = useState(false);
//   const [showAgePicker, setShowAgePicker] = useState(false);
//   const [showCenterPicker, setShowCenterPicker] = useState(false);

//   const slideAnim = useRef(new Animated.Value(0)).current;

//   // فرم اطلاعات فردی
//   const [formData, setFormData] = useState({
//     occupation: '',
//     workplace: '',
//     gender: '',
//     age: '',
//     nationality: 'ایرانی',
//     nationalId: '',
//     idCardPhoto: null,
//     personalPhoto: null,
//     name: '',
//     phone: '',
//     symptoms: [],
//     onsetDate: '',
//     city: '',
//     address: '',
//     severity: 5,
//   });

//   // فرم اطلاعات گروهی
//   const [groupFormData, setGroupFormData] = useState({
//     center: '',
//     gender: '',
//     ageRanges: [],
//     nationality: 'iranian',
//     letterFile: null,
//     imageFile: null,
//   });

//   const [errors, setErrors] = useState({});

//   // لیست مراکز
//   const centers = [
//     { value: 'center1', label: 'مرکز بهداشت شماره 1' },
//     { value: 'center2', label: 'مرکز بهداشت شماره 2' },
//     { value: 'center3', label: 'مرکز بهداشت شماره 3' },
//     { value: 'center4', label: 'مرکز بهداشت شماره 4' },
//   ];

//   // محدوده‌های سنی
//   const ageRanges = [
//     { id: '0-4', label: '0-4' },
//     { id: '5-14', label: '5-14' },
//     { id: '15-19', label: '15-19' },
//     { id: '20-29', label: '20-29' },
//     { id: '30-39', label: '30-39' },
//     { id: '40-49', label: '40-49' },
//     { id: '50-59', label: '50-59' },
//     { id: '60-69', label: '60-69' },
//     { id: '70+', label: '70+' },
//   ];

//   const symptoms = [
//     { id: 'fever', label: 'تب', icon: '🌡️' },
//     { id: 'cough', label: 'سرفه', icon: '😷' },
//     { id: 'shortnessOfBreath', label: 'تنگی نفس', icon: '😮‍💨' },
//     { id: 'fatigue', label: 'خستگی', icon: '😴' },
//     { id: 'lossOfTasteSmell', label: 'از دست دادن بو و مزه', icon: '👃' },
//     { id: 'headache', label: 'سردرد', icon: '🤕' },
//     { id: 'bodyAche', label: 'درد بدن', icon: '💪' },
//     { id: 'soreThroat', label: 'گلو درد', icon: '🗣️' },
//     { id: 'nausea', label: 'حالت تهوع', icon: '🤢' },
//     { id: 'diarrhea', label: 'اسهال', icon: '🚽' },
//   ];

//   const genders = [
//     { value: 'male', label: 'مرد', icon: '👨' },
//     { value: 'female', label: 'زن', icon: '👩' },
//     { value: 'other', label: 'سایر', icon: '⚧️' },
//   ];

//   const ages = Array.from({ length: 100 }, (_, i) => ({
//     value: String(i + 1),
//     label: String(i + 1)
//   }));

//   const steps = [
//     {
//       id: 0,
//       title: 'مشخصات فردی',
//       icon: User,
//       gradient: ['#667eea', '#764ba2']
//     },
//     {
//       id: 1,
//       title: 'اطلاعات بیماری',
//       icon: Briefcase,
//       gradient: ['#f093fb', '#f5576c']
//     }
//   ];

//   useEffect(() => {
//     animateSlide();
//   }, [currentStep]);

//   // Try to enable RTL writing direction if language indicates RTL.
//   // NOTE: forceRTL may require app reload on some platforms to take full effect.
//   useEffect(() => {
//     try {
//       I18nManager.allowRTL(true);
//       if (I18nManager.isRTL !== isRTL) {
//         // This may require a reload to fully apply; best-effort toggle here.
//         I18nManager.forceRTL(isRTL);
//       }
//     } catch (e) {
//       // ignore on platforms where I18nManager changes are restricted
//     }
//   }, [isRTL]);

//   const animateSlide = () => {
//     slideAnim.setValue(300);
//     Animated.spring(slideAnim, {
//       toValue: 0,
//       friction: 8,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const toggleSymptom = (symptomId) => {
//     setFormData(prev => ({
//       ...prev,
//       symptoms: prev.symptoms.includes(symptomId)
//         ? prev.symptoms.filter(s => s !== symptomId)
//         : [...prev.symptoms, symptomId]
//     }));
//   };

//   const toggleAgeRange = (rangeId) => {
//     setGroupFormData(prev => ({
//       ...prev,
//       ageRanges: prev.ageRanges.includes(rangeId)
//         ? prev.ageRanges.filter(r => r !== rangeId)
//         : [...prev.ageRanges, rangeId]
//     }));
//   };

//   const pickDocument = async (type, isGroup = false) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//         copyToCacheDirectory: true,
//       });

//       if (result.type === 'success') {
//         if (isGroup) {
//           setGroupFormData(prev => ({ ...prev, [type]: result }));
//         } else {
//           setFormData(prev => ({ ...prev, [type]: result }));
//         }
//       }
//     } catch (error) {
//       Alert.alert('خطا', 'خطا در انتخاب فایل');
//     }
//   };

//   const pickImage = async (type, isGroup = false) => {
//     if (Platform.OS === 'web') {
//       Alert.alert('اطلاعات', 'دوربین در وب در دسترس نیست');
//       return;
//     }

//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (permissionResult.granted === false) {
//       Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       if (isGroup) {
//         setGroupFormData(prev => ({ ...prev, [type]: result.assets[0] }));
//       } else {
//         setFormData(prev => ({ ...prev, [type]: result.assets[0] }));
//       }
//     }
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     if (currentStep === 0) {
//       // Validation for individual (both original steps)
//       if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
//       if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
//       if (!formData.gender) newErrors.gender = 'الزامی';
//       if (!formData.age) newErrors.age = 'الزامی';
//       if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
//       if (!formData.name.trim()) newErrors.name = 'الزامی';
//       if (!formData.phone.trim()) newErrors.phone = 'الزامی';
//       if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
//       if (!formData.city.trim()) newErrors.city = 'الزامی';
//     } else {
//       // Validation for group
//       if (!groupFormData.center) newErrors.center = 'الزامی';
//       if (!groupFormData.gender) newErrors.gender = 'الزامی';
//       if (groupFormData.ageRanges.length === 0) newErrors.ageRanges = 'الزامی';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateStep()) {
//       const dataToSubmit = currentStep === 0 
//         ? { ...formData, type: 'individual' }
//         : { ...groupFormData, type: 'group' };

//       addReport({
//         ...dataToSubmit,
//         date: new Date().toISOString(),
//         status: 'pending',
//       });

//       Alert.alert(
//         'موفق',
//         'گزارش شما با موفقیت ثبت شد',
//         [{ text: 'باشه', onPress: resetForm }]
//       );
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       occupation: '',
//       workplace: '',
//       gender: '',
//       age: '',
//       nationality: 'ایرانی',
//       nationalId: '',
//       idCardPhoto: null,
//       personalPhoto: null,
//       name: '',
//       phone: '',
//       symptoms: [],
//       onsetDate: '',
//       city: '',
//       address: '',
//       severity: 5,
//     });
//     setGroupFormData({
//       center: '',
//       gender: '',
//       ageRanges: [],
//       nationality: 'iranian',
//       letterFile: null,
//       imageFile: null,
//     });
//     setErrors({});
//     setCurrentStep(0);
//   };

//   // Picker Modal Component
//   const PickerModal = ({ visible, onClose, items, onSelect, title }) => (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <TouchableOpacity 
//         style={styles.modalOverlay}
//         activeOpacity={1}
//         onPress={onClose}
//       >
//         <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
//           <Text style={[styles.modalTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//             {title}
//           </Text>
//           <ScrollView style={styles.modalScroll}>
//             {items.map((item) => (
//               <TouchableOpacity
//                 key={item.value}
//                 style={[styles.modalItem, isDarkMode && styles.modalItemDark]}
//                 onPress={() => {
//                   onSelect(item.value);
//                   onClose();
//                 }}
//               >
//                 {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
//                 <Text style={[styles.modalItemText, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );

//   // Input props to pass to CustomInput (try to be compatible with most CustomInput implementations)
//   const commonInputProps = {
//     inputStyle: {
//       textAlign: isRTL ? 'right' : 'left',
//       writingDirection: isRTL ? 'rtl' : 'ltr',
//       color: isDarkMode ? '#e0e0e0' : '#333',
//       backgroundColor: isDarkMode ? '#1f1f1f' : undefined,
//     },
//     labelStyle: {
//       textAlign: isRTL ? 'right' : 'left',
//       writingDirection: isRTL ? 'rtl' : 'ltr',
//       color: isDarkMode ? '#e0e0e0' : '#333',
//     },
//     containerStyle: {
//       // ensure container background adapts in case CustomInput renders a white box
//       backgroundColor: isDarkMode ? 'transparent' : 'transparent',
//     }
//   };

//   const renderStep1 = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? ['rgba(102,126,234,0.06)','rgba(118,75,162,0.06)'] : ['rgba(102,126,234,0.1)', 'rgba(118,75,162,0.1)']}
//           style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
//         >
//           <View style={styles.sectionHeader}>
//             <User size={24} color="#667eea" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               اطلاعات شخصی
//             </Text>
//           </View>

//           <CustomInput
//             label="شغل بیماری"
//             value={formData.occupation}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
//             error={errors.occupation}
//             icon={<Briefcase size={20} color="#667eea" />}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="محل خدمت بیماری"
//             value={formData.workplace}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
//             error={errors.workplace}
//             icon={<MapPin size={20} color="#667eea" />}
//             {...commonInputProps}
//           />

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 جنسیت بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
//                   {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
//             onPress={() => setShowAgePicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 سن بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
//                   {formData.age || 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

//           <CustomInput
//             label="ملیت"
//             value={formData.nationality}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationality: text }))}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="کد ملی بیماری"
//             value={formData.nationalId}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
//             keyboardType="numeric"
//             error={errors.nationalId}
//             maxLength={10}
//             {...commonInputProps}
//           />

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               مدارک
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('idCardPhoto', false)}
//             >
//               <LinearGradient
//                 colors={['#667eea', '#764ba2']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <FileText size={24} color="#fff" />
//                 <Text style={styles.uploadButtonText}>
//                   {formData.idCardPhoto ? '✓ فیش بارگذاری شد' : 'بارگذاری فیش'}
//                 </Text>
//                 {!formData.idCardPhoto && <Upload size={20} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickImage('personalPhoto', false)}
//             >
//               <LinearGradient
//                 colors={['#f093fb', '#f5576c']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <ImageIcon size={24} color="#fff" />
//                 <Text style={styles.uploadButtonText}>
//                   {formData.personalPhoto ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
//                 </Text>
//                 {!formData.personalPhoto && <Upload size={20} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   const renderStep2 = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? ['rgba(240,147,251,0.06)', 'rgba(245,87,108,0.06)'] : ['rgba(240, 147, 251, 0.1)', 'rgba(245, 87, 108, 0.1)']}
//           style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
//         >
//           <View style={styles.sectionHeader}>
//             <Briefcase size={24} color="#f093fb" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               مطالعه بیماری
//             </Text>
//           </View>

//           <CustomInput
//             label="نام و نام خانوادگی"
//             value={formData.name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//             error={errors.name}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="شماره تماس"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             keyboardType="phone-pad"
//             error={errors.phone}
//             {...commonInputProps}
//           />

//           <View style={styles.symptomsSection}>
//             <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               علائم بیماری
//             </Text>
//             <View style={styles.symptomsGrid}>
//               {symptoms.map(symptom => (
//                 <TouchableOpacity
//                   key={symptom.id}
//                   style={[
//                     styles.symptomCard,
//                     formData.symptoms.includes(symptom.id) && styles.symptomCardActive,
//                     isDarkMode && styles.symptomCardDark
//                   ]}
//                   onPress={() => toggleSymptom(symptom.id)}
//                 >
//                   <Text style={styles.symptomIcon}>{symptom.icon}</Text>
//                   <Text style={[
//                     styles.symptomLabel,
//                     formData.symptoms.includes(symptom.id) && styles.symptomLabelActive,
//                     isDarkMode && styles.textDark,
//                     { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'center' }
//                   ]}>
//                     {symptom.label}
//                   </Text>
//                   {formData.symptoms.includes(symptom.id) && (
//                     <View style={styles.symptomCheck}>
//                       <CheckCircle2 size={16} color="#fff" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {errors.symptoms && <Text style={styles.errorText}>{errors.symptoms}</Text>}
//           </View>

//           <CustomInput
//             label="تاریخ شروع علائم"
//             value={formData.onsetDate}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, onsetDate: text }))}
//             placeholder="1403/01/15"
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="شهر"
//             value={formData.city}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
//             error={errors.city}
//             {...commonInputProps}
//           />

//           <CustomInput
//             label="آدرس"
//             value={formData.address}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
//             multiline
//             numberOfLines={3}
//             {...commonInputProps}
//           />

//           <View style={styles.severitySection}>
//             <Text style={[styles.severityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               شدت علائم: {formData.severity}/10
//             </Text>
//             <View style={styles.severityContainer}>
//               {[1,2,3,4,5,6,7,8,9,10].map(level => (
//                 <TouchableOpacity
//                   key={level}
//                   style={[
//                     styles.severityButton,
//                     formData.severity >= level && styles.severityButtonActive,
//                   ]}
//                   onPress={() => setFormData(prev => ({ ...prev, severity: level }))}
//                 >
//                   <Text style={[
//                     styles.severityButtonText,
//                     formData.severity >= level && styles.severityButtonTextActive
//                   ]}>
//                     {level}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   const renderGroupForm = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={isDarkMode ? ['rgba(79,172,254,0.06)', 'rgba(0,242,254,0.06)'] : ['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
//           style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
//         >
//           <View style={styles.sectionHeader}>
//             <Users size={24} color="#4facfe" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               دریافت علائم بیماران گروهی
//             </Text>
//           </View>

//           {/* مرکز */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
//             onPress={() => setShowCenterPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 مرکز
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
//                   {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

//           {/* جنسیت */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                 جنسیت
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
//                   {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           {/* محدوده سنی */}
//           <View style={styles.ageRangeSection}>
//             <Text style={[styles.ageRangeTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               محدوده سنی
//             </Text>
//             <View style={styles.ageRangeGrid}>
//               {ageRanges.map(range => (
//                 <TouchableOpacity
//                   key={range.id}
//                   style={[
//                     styles.ageRangeCard,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeCardActive,
//                     isDarkMode && styles.ageRangeCardDark
//                   ]}
//                   onPress={() => toggleAgeRange(range.id)}
//                 >
//                   {groupFormData.ageRanges.includes(range.id) ? (
//                     <CheckSquare size={20} color={groupFormData.ageRanges.includes(range.id) ? '#fff' : (isDarkMode ? '#999' : '#666')} />
//                   ) : (
//                     <Square size={20} color={isDarkMode ? '#999' : '#666'} />
//                   )}
//                   <Text style={[
//                     styles.ageRangeLabel,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
//                     isDarkMode && styles.textDark,
//                     { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                   ]}>
//                     {range.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {errors.ageRanges && <Text style={styles.errorText}>{errors.ageRanges}</Text>}
//           </View>

//           {/* ملیت */}
//           <View style={styles.nationalitySection}>
//             <Text style={[styles.nationalityTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               ملیت
//             </Text>
//             <View style={styles.nationalityContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.nationalityButton,
//                   groupFormData.nationality === 'iranian' && styles.nationalityButtonActive,
//                   isDarkMode && styles.nationalityButtonDark
//                 ]}
//                 onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'iranian' }))}
//               >
//                 <View style={[
//                   styles.radioCircle,
//                   groupFormData.nationality === 'iranian' && styles.radioCircleActive
//                 ]}>
//                   {groupFormData.nationality === 'iranian' && (
//                     <View style={styles.radioInner} />
//                   )}
//                 </View>
//                 <Text style={[
//                   styles.nationalityText,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                 ]}>
//                   ایرانی
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.nationalityButton,
//                   groupFormData.nationality === 'non-iranian' && styles.nationalityButtonActive,
//                   isDarkMode && styles.nationalityButtonDark
//                 ]}
//                 onPress={() => setGroupFormData(prev => ({ ...prev, nationality: 'non-iranian' }))}
//               >
//                 <View style={[
//                   styles.radioCircle,
//                   groupFormData.nationality === 'non-iranian' && styles.radioCircleActive
//                 ]}>
//                   {groupFormData.nationality === 'non-iranian' && (
//                     <View style={styles.radioInner} />
//                   )}
//                 </View>
//                 <Text style={[
//                   styles.nationalityText,
//                   isDarkMode && styles.textDark,
//                   { writingDirection: isRTL ? 'rtl' : 'ltr' }
//                 ]}>
//                   غیر ایرانی
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* بارگذاری فایل‌ها */}
//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//               بارگذاری مدارک
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('letterFile', true)}
//             >
//               <LinearGradient
//                 colors={['#4facfe', '#00f2fe']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <FileText size={24} color="#fff" />
//                 <View style={{ flex: 1, marginHorizontal: 12 }}>
//                   <Text style={styles.uploadButtonText}>
//                     {groupFormData.letterFile ? '✓ مکتب بارگذاری شد' : 'بارگذاری مکتب'}
//                   </Text>
//                   <Text style={styles.uploadSubtext}>
//                     فقط فرمت های: png, gif, jpg
//                   </Text>
//                 </View>
//                 {!groupFormData.letterFile && <Upload size={20} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickImage('imageFile', true)}
//             >
//               <LinearGradient
//                 colors={['#43e97b', '#38f9d7']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.uploadGradient}
//               >
//                 <ImageIcon size={24} color="#fff" />
//                 <View style={{ flex: 1, marginHorizontal: 12 }}>
//                   <Text style={styles.uploadButtonText}>
//                     {groupFormData.imageFile ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
//                   </Text>
//                   <Text style={styles.uploadSubtext}>
//                     فقط فرمت های: png, gif, jpg
//                   </Text>
//                 </View>
//                 {!groupFormData.imageFile && <Upload size={20} color="#fff" />}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </Animated.View>
//   );

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />
      
//       {/* Step Indicators as Tabs */}
//       <View style={[styles.progressContainer, isDarkMode && styles.progressContainerDark]}>
        
//         {/* Step Indicators */}
//         <View style={styles.stepsContainer}>
//           {steps.map((step) => (
//             <TouchableOpacity 
//               key={step.id} 
//               style={styles.stepIndicator}
//               onPress={() => setCurrentStep(step.id)}
//             >
//               <View style={[
//                 styles.stepCircle,
//                 currentStep === step.id && styles.stepCircleActive,
//                 isDarkMode && styles.stepCircleDark
//               ]}>
//                 <step.icon size={20} color={currentStep === step.id ? '#fff' : '#999'} />
//               </View>
//               <Text style={[
//                 styles.stepText,
//                 currentStep === step.id && styles.stepTextActive,
//                 isDarkMode && styles.textDark,
//                 { writingDirection: isRTL ? 'rtl' : 'ltr' }
//               ]}>
//                 {step.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>
//           {currentStep === 0 ? (
//             <>
//               {renderStep1()}
//               {renderStep2()}
//             </>
//           ) : (
//             renderGroupForm()
//           )}

//           {/* Submit Button */}
//           <View style={styles.navigationButtons}>
//             <TouchableOpacity
//               style={[styles.navButton, styles.nextButton]}
//               onPress={handleSubmit}
//             >
//               <LinearGradient
//                 colors={steps[currentStep].gradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.nextButtonGradient}
//               >
//                 <Text style={[styles.nextButtonText, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
//                   ذخیره و ارسال
//                 </Text>
//                 <ArrowLeft size={20} color="#fff" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>

//       {/* Picker Modals */}
//       <PickerModal
//         visible={showGenderPicker}
//         onClose={() => setShowGenderPicker(false)}
//         items={genders}
//         onSelect={(value) => {
//           if (currentStep === 0) {
//             setFormData(prev => ({ ...prev, gender: value }));
//           } else {
//             setGroupFormData(prev => ({ ...prev, gender: value }));
//           }
//         }}
//         title="انتخاب جنسیت"
//       />

//       <PickerModal
//         visible={showAgePicker}
//         onClose={() => setShowAgePicker(false)}
//         items={ages}
//         onSelect={(value) => setFormData(prev => ({ ...prev, age: value }))}
//         title="انتخاب سن"
//       />

//       <PickerModal
//         visible={showCenterPicker}
//         onClose={() => setShowCenterPicker(false)}
//         items={centers}
//         onSelect={(value) => setGroupFormData(prev => ({ ...prev, center: value }))}
//         title="انتخاب مرکز"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     marginBottom: 80,
//   },
//   containerDark: {
//     backgroundColor: '#0a0a0a',
//   },
//   content: {
//     flex: 1,
//   },
//   form: {
//     padding: 16,
//   },
  
//   // Progress Bar
//   progressContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingBottom: 16,
//   },
//   progressContainerDark: {
//     backgroundColor: '#121212',
//   },
  
//   // Step Indicators
//   stepsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   stepIndicator: {
//     alignItems: 'center',
//   },
//   stepCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   stepCircleDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   stepCircleActive: {
//     backgroundColor: '#667eea',
//   },
//   stepText: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   stepTextActive: {
//     color: '#667eea',
//   },
  
//   // Step Card
//   stepCard: {
//     marginBottom: 20,
//   },
//   cardGradient: {
//     borderRadius: 20,
//     padding: 20,
//   },
//   cardGradientDark: {
//     // subtle dark overlay to make inner whites less prominent
//     backgroundColor: 'transparent',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     marginRight: 12,
//   },
//   textDark: {
//     color: '#e0e0e0',
//   },
  
//   // Dropdown
//   dropdownButton: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   dropdownButtonDark: {
//     backgroundColor: '#1a1a1a',
//     borderColor: '#2a2a2a',
//   },
//   dropdownContent: {
//     // no gap — use margins/padding when needed
//   },
//   dropdownLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 6,
//   },
//   dropdownValueContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dropdownValue: {
//     fontSize: 16,
//     color: '#666',
//   },
  
//   // Age Range
//   ageRangeSection: {
//     marginVertical: 16,
//   },
//   ageRangeTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 12,
//   },
//   ageRangeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     // spacing via margin in children
//   },
//   ageRangeCard: {
//     width: '31%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: '2%',
//     marginBottom: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   ageRangeCardDark: {
//     backgroundColor: '#222',
//   },
//   ageRangeCardActive: {
//     borderColor: '#4facfe',
//     backgroundColor: '#4facfe',
//   },
//   ageRangeLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginLeft: 8,
//   },
//   ageRangeLabelActive: {
//     color: '#fff',
//   },
  
//   // Nationality
//   nationalitySection: {
//     marginVertical: 16,
//   },
//   nationalityTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 12,
//   },
//   nationalityContainer: {
//     flexDirection: 'row',
//     // spacing via margin
//   },
//   nationalityButton: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//   },
//   nationalityButtonDark: {
//     backgroundColor: '#1f1f1f',
//     borderColor: '#333',
//   },
//   nationalityButtonActive: {
//     borderColor: '#4facfe',
//   },
//   nationalityText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
//   radioCircle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioCircleActive: {
//     borderColor: '#4facfe',
//   },
//   radioInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#4facfe',
//   },
  
//   // Upload Section
//   uploadSection: {
//     marginTop: 20,
//   },
//   uploadTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 12,
//   },
//   uploadButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 12,
//   },
//   uploadButtonDark: {
//     opacity: 0.95,
//   },
//   uploadGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   uploadButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   uploadSubtext: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 2,
//   },
  
//   // Symptoms
//   symptomsSection: {
//     marginVertical: 16,
//   },
//   symptomsTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 16,
//   },
//   symptomsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   symptomCard: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     position: 'relative',
//     marginBottom: 12,
//   },
//   symptomCardDark: {
//     backgroundColor: '#1f1f1f',
//   },
//   symptomCardActive: {
//     borderColor: '#667eea',
//     backgroundColor: '#667eea',
//   },
//   symptomIcon: {
//     fontSize: 32,
//     marginBottom: 8,
//   },
//   symptomLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
//   symptomLabelActive: {
//     color: '#fff',
//   },
//   symptomCheck: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//   },
  
//   // Severity
//   severitySection: {
//     marginTop: 20,
//   },
//   severityTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 12,
//   },
//   severityContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   severityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   severityButtonActive: {
//     backgroundColor: '#667eea',
//   },
//   severityButtonText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#666',
//   },
//   severityButtonTextActive: {
//     color: '#fff',
//   },
  
//   // Navigation
//   navigationButtons: {
//     flexDirection: 'row',
//     marginTop: 24,
//   },
//   navButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   nextButton: {
//     flex: 1,
//   },
//   nextButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   nextButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//     marginLeft: 8,
//   },
  
//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '70%',
//     padding: 20,
//   },
//   modalContentDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalScroll: {
//     maxHeight: 400,
//   },
//   modalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   modalItemDark: {
//     backgroundColor: '#222',
//   },
//   modalItemIcon: {
//     fontSize: 24,
//     marginLeft: 12,
//   },
//   modalItemText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
  
//   errorText: {
//     color: '#DC3545',
//     fontSize: 12,
//     marginTop: -8,
//     marginBottom: 8,
//     marginRight: 4,
//   },
// });
