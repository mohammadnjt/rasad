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
//   Modal
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
//           <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
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
//                 <Text style={[styles.modalItemText, isDarkMode && styles.textDark]}>
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );

//   const renderStep1 = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <User size={24} color="#667eea" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               اطلاعات شخصی
//             </Text>
//           </View>

//           <CustomInput
//             label="شغل بیماری"
//             value={formData.occupation}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
//             error={errors.occupation}
//             icon={<Briefcase size={20} color="#667eea" />}
//           />

//           <CustomInput
//             label="محل خدمت بیماری"
//             value={formData.workplace}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
//             error={errors.workplace}
//             icon={<MapPin size={20} color="#667eea" />}
//           />

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 جنسیت بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowAgePicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 سن بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
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
//           />

//           <CustomInput
//             label="کد ملی بیماری"
//             value={formData.nationalId}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
//             keyboardType="numeric"
//             error={errors.nationalId}
//             maxLength={10}
//           />

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark]}>
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
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(240, 147, 251, 0.1)', 'rgba(245, 87, 108, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <Briefcase size={24} color="#f093fb" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               مطالعه بیماری
//             </Text>
//           </View>

//           <CustomInput
//             label="نام و نام خانوادگی"
//             value={formData.name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//             error={errors.name}
//           />

//           <CustomInput
//             label="شماره تماس"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             keyboardType="phone-pad"
//             error={errors.phone}
//           />

//           <View style={styles.symptomsSection}>
//             <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark]}>
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
//                     isDarkMode && styles.textDark
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
//           />

//           <CustomInput
//             label="شهر"
//             value={formData.city}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
//             error={errors.city}
//           />

//           <CustomInput
//             label="آدرس"
//             value={formData.address}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
//             multiline
//             numberOfLines={3}
//           />

//           <View style={styles.severitySection}>
//             <Text style={[styles.severityTitle, isDarkMode && styles.textDark]}>
//               شدت علائم: {formData.severity}/10
//             </Text>
//             <View style={styles.severityContainer}>
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
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
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <Users size={24} color="#4facfe" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               دریافت علائم بیماران گروهی
//             </Text>
//           </View>

//           {/* مرکز */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowCenterPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 مرکز
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

//           {/* جنسیت */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 جنسیت
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           {/* محدوده سنی */}
//           <View style={styles.ageRangeSection}>
//             <Text style={[styles.ageRangeTitle, isDarkMode && styles.textDark]}>
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
//                     <CheckSquare size={20} color="#fff" />
//                   ) : (
//                     <Square size={20} color={isDarkMode ? '#999' : '#666'} />
//                   )}
//                   <Text style={[
//                     styles.ageRangeLabel,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
//                     isDarkMode && styles.textDark
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
//             <Text style={[styles.nationalityTitle, isDarkMode && styles.textDark]}>
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
//                   isDarkMode && styles.textDark
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
//                   isDarkMode && styles.textDark
//                 ]}>
//                   غیر ایرانی
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* بارگذاری فایل‌ها */}
//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark]}>
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
//       <View style={styles.progressContainer}>
        
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
//                 isDarkMode && styles.textDark
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
//                 <Text style={styles.nextButtonText}>
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
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
//   },
//   dropdownContent: {
//     gap: 8,
//   },
//   dropdownLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
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
//     gap: 8,
//   },
//   ageRangeCard: {
//     width: '31%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   ageRangeCardDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   ageRangeCardActive: {
//     borderColor: '#4facfe',
//     backgroundColor: '#4facfe',
//   },
//   ageRangeLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
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
//     gap: 12,
//   },
//   nationalityButton: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//   },
//   nationalityButtonDark: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
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
//     color: 'rgba(255,255,255,0.8)',
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
//     gap: 12,
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
//   },
//   symptomCardDark: {
//     backgroundColor: '#2a2a2a',
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
//     gap: 12,
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
//     backgroundColor: '#2a2a2a',
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
import CustomButton from '../../components/CustomButton';
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
  ArrowRight,
  ArrowLeft,
  Users
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function CovidSymptomsScreen() {
  const { language, isDarkMode, addReport } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [currentStep, setCurrentStep] = useState(0);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showCenterPicker, setShowCenterPicker] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const [errors, setErrors] = useState({});

  // لیست مراکز
  const centers = [
    { value: 'center1', label: 'مرکز بهداشت شماره 1' },
    { value: 'center2', label: 'مرکز بهداشت شماره 2' },
    { value: 'center3', label: 'مرکز بهداشت شماره 3' },
    { value: 'center4', label: 'مرکز بهداشت شماره 4' },
  ];

  // محدوده‌های سنی
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

  const steps = [
    {
      id: 0,
      title: 'مشخصات فردی',
      icon: User,
      gradient: ['#667eea', '#764ba2']
    },
    {
      id: 1,
      title: 'اطلاعات بیماری',
      icon: Briefcase,
      gradient: ['#f093fb', '#f5576c']
    }
  ];

  useEffect(() => {
    animateSlide();
  }, [currentStep]);

  // Try to enable RTL writing direction if language indicates RTL.
  // NOTE: forceRTL may require app reload on some platforms to take full effect.
  useEffect(() => {
    try {
      I18nManager.allowRTL(true);
      if (I18nManager.isRTL !== isRTL) {
        // This may require a reload to fully apply; best-effort toggle here.
        I18nManager.forceRTL(isRTL);
      }
    } catch (e) {
      // ignore on platforms where I18nManager changes are restricted
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
      // Validation for individual (both original steps)
      if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
      if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
      if (!formData.gender) newErrors.gender = 'الزامی';
      if (!formData.age) newErrors.age = 'الزامی';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
      if (!formData.name.trim()) newErrors.name = 'الزامی';
      if (!formData.phone.trim()) newErrors.phone = 'الزامی';
      if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
      if (!formData.city.trim()) newErrors.city = 'الزامی';
    } else {
      // Validation for group
      if (!groupFormData.center) newErrors.center = 'الزامی';
      if (!groupFormData.gender) newErrors.gender = 'الزامی';
      if (groupFormData.ageRanges.length === 0) newErrors.ageRanges = 'الزامی';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      const dataToSubmit = currentStep === 0 
        ? { ...formData, type: 'individual' }
        : { ...groupFormData, type: 'group' };

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
    setErrors({});
    setCurrentStep(0);
  };

  // Picker Modal Component
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

  // Input props to pass to CustomInput (try to be compatible with most CustomInput implementations)
  const commonInputProps = {
    inputStyle: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
      color: isDarkMode ? '#e0e0e0' : '#333',
      backgroundColor: isDarkMode ? '#1f1f1f' : undefined,
    },
    labelStyle: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
      color: isDarkMode ? '#e0e0e0' : '#333',
    },
    containerStyle: {
      // ensure container background adapts in case CustomInput renders a white box
      backgroundColor: isDarkMode ? 'transparent' : 'transparent',
    }
  };

  const renderStep1 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={styles.stepCard}>
        <LinearGradient
          colors={isDarkMode ? ['rgba(102,126,234,0.06)','rgba(118,75,162,0.06)'] : ['rgba(102,126,234,0.1)', 'rgba(118,75,162,0.1)']}
          style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
        >
          <View style={styles.sectionHeader}>
            <User size={24} color="#667eea" />
            <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              اطلاعات شخصی
            </Text>
          </View>

          <CustomInput
            label="شغل بیماری"
            value={formData.occupation}
            onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
            error={errors.occupation}
            icon={<Briefcase size={20} color="#667eea" />}
            {...commonInputProps}
          />

          <CustomInput
            label="محل خدمت بیماری"
            value={formData.workplace}
            onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
            error={errors.workplace}
            icon={<MapPin size={20} color="#667eea" />}
            {...commonInputProps}
          />

          <TouchableOpacity
            style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
            onPress={() => setShowGenderPicker(true)}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                جنسیت بیماری
              </Text>
              <View style={styles.dropdownValueContainer}>
                <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
                </Text>
                <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
              </View>
            </View>
          </TouchableOpacity>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <TouchableOpacity
            style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
            onPress={() => setShowAgePicker(true)}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                سن بیماری
              </Text>
              <View style={styles.dropdownValueContainer}>
                <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {formData.age || 'انتخاب کنید'}
                </Text>
                <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
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
              style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
              onPress={() => pickDocument('idCardPhoto', false)}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadGradient}
              >
                <FileText size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {formData.idCardPhoto ? '✓ فیش بارگذاری شد' : 'بارگذاری فیش'}
                </Text>
                {!formData.idCardPhoto && <Upload size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
              onPress={() => pickImage('personalPhoto', false)}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadGradient}
              >
                <ImageIcon size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {formData.personalPhoto ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
                </Text>
                {!formData.personalPhoto && <Upload size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={styles.stepCard}>
        <LinearGradient
          colors={isDarkMode ? ['rgba(240,147,251,0.06)', 'rgba(245,87,108,0.06)'] : ['rgba(240, 147, 251, 0.1)', 'rgba(245, 87, 108, 0.1)']}
          style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
        >
          <View style={styles.sectionHeader}>
            <Briefcase size={24} color="#f093fb" />
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
                    isDarkMode && styles.textDark,
                    { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'center' }
                  ]}>
                    {symptom.label}
                  </Text>
                  {formData.symptoms.includes(symptom.id) && (
                    <View style={styles.symptomCheck}>
                      <CheckCircle2 size={16} color="#fff" />
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
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, severity: level }))}
                >
                  <Text style={[
                    styles.severityButtonText,
                    formData.severity >= level && styles.severityButtonTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderGroupForm = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], marginBottom: 8 }}>
      <View style={styles.stepCard}>
        <LinearGradient
          colors={isDarkMode ? ['rgba(79,172,254,0.06)', 'rgba(0,242,254,0.06)'] : ['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
          style={[styles.cardGradient, isDarkMode && styles.cardGradientDark]}
        >
          <View style={styles.sectionHeader}>
            <Users size={24} color="#4facfe" />
            <Text style={[styles.sectionTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              دریافت علائم بیماران گروهی
            </Text>
          </View>

          {/* مرکز */}
          <TouchableOpacity
            style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
            onPress={() => setShowCenterPicker(true)}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                مرکز
              </Text>
              <View style={styles.dropdownValueContainer}>
                <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
                </Text>
                <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
              </View>
            </View>
          </TouchableOpacity>
          {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

          {/* جنسیت */}
          <TouchableOpacity
            style={[styles.dropdownButton, isDarkMode ? styles.dropdownButtonDark : null]}
            onPress={() => setShowGenderPicker(true)}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                جنسیت
              </Text>
              <View style={styles.dropdownValueContainer}>
                <Text style={[styles.dropdownValue, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }]}>
                  {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
                </Text>
                <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
              </View>
            </View>
          </TouchableOpacity>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          {/* محدوده سنی */}
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
                    <CheckSquare size={20} color={groupFormData.ageRanges.includes(range.id) ? '#fff' : (isDarkMode ? '#999' : '#666')} />
                  ) : (
                    <Square size={20} color={isDarkMode ? '#999' : '#666'} />
                  )}
                  <Text style={[
                    styles.ageRangeLabel,
                    groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
                    isDarkMode && styles.textDark,
                    { writingDirection: isRTL ? 'rtl' : 'ltr' }
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.ageRanges && <Text style={styles.errorText}>{errors.ageRanges}</Text>}
          </View>

          {/* ملیت */}
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
                  groupFormData.nationality === 'iranian' && styles.radioCircleActive
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
                  groupFormData.nationality === 'non-iranian' && styles.radioCircleActive
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

          {/* بارگذاری فایل‌ها */}
          <View style={styles.uploadSection}>
            <Text style={[styles.uploadTitle, isDarkMode && styles.textDark, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
              بارگذاری مدارک
            </Text>

            <TouchableOpacity
              style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
              onPress={() => pickDocument('letterFile', true)}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadGradient}
              >
                <FileText size={24} color="#fff" />
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={styles.uploadButtonText}>
                    {groupFormData.letterFile ? '✓ مکتب بارگذاری شد' : 'بارگذاری مکتب'}
                  </Text>
                  <Text style={styles.uploadSubtext}>
                    فقط فرمت های: png, gif, jpg
                  </Text>
                </View>
                {!groupFormData.letterFile && <Upload size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
              onPress={() => pickImage('imageFile', true)}
            >
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadGradient}
              >
                <ImageIcon size={24} color="#fff" />
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={styles.uploadButtonText}>
                    {groupFormData.imageFile ? '✓ تصویر بارگذاری شد' : 'بارگذاری تصویر'}
                  </Text>
                  <Text style={styles.uploadSubtext}>
                    فقط فرمت های: png, gif, jpg
                  </Text>
                </View>
                {!groupFormData.imageFile && <Upload size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />
      
      {/* Step Indicators as Tabs */}
      <View style={[styles.progressContainer, isDarkMode && styles.progressContainerDark]}>
        
        {/* Step Indicators */}
        <View style={styles.stepsContainer}>
          {steps.map((step) => (
            <TouchableOpacity 
              key={step.id} 
              style={styles.stepIndicator}
              onPress={() => setCurrentStep(step.id)}
            >
              <View style={[
                styles.stepCircle,
                currentStep === step.id && styles.stepCircleActive,
                isDarkMode && styles.stepCircleDark
              ]}>
                <step.icon size={20} color={currentStep === step.id ? '#fff' : '#999'} />
              </View>
              <Text style={[
                styles.stepText,
                currentStep === step.id && styles.stepTextActive,
                isDarkMode && styles.textDark,
                { writingDirection: isRTL ? 'rtl' : 'ltr' }
              ]}>
                {step.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {currentStep === 0 ? (
            <>
              {renderStep1()}
              {renderStep2()}
            </>
          ) : (
            renderGroupForm()
          )}

          {/* Submit Button */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={steps[currentStep].gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextButtonGradient}
              >
                <Text style={[styles.nextButtonText, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
                  ذخیره و ارسال
                </Text>
                <ArrowLeft size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Picker Modals */}
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
    backgroundColor: '#f5f5f5',
    marginBottom: 80,
  },
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  
  // Progress Bar
  progressContainer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 16,
  },
  progressContainerDark: {
    backgroundColor: '#121212',
  },
  
  // Step Indicators
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleDark: {
    backgroundColor: '#2a2a2a',
  },
  stepCircleActive: {
    backgroundColor: '#667eea',
  },
  stepText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepTextActive: {
    color: '#667eea',
  },
  
  // Step Card
  stepCard: {
    marginBottom: 20,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  cardGradientDark: {
    // subtle dark overlay to make inner whites less prominent
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
  },
  textDark: {
    color: '#e0e0e0',
  },
  
  // Dropdown
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
  },
  dropdownContent: {
    // no gap — use margins/padding when needed
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  dropdownValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontSize: 16,
    color: '#666',
  },
  
  // Age Range
  ageRangeSection: {
    marginVertical: 16,
  },
  ageRangeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  ageRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // spacing via margin in children
  },
  ageRangeCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ageRangeCardDark: {
    backgroundColor: '#222',
  },
  ageRangeCardActive: {
    borderColor: '#4facfe',
    backgroundColor: '#4facfe',
  },
  ageRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  nationalityContainer: {
    flexDirection: 'row',
    // spacing via margin
  },
  nationalityButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  nationalityButtonDark: {
    backgroundColor: '#1f1f1f',
    borderColor: '#333',
  },
  nationalityButtonActive: {
    borderColor: '#4facfe',
  },
  nationalityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#4facfe',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4facfe',
  },
  
  // Upload Section
  uploadSection: {
    marginTop: 20,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  uploadButtonDark: {
    opacity: 0.95,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  uploadSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  
  // Symptoms
  symptomsSection: {
    marginVertical: 16,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 12,
  },
  symptomCardDark: {
    backgroundColor: '#1f1f1f',
  },
  symptomCardActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  symptomIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  symptomLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityButtonActive: {
    backgroundColor: '#667eea',
  },
  severityButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  severityButtonTextActive: {
    color: '#fff',
  },
  
  // Navigation
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  navButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButton: {
    flex: 1,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
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
    backgroundColor: '#1a1a1a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemDark: {
    backgroundColor: '#222',
  },
  modalItemIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginRight: 4,
  },
});



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
//   Modal
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

//   const [reportType, setReportType] = useState('individual'); // 'individual' or 'group'
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showGenderPicker, setShowGenderPicker] = useState(false);
//   const [showAgePicker, setShowAgePicker] = useState(false);
//   const [showCenterPicker, setShowCenterPicker] = useState(false);

//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const toggleAnim = useRef(new Animated.Value(0)).current;

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

//   const steps = reportType === 'individual' ? [
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
//   ] : [
//     {
//       id: 0,
//       title: 'اطلاعات گروهی',
//       icon: Users,
//       gradient: ['#4facfe', '#00f2fe']
//     }
//   ];

//   useEffect(() => {
//     animateProgress();
//     animateSlide();
//   }, [currentStep, reportType]);

//   useEffect(() => {
//     animateToggle();
//   }, [reportType]);

//   const animateToggle = () => {
//     Animated.spring(toggleAnim, {
//       toValue: reportType === 'group' ? 1 : 0,
//       friction: 6,
//       tension: 80,
//       useNativeDriver: true,
//     }).start();
//   };

//   const animateProgress = () => {
//     Animated.timing(progressAnim, {
//       toValue: (currentStep + 1) / steps.length,
//       duration: 400,
//       useNativeDriver: false,
//     }).start();
//   };

//   const animateSlide = () => {
//     slideAnim.setValue(300);
//     Animated.spring(slideAnim, {
//       toValue: 0,
//       friction: 8,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const toggleReportType = (type) => {
//     setReportType(type);
//     setCurrentStep(0);
//     setErrors({});
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

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (reportType === 'individual') {
//       if (step === 0) {
//         if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
//         if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
//         if (!formData.gender) newErrors.gender = 'الزامی';
//         if (!formData.age) newErrors.age = 'الزامی';
//         if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
//       }

//       if (step === 1) {
//         if (!formData.name.trim()) newErrors.name = 'الزامی';
//         if (!formData.phone.trim()) newErrors.phone = 'الزامی';
//         if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
//         if (!formData.city.trim()) newErrors.city = 'الزامی';
//       }
//     } else {
//       // Validation for group form
//       if (!groupFormData.center) newErrors.center = 'الزامی';
//       if (!groupFormData.gender) newErrors.gender = 'الزامی';
//       if (groupFormData.ageRanges.length === 0) newErrors.ageRanges = 'الزامی';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       if (currentStep < steps.length - 1) {
//         setCurrentStep(prev => prev + 1);
//       } else {
//         handleSubmit();
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1);
//     }
//   };

//   const handleSubmit = () => {
//     const dataToSubmit = reportType === 'individual' 
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
//           <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
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
//                 <Text style={[styles.modalItemText, isDarkMode && styles.textDark]}>
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );

//   const renderStep1 = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <User size={24} color="#667eea" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               اطلاعات شخصی
//             </Text>
//           </View>

//           <CustomInput
//             label="شغل بیماری"
//             value={formData.occupation}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
//             error={errors.occupation}
//             icon={<Briefcase size={20} color="#667eea" />}
//           />

//           <CustomInput
//             label="محل خدمت بیماری"
//             value={formData.workplace}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
//             error={errors.workplace}
//             icon={<MapPin size={20} color="#667eea" />}
//           />

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 جنسیت بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowAgePicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 سن بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
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
//           />

//           <CustomInput
//             label="کد ملی بیماری"
//             value={formData.nationalId}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
//             keyboardType="numeric"
//             error={errors.nationalId}
//             maxLength={10}
//           />

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark]}>
//               مدارک
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('idCardPhoto')}
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
//               onPress={() => pickImage('personalPhoto')}
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
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(240, 147, 251, 0.1)', 'rgba(245, 87, 108, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <Briefcase size={24} color="#f093fb" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               مطالعه بیماری
//             </Text>
//           </View>

//           <CustomInput
//             label="نام و نام خانوادگی"
//             value={formData.name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//             error={errors.name}
//           />

//           <CustomInput
//             label="شماره تماس"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             keyboardType="phone-pad"
//             error={errors.phone}
//           />

//           <View style={styles.symptomsSection}>
//             <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark]}>
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
//                     isDarkMode && styles.textDark
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
//           />

//           <CustomInput
//             label="شهر"
//             value={formData.city}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
//             error={errors.city}
//           />

//           <CustomInput
//             label="آدرس"
//             value={formData.address}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
//             multiline
//             numberOfLines={3}
//           />

//           <View style={styles.severitySection}>
//             <Text style={[styles.severityTitle, isDarkMode && styles.textDark]}>
//               شدت علائم: {formData.severity}/10
//             </Text>
//             <View style={styles.severityContainer}>
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
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
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <Users size={24} color="#4facfe" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               دریافت علائم بیماران گروهی
//             </Text>
//           </View>

//           {/* مرکز */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowCenterPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 مرکز
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {groupFormData.center ? centers.find(c => c.value === groupFormData.center)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.center && <Text style={styles.errorText}>{errors.center}</Text>}

//           {/* جنسیت */}
//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 جنسیت
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {groupFormData.gender ? genders.find(g => g.value === groupFormData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           {/* محدوده سنی */}
//           <View style={styles.ageRangeSection}>
//             <Text style={[styles.ageRangeTitle, isDarkMode && styles.textDark]}>
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
//                     <CheckSquare size={20} color="#fff" />
//                   ) : (
//                     <Square size={20} color={isDarkMode ? '#999' : '#666'} />
//                   )}
//                   <Text style={[
//                     styles.ageRangeLabel,
//                     groupFormData.ageRanges.includes(range.id) && styles.ageRangeLabelActive,
//                     isDarkMode && styles.textDark
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
//             <Text style={[styles.nationalityTitle, isDarkMode && styles.textDark]}>
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
//                   isDarkMode && styles.textDark
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
//                   isDarkMode && styles.textDark
//                 ]}>
//                   غیر ایرانی
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* بارگذاری فایل‌ها */}
//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark]}>
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

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   const toggleTranslate = toggleAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 80],
//   });

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />
      
//       {/* Report Type Toggle */}
//       <View style={styles.toggleContainer}>
//         <View style={[styles.toggleTrack, isDarkMode && styles.toggleTrackDark]}>
//           <Animated.View 
//             style={[
//               styles.toggleIndicator,
//               { transform: [{ translateX: toggleTranslate }] }
//             ]}
//           >
//             <LinearGradient
//               colors={reportType === 'individual' ? ['#667eea', '#764ba2'] : ['#4facfe', '#00f2fe']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.toggleIndicatorGradient}
//             />
//           </Animated.View>
          
//           <TouchableOpacity
//             style={styles.toggleOption}
//             onPress={() => toggleReportType('individual')}
//           >
//             <User size={20} color={reportType === 'individual' ? '#fff' : (isDarkMode ? '#999' : '#666')} />
//             <Text style={[
//               styles.toggleText,
//               reportType === 'individual' && styles.toggleTextActive,
//               isDarkMode && styles.textDark
//             ]}>
//               فردی
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.toggleOption}
//             onPress={() => toggleReportType('group')}
//           >
//             <Users size={20} color={reportType === 'group' ? '#fff' : (isDarkMode ? '#999' : '#666')} />
//             <Text style={[
//               styles.toggleText,
//               reportType === 'group' && styles.toggleTextActive,
//               isDarkMode && styles.textDark
//             ]}>
//               گروهی
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Progress Bar - Only for individual */}
//       {reportType === 'individual' && (
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, isDarkMode && styles.progressBarDark]}>
//             <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
//               <LinearGradient
//                 colors={steps[currentStep].gradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.progressGradient}
//               />
//             </Animated.View>
//           </View>
          
//           {/* Step Indicators */}
//           <View style={styles.stepsContainer}>
//             {steps.map((step, index) => (
//               <View key={step.id} style={styles.stepIndicator}>
//                 <View style={[
//                   styles.stepCircle,
//                   currentStep >= index && styles.stepCircleActive,
//                   isDarkMode && styles.stepCircleDark
//                 ]}>
//                   {currentStep > index ? (
//                     <CheckCircle2 size={24} color="#fff" />
//                   ) : (
//                     <step.icon size={20} color={currentStep >= index ? '#fff' : '#999'} />
//                   )}
//                 </View>
//                 <Text style={[
//                   styles.stepText,
//                   currentStep >= index && styles.stepTextActive,
//                   isDarkMode && styles.textDark
//                 ]}>
//                   {step.title}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>
//           {reportType === 'individual' ? (
//             <>
//               {currentStep === 0 && renderStep1()}
//               {currentStep === 1 && renderStep2()}
//             </>
//           ) : (
//             renderGroupForm()
//           )}

//           {/* Navigation Buttons */}
//           <View style={styles.navigationButtons}>
//             {reportType === 'individual' && currentStep > 0 && (
//               <TouchableOpacity
//                 style={[styles.navButton, styles.backButton]}
//                 onPress={handleBack}
//               >
//                 <ArrowRight size={20} color="#667eea" />
//                 <Text style={styles.backButtonText}>قبلی</Text>
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity
//               style={[styles.navButton, styles.nextButton]}
//               onPress={handleNext}
//             >
//               <LinearGradient
//                 colors={steps[currentStep].gradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.nextButtonGradient}
//               >
//                 <Text style={styles.nextButtonText}>
//                   {(reportType === 'group' || currentStep === steps.length - 1) ? 'ذخیره و ارسال' : 'بعدی'}
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
//           if (reportType === 'individual') {
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
  
//   // Toggle Switch
//   toggleContainer: {
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   toggleTrack: {
//     flexDirection: 'row',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 16,
//     padding: 4,
//     position: 'relative',
//   },
//   toggleTrackDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   toggleIndicator: {
//     position: 'absolute',
//     width: '48%',
//     height: '100%',
//     borderRadius: 12,
//     overflow: 'hidden',
//     margin: 4,
//   },
//   toggleIndicatorGradient: {
//     flex: 1,
//   },
//   toggleOption: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     gap: 8,
//     zIndex: 1,
//   },
//   toggleText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#666',
//   },
//   toggleTextActive: {
//     color: '#fff',
//   },
  
//   // Progress Bar
//   progressContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingBottom: 16,
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   progressBarDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   progressFill: {
//     height: '100%',
//   },
//   progressGradient: {
//     flex: 1,
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
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
//   },
//   dropdownContent: {
//     gap: 8,
//   },
//   dropdownLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
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
//     gap: 8,
//   },
//   ageRangeCard: {
//     width: '31%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   ageRangeCardDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   ageRangeCardActive: {
//     borderColor: '#4facfe',
//     backgroundColor: '#4facfe',
//   },
//   ageRangeLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
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
//     gap: 12,
//   },
//   nationalityButton: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//   },
//   nationalityButtonDark: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
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
//     color: 'rgba(255,255,255,0.8)',
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
//     gap: 12,
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
//   },
//   symptomCardDark: {
//     backgroundColor: '#2a2a2a',
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
//     gap: 12,
//     marginTop: 24,
//   },
//   navButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   backButton: {
//     borderWidth: 2,
//     borderColor: '#667eea',
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#667eea',
//     marginRight: 8,
//   },
//   nextButton: {
//     flex: 2,
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
//     backgroundColor: '#2a2a2a',
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
//});

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
//   Modal
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
//   ArrowLeft
// } from 'lucide-react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker'; // expo install expo-document-picker
// import { LinearGradient } from 'expo-linear-gradient';

// export default function CovidSymptomsScreen() {
//   const { language, isDarkMode, addReport } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const [currentStep, setCurrentStep] = useState(0);
//   const [showGenderPicker, setShowGenderPicker] = useState(false);
//   const [showAgePicker, setShowAgePicker] = useState(false);

//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   const [formData, setFormData] = useState({
//     // مرحله 1: مشخصات
//     occupation: '',
//     workplace: '',
//     gender: '',
//     age: '',
//     nationality: 'ایرانی',
//     nationalId: '',
//     idCardPhoto: null,
//     personalPhoto: null,
    
//     // مرحله 2: اطلاعات بیماری
//     name: '',
//     phone: '',
//     symptoms: [],
//     onsetDate: '',
//     city: '',
//     address: '',
//     severity: 5,
//   });

//   const [errors, setErrors] = useState({});

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
//     animateProgress();
//     animateSlide();
//   }, [currentStep]);

//   const animateProgress = () => {
//     Animated.timing(progressAnim, {
//       toValue: (currentStep + 1) / steps.length,
//       duration: 400,
//       useNativeDriver: false,
//     }).start();
//   };

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

//   const pickDocument = async (type) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//         copyToCacheDirectory: true,
//       });

//       if (result.type === 'success') {
//         setFormData(prev => ({ ...prev, [type]: result }));
//       }
//     } catch (error) {
//       Alert.alert('خطا', 'خطا در انتخاب فایل');
//     }
//   };

//   const pickImage = async (type) => {
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
//       setFormData(prev => ({ ...prev, [type]: result.assets[0] }));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 0) {
//       if (!formData.occupation.trim()) newErrors.occupation = 'الزامی';
//       if (!formData.workplace.trim()) newErrors.workplace = 'الزامی';
//       if (!formData.gender) newErrors.gender = 'الزامی';
//       if (!formData.age) newErrors.age = 'الزامی';
//       if (!formData.nationalId.trim()) newErrors.nationalId = 'الزامی';
//     }

//     if (step === 1) {
//       if (!formData.name.trim()) newErrors.name = 'الزامی';
//       if (!formData.phone.trim()) newErrors.phone = 'الزامی';
//       if (formData.symptoms.length === 0) newErrors.symptoms = 'الزامی';
//       if (!formData.city.trim()) newErrors.city = 'الزامی';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       if (currentStep < steps.length - 1) {
//         setCurrentStep(prev => prev + 1);
//       } else {
//         handleSubmit();
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1);
//     }
//   };

//   const handleSubmit = () => {
//     addReport({
//       ...formData,
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
//           <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
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
//                 <Text style={[styles.modalItemText, isDarkMode && styles.textDark]}>
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );

//   const renderStep1 = () => (
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <User size={24} color="#667eea" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               اطلاعات شخصی
//             </Text>
//           </View>

//           <CustomInput
//             label="شغل بیماری"
//             value={formData.occupation}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
//             error={errors.occupation}
//             icon={<Briefcase size={20} color="#667eea" />}
//           />

//           <CustomInput
//             label="محل خدمت بیماری"
//             value={formData.workplace}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, workplace: text }))}
//             error={errors.workplace}
//             icon={<MapPin size={20} color="#667eea" />}
//           />

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowGenderPicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 جنسیت بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
//                   {formData.gender ? genders.find(g => g.value === formData.gender)?.label : 'انتخاب کنید'}
//                 </Text>
//                 <ChevronDown size={20} color={isDarkMode ? '#999' : '#666'} />
//               </View>
//             </View>
//           </TouchableOpacity>
//           {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//           <TouchableOpacity
//             style={[styles.dropdownButton, isDarkMode && styles.dropdownButtonDark]}
//             onPress={() => setShowAgePicker(true)}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownLabel, isDarkMode && styles.textDark]}>
//                 سن بیماری
//               </Text>
//               <View style={styles.dropdownValueContainer}>
//                 <Text style={[styles.dropdownValue, isDarkMode && styles.textDark]}>
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
//           />

//           <CustomInput
//             label="کد ملی بیماری"
//             value={formData.nationalId}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, nationalId: text }))}
//             keyboardType="numeric"
//             error={errors.nationalId}
//             maxLength={10}
//           />

//           <View style={styles.uploadSection}>
//             <Text style={[styles.uploadTitle, isDarkMode && styles.textDark]}>
//               مدارک
//             </Text>

//             <TouchableOpacity
//               style={[styles.uploadButton, isDarkMode && styles.uploadButtonDark]}
//               onPress={() => pickDocument('idCardPhoto')}
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
//               onPress={() => pickImage('personalPhoto')}
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
//     <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
//       <View style={styles.stepCard}>
//         <LinearGradient
//           colors={['rgba(240, 147, 251, 0.1)', 'rgba(245, 87, 108, 0.1)']}
//           style={styles.cardGradient}
//         >
//           <View style={styles.sectionHeader}>
//             <Briefcase size={24} color="#f093fb" />
//             <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
//               مطالعه بیماری
//             </Text>
//           </View>

//           <CustomInput
//             label="نام و نام خانوادگی"
//             value={formData.name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//             error={errors.name}
//           />

//           <CustomInput
//             label="شماره تماس"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             keyboardType="phone-pad"
//             error={errors.phone}
//           />

//           <View style={styles.symptomsSection}>
//             <Text style={[styles.symptomsTitle, isDarkMode && styles.textDark]}>
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
//                     isDarkMode && styles.textDark
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
//           />

//           <CustomInput
//             label="شهر"
//             value={formData.city}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
//             error={errors.city}
//           />

//           <CustomInput
//             label="آدرس"
//             value={formData.address}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
//             multiline
//             numberOfLines={3}
//           />

//           <View style={styles.severitySection}>
//             <Text style={[styles.severityTitle, isDarkMode && styles.textDark]}>
//               شدت علائم: {formData.severity}/10
//             </Text>
//             <View style={styles.severityContainer}>
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
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

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />
      
//       {/* Progress Bar */}
//       <View style={styles.progressContainer}>
//         <View style={[styles.progressBar, isDarkMode && styles.progressBarDark]}>
//           <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
//             <LinearGradient
//               colors={steps[currentStep].gradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.progressGradient}
//             />
//           </Animated.View>
//         </View>
        
//         {/* Step Indicators */}
//         <View style={styles.stepsContainer}>
//           {steps.map((step, index) => (
//             <View key={step.id} style={styles.stepIndicator}>
//               <View style={[
//                 styles.stepCircle,
//                 currentStep >= index && styles.stepCircleActive,
//                 isDarkMode && styles.stepCircleDark
//               ]}>
//                 {currentStep > index ? (
//                   <CheckCircle2 size={24} color="#fff" />
//                 ) : (
//                   <step.icon size={20} color={currentStep >= index ? '#fff' : '#999'} />
//                 )}
//               </View>
//               <Text style={[
//                 styles.stepText,
//                 currentStep >= index && styles.stepTextActive,
//                 isDarkMode && styles.textDark
//               ]}>
//                 {step.title}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>
//           {currentStep === 0 && renderStep1()}
//           {currentStep === 1 && renderStep2()}

//           {/* Navigation Buttons */}
//           <View style={styles.navigationButtons}>
//             {currentStep > 0 && (
//               <TouchableOpacity
//                 style={[styles.navButton, styles.backButton]}
//                 onPress={handleBack}
//               >
//                 <ArrowRight size={20} color="#667eea" />
//                 <Text style={styles.backButtonText}>قبلی</Text>
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity
//               style={[styles.navButton, styles.nextButton]}
//               onPress={handleNext}
//             >
//               <LinearGradient
//                 colors={steps[currentStep].gradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.nextButtonGradient}
//               >
//                 <Text style={styles.nextButtonText}>
//                   {currentStep === steps.length - 1 ? 'ذخیره و ارسال' : 'بعدی'}
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
//         onSelect={(value) => setFormData(prev => ({ ...prev, gender: value }))}
//         title="انتخاب جنسیت"
//       />

//       <PickerModal
//         visible={showAgePicker}
//         onClose={() => setShowAgePicker(false)}
//         items={ages}
//         onSelect={(value) => setFormData(prev => ({ ...prev, age: value }))}
//         title="انتخاب سن"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
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
//   progressBar: {
//     height: 6,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   progressBarDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   progressFill: {
//     height: '100%',
//   },
//   progressGradient: {
//     flex: 1,
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
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
//   },
//   dropdownContent: {
//     gap: 8,
//   },
//   dropdownLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
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
//     flex: 1,
//     marginHorizontal: 12,
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
//     gap: 12,
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
//   },
//   symptomCardDark: {
//     backgroundColor: '#2a2a2a',
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
//     gap: 12,
//     marginTop: 24,
//   },
//   navButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   backButton: {
//     borderWidth: 2,
//     borderColor: '#667eea',
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#667eea',
//     marginRight: 8,
//   },
//   nextButton: {
//     flex: 2,
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
//     backgroundColor: '#2a2a2a',
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