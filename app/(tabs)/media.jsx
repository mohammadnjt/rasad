
// import { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Modal,
//   Platform,
//   Animated,
//   Dimensions
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useStore } from '../../store/useStore';
// import { translations } from '../../constants/translations';
// import Header from '../../components/Header';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';
// import { 
//   Camera, 
//   Image as ImageIcon, 
//   Upload, 
//   X,
//   Play,
//   FileText,
//   Download,
//   Eye,
//   Clock
// } from 'lucide-react-native';
// import * as ImagePicker from 'expo-image-picker';

// const { width } = Dimensions.get('window');

// export default function MediaScreen() {
//   const { language, isDarkMode } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const [activeTab, setActiveTab] = useState('images');
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//   // Animations
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [activeTab]);

//   // Test Data
//   const testImages = [
//     {
//       id: '1',
//       uri: 'https://picsum.photos/400/400?random=1',
//       title: 'تصویر علائم بیماری',
//       description: 'تصویر مربوط به علائم تب و سرفه',
//       date: '1403/07/20',
//       views: 45
//     },
//     {
//       id: '2',
//       uri: 'https://picsum.photos/400/400?random=2',
//       title: 'نمونه آزمایش',
//       description: 'نتایج آزمایش آزمایشگاهی',
//       date: '1403/07/19',
//       views: 32
//     },
//     {
//       id: '3',
//       uri: 'https://picsum.photos/400/400?random=3',
//       title: 'موقعیت جغرافیایی',
//       description: 'محل شیوع بیماری',
//       date: '1403/07/18',
//       views: 58
//     },
//     {
//       id: '4',
//       uri: 'https://picsum.photos/400/400?random=4',
//       title: 'تصویر رادیولوژی',
//       description: 'نتایج رادیولوژی قفسه سینه',
//       date: '1403/07/17',
//       views: 67
//     },
//   ];

//   const testVideos = [
//     {
//       id: '1',
//       uri: 'https://picsum.photos/400/300?random=10',
//       title: 'ویدیو آموزشی پیشگیری',
//       description: 'روش‌های پیشگیری از بیماری‌های واگیردار',
//       duration: '05:32',
//       date: '1403/07/20',
//       views: 234
//     },
//     {
//       id: '2',
//       uri: 'https://picsum.photos/400/300?random=11',
//       title: 'نحوه استفاده از ماسک',
//       description: 'آموزش صحیح استفاده از ماسک N95',
//       duration: '03:45',
//       date: '1403/07/19',
//       views: 187
//     },
//     {
//       id: '3',
//       uri: 'https://picsum.photos/400/300?random=12',
//       title: 'بررسی علائم',
//       description: 'شناسایی علائم اولیه بیماری',
//       duration: '08:15',
//       date: '1403/07/18',
//       views: 312
//     },
//   ];

//   const testDocuments = [
//     {
//       id: '1',
//       title: 'راهنمای پیشگیری از کووید-19',
//       description: 'مستندات کامل پیشگیری و درمان',
//       fileType: 'PDF',
//       size: '2.4 MB',
//       date: '1403/07/20',
//       downloads: 145
//     },
//     {
//       id: '2',
//       title: 'پروتکل‌های درمانی',
//       description: 'پروتکل‌های به‌روز شده درمان',
//       fileType: 'PDF',
//       size: '1.8 MB',
//       date: '1403/07/19',
//       downloads: 98
//     },
//     {
//       id: '3',
//       title: 'آمار و اطلاعات',
//       description: 'گزارش آماری ماهانه',
//       fileType: 'XLSX',
//       size: '856 KB',
//       date: '1403/07/18',
//       downloads: 76
//     },
//     {
//       id: '4',
//       title: 'دستورالعمل‌های بهداشتی',
//       description: 'دستورالعمل‌های وزارت بهداشت',
//       fileType: 'PDF',
//       size: '3.1 MB',
//       date: '1403/07/17',
//       downloads: 203
//     },
//   ];

//   const tabs = [
//     { id: 'images', label: 'تصاویر', icon: ImageIcon, gradient: ['#667eea', '#764ba2'] },
//     { id: 'videos', label: 'ویدیوها', icon: Play, gradient: ['#f093fb', '#f5576c'] },
//     { id: 'documents', label: 'اسناد', icon: FileText, gradient: ['#4facfe', '#00f2fe'] },
//   ];

//   const categories = [
//     { value: 'symptom', label: 'عکس علائم' },
//     { value: 'evidence', label: 'مدرک تهدید' },
//     { value: 'location', label: 'موقعیت' },
//     { value: 'other', label: 'سایر' },
//   ];

//   const pickImage = async (useCamera = false) => {
//     if (Platform.OS === 'web') {
//       Alert.alert('اطلاعات', 'دوربین/گالری در وب در دسترس نیست');
//       return;
//     }

//     let result;

//     if (useCamera) {
//       const permission = await ImagePicker.requestCameraPermissionsAsync();
//       if (!permission.granted) {
//         Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
//         return;
//       }
//       result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         quality: 0.8,
//       });
//     } else {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permission.granted) {
//         Alert.alert('خطا', 'دسترسی به گالری نیاز است');
//         return;
//       }
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         quality: 0.8,
//       });
//     }

//     if (!result.canceled) {
//       setSelectedMedia(result.assets[0]);
//       setUploadModalVisible(true);
//     }
//   };

//   const handleUpload = () => {
//     if (!description.trim() || !category) {
//       Alert.alert('خطا', 'لطفا تمام فیلدها را پر کنید');
//       return;
//     }

//     setUploadModalVisible(false);
//     setSelectedMedia(null);
//     setDescription('');
//     setCategory('');

//     Alert.alert('موفق', 'فایل با موفقیت بارگذاری شد');
//   };

//   const renderImageItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.imageCard, isDarkMode && styles.imageCardDark]}
//         activeOpacity={0.8}
//       >
//         <Image source={{ uri: item.uri }} style={styles.imageThumb} />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.8)']}
//           style={styles.imageOverlay}
//         >
//           <Text style={styles.imageTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={styles.imageDescription} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.imageFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color="#fff" />
//               <Text style={styles.metaText}>{item.date}</Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Eye size={14} color="#fff" />
//               <Text style={styles.metaText}>{item.views}</Text>
//             </View>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderVideoItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.videoCard, isDarkMode && styles.videoCardDark]}
//         activeOpacity={0.8}
//       >
//         <View style={styles.videoThumbContainer}>
//           <Image source={{ uri: item.uri }} style={styles.videoThumb} />
//           <View style={styles.playButton}>
//             <LinearGradient
//               colors={['rgba(240, 147, 251, 0.9)', 'rgba(245, 87, 108, 0.9)']}
//               style={styles.playButtonGradient}
//             >
//               <Play size={32} color="#fff" fill="#fff" />
//             </LinearGradient>
//           </View>
//           <View style={styles.durationBadge}>
//             <Text style={styles.durationText}>{item.duration}</Text>
//           </View>
//         </View>
//         <View style={styles.videoInfo}>
//           <Text style={[styles.videoTitle, isDarkMode && styles.textDark]} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={[styles.videoDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.videoFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.date}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Eye size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.views}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderDocumentItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.documentCard, isDarkMode && styles.documentCardDark]}
//         activeOpacity={0.8}
//       >
//         <View style={styles.documentIcon}>
//           <LinearGradient
//             colors={['#4facfe', '#00f2fe']}
//             style={styles.documentIconGradient}
//           >
//             <FileText size={32} color="#fff" strokeWidth={2} />
//           </LinearGradient>
//         </View>
//         <View style={styles.documentInfo}>
//           <Text style={[styles.documentTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={[styles.documentDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.documentMeta}>
//             <View style={styles.fileBadge}>
//               <Text style={styles.fileBadgeText}>{item.fileType}</Text>
//             </View>
//             <Text style={[styles.fileSize, isDarkMode && styles.fileSizeDark]}>
//               {item.size}
//             </Text>
//           </View>
//           <View style={styles.documentFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.date}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Download size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.downloads}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.downloadButton}>
//           <Download size={20} color="#667eea" />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'images':
//         return (
//           <FlatList
//             data={testImages}
//             renderItem={renderImageItem}
//             keyExtractor={item => item.id}
//             numColumns={2}
//             key="images-flatlist"
//             contentContainerStyle={styles.imageGrid}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       case 'videos':
//         return (
//           <FlatList
//             data={testVideos}
//             renderItem={renderVideoItem}
//             keyExtractor={item => item.id}
//             key="videos-flatlist"
//             contentContainerStyle={styles.videoList}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       case 'documents':
//         return (
//           <FlatList
//             data={testDocuments}
//             renderItem={renderDocumentItem}
//             keyExtractor={item => item.id}
//             key="documents-flatlist"
//             contentContainerStyle={styles.documentList}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />

//       {/* Tabs */}
//       <View style={[styles.tabsContainer, isDarkMode && styles.tabsContainerDark]}>
//         {tabs.map(tab => {
//           const TabIcon = tab.icon;
//           const isActive = activeTab === tab.id;
//           return (
//             <TouchableOpacity
//               key={tab.id}
//               style={[styles.tab, isActive && styles.tabActive]}
//               onPress={() => setActiveTab(tab.id)}
//               activeOpacity={0.7}
//             >
//               {isActive ? (
//                 <LinearGradient
//                   colors={tab.gradient}
//                   style={styles.tabGradient}
//                 >
//                   <TabIcon size={20} color="#fff" strokeWidth={2.5} />
//                   <Text style={styles.tabTextActive}>{tab.label}</Text>
//                 </LinearGradient>
//               ) : (
//                 <>
//                   <TabIcon size={20} color={isDarkMode ? '#666' : '#999'} />
//                   <Text style={[styles.tabText, isDarkMode && styles.tabTextDark]}>
//                     {tab.label}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionContainer}>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => pickImage(true)}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#667eea', '#764ba2']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <Camera size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>دوربین</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => pickImage(false)}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#f093fb', '#f5576c']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <ImageIcon size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>گالری</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#4facfe', '#00f2fe']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <Upload size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>بارگذاری</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <View style={styles.content}>
//         {renderContent()}
//       </View>

//       {/* Upload Modal */}
//       <Modal
//         visible={uploadModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setUploadModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
//             <View style={styles.modalHeader}>
//               <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
//                 بارگذاری فایل
//               </Text>
//               <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
//                 <X size={24} color={isDarkMode ? '#e0e0e0' : '#333'} />
//               </TouchableOpacity>
//             </View>

//             {selectedMedia && (
//               <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />
//             )}

//             <CustomInput
//               label="توضیحات"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//             />

//             <View style={styles.categoryContainer}>
//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 دسته‌بندی
//               </Text>
//               <View style={styles.categoryButtons}>
//                 {categories.map(cat => (
//                   <TouchableOpacity
//                     key={cat.value}
//                     style={[
//                       styles.categoryButton,
//                       category === cat.value && styles.categoryButtonActive,
//                       isDarkMode && styles.categoryButtonDark,
//                     ]}
//                     onPress={() => setCategory(cat.value)}
//                   >
//                     <Text style={[
//                       styles.categoryButtonText,
//                       category === cat.value && styles.categoryButtonTextActive,
//                     ]}>
//                       {cat.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalActionButton}
//                 onPress={() => setUploadModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>انصراف</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalActionButton}
//                 onPress={handleUpload}
//               >
//                 <LinearGradient
//                   colors={['#667eea', '#764ba2']}
//                   style={styles.uploadButtonGradient}
//                 >
//                   <Text style={styles.uploadButtonText}>بارگذاری</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
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
  
//   // Tabs
//   tabsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 8,
//     gap: 8,
//   },
//   tabsContainerDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   tabActive: {
//     overflow: 'hidden',
//   },
//   tabGradient: {
//     width: '100%',
//     height: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     borderRadius: 12,
//   },
//   tabText: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '600',
//   },
//   tabTextDark: {
//     color: '#666',
//   },
//   tabTextActive: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '700',
//   },
  
//   // Action Buttons
//   actionContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   actionButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     gap: 8,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//   },
  
//   // Content
//   content: {
//     flex: 1,
//   },
  
//   // Images
//   imageGrid: {
//     padding: 8,
//   },
//   imageCard: {
//     flex: 1,
//     margin: 8,
//     aspectRatio: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   imageCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   imageThumb: {
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 12,
//   },
//   imageTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   imageDescription: {
//     fontSize: 11,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 8,
//   },
//   imageFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 11,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   metaTextDark: {
//     fontSize: 11,
//     color: '#666',
//     fontWeight: '500',
//   },
//   metaTextDarkMode: {
//     color: '#999',
//   },
  
//   // Videos
//   videoList: {
//     padding: 16,
//   },
//   videoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   videoCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   videoThumbContainer: {
//     position: 'relative',
//   },
//   videoThumb: {
//     width: '100%',
//     height: 200,
//   },
//   playButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginTop: -32,
//     marginLeft: -32,
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   playButtonGradient: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   durationBadge: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   videoInfo: {
//     padding: 16,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 6,
//   },
//   videoDescription: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 12,
//   },
//   videoDescriptionDark: {
//     color: '#999',
//   },
//   videoFooter: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   textDark: {
//     color: '#e0e0e0',
//   },
  
//   // Documents
//   documentList: {
//     padding: 16,
//   },
//   documentCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   documentCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   documentIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginLeft: 16,
//   },
//   documentIconGradient: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   documentInfo: {
//     flex: 1,
//   },
//   documentTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 6,
//   },
//   documentDescription: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   documentMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   fileBadge: {
//     backgroundColor: '#667eea',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//   },
//   fileBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   fileSize: {
//     fontSize: 11,
//     color: '#666',
//     fontWeight: '500',
//   },
//   fileSizeDark: {
//     color: '#999',
//   },
//   documentFooter: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   downloadButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#f8f9fa',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     padding: 24,
//     maxHeight: '85%',
//   },
//   modalContentDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//   },
//   previewImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 16,
//     marginBottom: 20,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   labelDark: {
//     color: '#e0e0e0',
//   },
//   categoryButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   categoryButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//     backgroundColor: '#f8f9fa',
//   },
//   categoryButtonDark: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#667eea',
//     borderColor: '#667eea',
//   },
//   categoryButtonText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '600',
//   },
//   categoryButtonTextActive: {
//     color: '#fff',
//     fontWeight: '700',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalActionButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#666',
//     textAlign: 'center',
//     paddingVertical: 16,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//     borderRadius: 16,
//   },
//   uploadButtonGradient: {
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });

import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { translations } from '../../constants/translations';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import {
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Play,
  FileText,
  Download,
  Eye,
  Clock,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function MediaScreen() {
  const { language, isDarkMode } = useStore();
  const t = translations[language];
  const isRTL = language === 'fa';

  const [activeTab, setActiveTab] = useState('images');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Animations
  const slideAnim = useRef(new Animated.Value(0)).current; // for translateY
  const fadeAnim = useRef(new Animated.Value(0)).current; // for opacity

  useEffect(() => {
    // Reset initial values
    slideAnim.setValue(1);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 12,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, fadeAnim, slideAnim]);

  // Test data (kept same)
  const testImages = [
    { id: '1', uri: 'https://picsum.photos/400/400?random=1', title: 'تصویر علائم بیماری', description: 'تصویر مربوط به علائم تب و سرفه', date: '1403/07/20', views: 45 },
    { id: '2', uri: 'https://picsum.photos/400/400?random=2', title: 'نمونه آزمایش', description: 'نتایج آزمایش آزمایشگاهی', date: '1403/07/19', views: 32 },
    { id: '3', uri: 'https://picsum.photos/400/400?random=3', title: 'موقعیت جغرافیایی', description: 'محل شیوع بیماری', date: '1403/07/18', views: 58 },
    { id: '4', uri: 'https://picsum.photos/400/400?random=4', title: 'تصویر رادیولوژی', description: 'نتایج رادیولوژی قفسه سینه', date: '1403/07/17', views: 67 },
    { id: '5', uri: 'https://picsum.photos/400/400?random=5', title: 'علائم پوستی', description: 'تصاویر بثورات پوستی مرتبط با بیماری', date: '1403/07/16', views: 29 },
    { id: '6', uri: 'https://picsum.photos/400/400?random=6', title: 'تست تنفسی', description: 'نتایج تست عملکرد ریه', date: '1403/07/15', views: 41 },
    { id: '7', uri: 'https://picsum.photos/400/400?random=7', title: 'تصویر میکروسکوپی', description: 'تصویر ویروس زیر میکروسکوپ', date: '1403/07/14', views: 53 },
    { id: '8', uri: 'https://picsum.photos/400/400?random=8', title: 'نمودار اپیدمی', description: 'نمودار گسترش بیماری در منطقه', date: '1403/07/13', views: 72 },
  ];

  const testVideos = [
    { id: '1', uri: 'https://picsum.photos/400/300?random=10', title: 'ویدیو آموزشی پیشگیری', description: 'روش‌های پیشگیری از بیماری‌های واگیردار', duration: '05:32', date: '1403/07/20', views: 234 },
    { id: '2', uri: 'https://picsum.photos/400/300?random=11', title: 'نحوه استفاده از ماسک', description: 'آموزش صحیح استفاده از ماسک N95', duration: '03:45', date: '1403/07/19', views: 187 },
    { id: '3', uri: 'https://picsum.photos/400/300?random=12', title: 'بررسی علائم', description: 'شناسایی علائم اولیه بیماری', duration: '08:15', date: '1403/07/18', views: 312 },
  ];

  const testDocuments = [
    { id: '1', title: 'راهنمای پیشگیری از کووید-19', description: 'مستندات کامل پیشگیری و درمان', fileType: 'PDF', size: '2.4 MB', date: '1403/07/20', downloads: 145 },
    { id: '2', title: 'پروتکل‌های درمانی', description: 'پروتکل‌های به‌روز شده درمان', fileType: 'PDF', size: '1.8 MB', date: '1403/07/19', downloads: 98 },
    { id: '3', title: 'آمار و اطلاعات', description: 'گزارش آماری ماهانه', fileType: 'XLSX', size: '856 KB', date: '1403/07/18', downloads: 76 },
    { id: '4', title: 'دستورالعمل‌های بهداشتی', description: 'دستورالعمل‌های وزارت بهداشت', fileType: 'PDF', size: '3.1 MB', date: '1403/07/17', downloads: 203 },
  ];

  const tabs = [
    { id: 'images', label: 'تصاویر', icon: ImageIcon, gradient: ['#667eea', '#764ba2'] },
    { id: 'videos', label: 'ویدیوها', icon: Play, gradient: ['#f093fb', '#f5576c'] },
    { id: 'documents', label: 'اسناد', icon: FileText, gradient: ['#4facfe', '#00f2fe'] },
  ];

  const categories = [
    { value: 'symptom', label: 'عکس علائم' },
    { value: 'evidence', label: 'مدرک تهدید' },
    { value: 'location', label: 'موقعیت' },
    { value: 'other', label: 'سایر' },
  ];

  const pickImage = async (useCamera = false) => {
    if (Platform.OS === 'web') {
      Alert.alert('اطلاعات', 'دوربین/گالری در وب در دسترس نیست');
      return;
    }

    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('خطا', 'دسترسی به گالری نیاز است');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });
    }

    // expo-image-picker v14+ returns { canceled: boolean, assets: [...] }
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets[0]);
      setUploadModalVisible(true);
    }
  };

  const handleUpload = () => {
    if (!description.trim() || !category) {
      Alert.alert('خطا', 'لطفا تمام فیلدها را پر کنید');
      return;
    }

    setUploadModalVisible(false);
    setSelectedMedia(null);
    setDescription('');
    setCategory('');

    Alert.alert('موفق', 'فایل با موفقیت بارگذاری شد');
  };

  // Renderers use fadeAnim (opacity) + slideAnim (translateY)
  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 30], // note: reverse because we set slideAnim initial to 1
        }),
      },
    ],
  };

  const renderImageItem = ({ item }) => (
    <Animated.View style={[styles.imageCardWrapper, animatedStyle]}>
      <TouchableOpacity style={[styles.imageCard, isDarkMode && styles.imageCardDark]} activeOpacity={0.85}>
        <Image source={{ uri: item.uri }} style={styles.imageThumb} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.imageOverlay}>
          <Text style={styles.imageTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.imageDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.imageFooter}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#fff" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color="#fff" />
              <Text style={styles.metaText}>{item.views}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderVideoItem = ({ item }) => (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity style={[styles.videoCard, isDarkMode && styles.videoCardDark]} activeOpacity={0.85}>
        <View style={styles.videoThumbContainer}>
          <Image source={{ uri: item.uri }} style={styles.videoThumb} resizeMode="cover" />
          <View style={styles.playButton}>
            <LinearGradient colors={['rgba(240,147,251,0.95)', 'rgba(245,87,108,0.95)']} style={styles.playButtonGradient}>
              <Play size={26} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, isDarkMode && styles.textDark]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.videoDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.videoFooter}>
            <View style={styles.metaItem}>
              <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>{item.views}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDocumentItem = ({ item }) => (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity style={[styles.documentCard, isDarkMode && styles.documentCardDark]} activeOpacity={0.85}>
        <View style={styles.documentIcon}>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.documentIconGradient}>
            <FileText size={28} color="#fff" strokeWidth={2} />
          </LinearGradient>
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.documentDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.documentMeta}>
            <View style={styles.fileBadge}>
              <Text style={styles.fileBadgeText}>{item.fileType}</Text>
            </View>
            <Text style={[styles.fileSize, isDarkMode && styles.fileSizeDark]}>{item.size}</Text>
          </View>
          <View style={styles.documentFooter}>
            <View style={styles.metaItem}>
              <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Download size={14} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>{item.downloads}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color="#667eea" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'images':
        return (
          <FlatList
            data={testImages}
            renderItem={renderImageItem}
            keyExtractor={item => item.id}
            numColumns={2}
            key="images-flatlist"
            contentContainerStyle={styles.imageGrid}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'videos':
        return (
          <FlatList
            data={testVideos}
            renderItem={renderVideoItem}
            keyExtractor={item => item.id}
            key="videos-flatlist"
            contentContainerStyle={styles.videoList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'documents':
        return (
          <FlatList
            data={testDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={item => item.id}
            key="documents-flatlist"
            contentContainerStyle={styles.documentList}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header />

      {/* Tabs */}
      <View style={[styles.tabsContainer, isDarkMode && styles.tabsContainerDark]}>
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.75}
            >
              {isActive ? (
                <LinearGradient colors={tab.gradient} style={styles.tabGradient}>
                  <TabIcon size={18} color="#fff" strokeWidth={2.2} />
                  <Text style={styles.tabTextActive}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInner}>
                  <TabIcon size={18} color={isDarkMode ? '#cfcfcf' : '#999'} />
                  <Text style={[styles.tabText, isDarkMode && styles.tabTextDark]}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)} activeOpacity={0.85}>
          <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionButtonGradient}>
            <Camera size={18} color="#fff" />
            <Text style={styles.actionButtonText}>دوربین</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)} activeOpacity={0.85}>
          <LinearGradient colors={['#f093fb', '#f5576c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionButtonGradient}>
            <ImageIcon size={18} color="#fff" />
            <Text style={styles.actionButtonText}>گالری</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
          <LinearGradient colors={['#4facfe', '#00f2fe']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionButtonGradient}>
            <Upload size={18} color="#fff" />
            <Text style={styles.actionButtonText}>بارگذاری</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Upload Modal */}
      <Modal visible={uploadModalVisible} animationType="slide" transparent={true} onRequestClose={() => setUploadModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>بارگذاری فایل</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <X size={22} color={isDarkMode ? '#e0e0e0' : '#333'} />
              </TouchableOpacity>
            </View>

            {selectedMedia && <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />}

            <CustomInput label="توضیحات" value={description} onChangeText={setDescription} multiline />

            <View style={styles.categoryContainer}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>دسته‌بندی</Text>
              <View style={styles.categoryButtons}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryButton,
                      category === cat.value && styles.categoryButtonActive,
                      isDarkMode && styles.categoryButtonDark,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={[styles.categoryButtonText, category === cat.value && styles.categoryButtonTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalActionButton]} onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.cancelButtonText}>انصراف</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionButton]} onPress={handleUpload}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.uploadButtonGradient}>
                  <Text style={styles.uploadButtonText}>بارگذاری</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const CARD_MARGIN = 8;
const IMAGE_CARD_WIDTH = Math.floor((width - CARD_MARGIN * 3) / 2); // two columns, margins

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', marginBottom: 100 },
  containerDark: { backgroundColor: '#0a0a0a' },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    alignItems: 'center',
  },
  tabsContainerDark: { backgroundColor: '#1a1a1a' },
  tab: {
    flex: 1,
    minHeight: 44,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { overflow: 'hidden' },
  tabGradient: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabInner: { flexDirection: 'row', alignItems: 'center', gap: 6 }, // 'gap' here only for layout, RN 0.71+ may support; if not, use marginLeft on text/icon
  tabText: { fontSize: 12, color: '#999', fontWeight: '600', marginLeft: 8 },
  tabTextDark: { color: '#cfcfcf' },
  tabTextActive: { fontSize: 12, color: '#fff', fontWeight: '700', marginLeft: 8 },

  // Action Buttons
  actionContainer: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  actionButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 12 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8 },

  // Content
  content: { flex: 1 },

  // Images grid
  imageGrid: { paddingHorizontal: CARD_MARGIN, paddingTop: 8, paddingBottom: 24 },
  imageCardWrapper: { margin: CARD_MARGIN / 2 },
  imageCard: {
    width: IMAGE_CARD_WIDTH,
    margin: CARD_MARGIN,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  imageCardDark: { backgroundColor: '#1a1a1a' },
  imageThumb: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  imageTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  imageDescription: { fontSize: 11, color: 'rgba(255,255,255,0.88)', marginBottom: 8 },
  imageFooter: { flexDirection: 'row', justifyContent: 'space-between' },

  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
  metaText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  metaTextDark: { fontSize: 11, color: '#666', fontWeight: '500' },
  metaTextDarkMode: { color: '#999' },

  // Videos
  videoList: { padding: 16 },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  videoCardDark: { backgroundColor: '#1a1a1a' },
  videoThumbContainer: { position: 'relative', width: '100%', aspectRatio: 16 / 9 },
  videoThumb: { width: '100%', height: '100%' },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  playButtonGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  durationBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  videoInfo: { padding: 14 },
  videoTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
  videoDescription: { fontSize: 13, color: '#666', marginBottom: 12 },
  videoDescriptionDark: { color: '#999' },
  videoFooter: { flexDirection: 'row', gap: 16 },

  textDark: { color: '#e0e0e0' },

  // Documents
  documentList: { padding: 16, paddingBottom: 32 },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: width - 32,
  },
  documentCardDark: { backgroundColor: '#1a1a1a' },
  documentIcon: { width: 64, height: 64, borderRadius: 12, overflow: 'hidden', marginLeft: 12 },
  documentIconGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  documentInfo: { flex: 1, marginRight: 8 },
  documentTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 6 },
  documentDescription: { fontSize: 12, color: '#666', marginBottom: 8 },
  documentMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fileBadge: { backgroundColor: '#667eea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  fileBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  fileSize: { fontSize: 11, color: '#666', fontWeight: '500' },
  fileSizeDark: { color: '#999' },
  documentFooter: { flexDirection: 'row', gap: 16 },
  downloadButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '85%' },
  modalContentDark: { backgroundColor: '#1a1a1a' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  previewImage: { width: '100%', height: 200, borderRadius: 14, marginBottom: 14 },
  categoryContainer: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: '#333' },
  labelDark: { color: '#e0e0e0' },
  categoryButtons: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonDark: { backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' },
  categoryButtonActive: { backgroundColor: '#667eea', borderColor: '#667eea' },
  categoryButtonText: { fontSize: 13, color: '#666', fontWeight: '600' },
  categoryButtonTextActive: { color: '#fff', fontWeight: '700' },

  modalActions: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  modalActionButton: { flex: 1, marginHorizontal: 6, borderRadius: 16, overflow: 'hidden' },
  cancelButtonText: { fontSize: 16, fontWeight: '700', color: '#666', textAlign: 'center', paddingVertical: 14, borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 16 },
  uploadButtonGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  uploadButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

// import { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Modal,
//   Platform,
//   Animated,
//   Dimensions
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useStore } from '../../store/useStore';
// import { translations } from '../../constants/translations';
// import Header from '../../components/Header';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';
// import { 
//   Camera, 
//   Image as ImageIcon, 
//   Upload, 
//   X,
//   Play,
//   FileText,
//   Download,
//   Eye,
//   Clock
// } from 'lucide-react-native';
// import * as ImagePicker from 'expo-image-picker';

// const { width } = Dimensions.get('window');

// export default function MediaScreen() {
//   const { language, isDarkMode } = useStore();
//   const t = translations[language];
//   const isRTL = language === 'fa';

//   const [activeTab, setActiveTab] = useState('images');
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//   // Animations
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [activeTab]);

//   // Test Data (Expanded with more images)
//   const testImages = [
//     {
//       id: '1',
//       uri: 'https://picsum.photos/400/400?random=1',
//       title: 'تصویر علائم بیماری',
//       description: 'تصویر مربوط به علائم تب و سرفه',
//       date: '1403/07/20',
//       views: 45
//     },
//     {
//       id: '2',
//       uri: 'https://picsum.photos/400/400?random=2',
//       title: 'نمونه آزمایش',
//       description: 'نتایج آزمایش آزمایشگاهی',
//       date: '1403/07/19',
//       views: 32
//     },
//     {
//       id: '3',
//       uri: 'https://picsum.photos/400/400?random=3',
//       title: 'موقعیت جغرافیایی',
//       description: 'محل شیوع بیماری',
//       date: '1403/07/18',
//       views: 58
//     },
//     {
//       id: '4',
//       uri: 'https://picsum.photos/400/400?random=4',
//       title: 'تصویر رادیولوژی',
//       description: 'نتایج رادیولوژی قفسه سینه',
//       date: '1403/07/17',
//       views: 67
//     },
//     {
//       id: '5',
//       uri: 'https://picsum.photos/400/400?random=5',
//       title: 'علائم پوستی',
//       description: 'تصاویر بثورات پوستی مرتبط با بیماری',
//       date: '1403/07/16',
//       views: 29
//     },
//     {
//       id: '6',
//       uri: 'https://picsum.photos/400/400?random=6',
//       title: 'تست تنفسی',
//       description: 'نتایج تست عملکرد ریه',
//       date: '1403/07/15',
//       views: 41
//     },
//     {
//       id: '7',
//       uri: 'https://picsum.photos/400/400?random=7',
//       title: 'تصویر میکروسکوپی',
//       description: 'تصویر ویروس زیر میکروسکوپ',
//       date: '1403/07/14',
//       views: 53
//     },
//     {
//       id: '8',
//       uri: 'https://picsum.photos/400/400?random=8',
//       title: 'نمودار اپیدمی',
//       description: 'نمودار گسترش بیماری در منطقه',
//       date: '1403/07/13',
//       views: 72
//     },
//   ];

//   const testVideos = [
//     {
//       id: '1',
//       uri: 'https://picsum.photos/400/300?random=10',
//       title: 'ویدیو آموزشی پیشگیری',
//       description: 'روش‌های پیشگیری از بیماری‌های واگیردار',
//       duration: '05:32',
//       date: '1403/07/20',
//       views: 234
//     },
//     {
//       id: '2',
//       uri: 'https://picsum.photos/400/300?random=11',
//       title: 'نحوه استفاده از ماسک',
//       description: 'آموزش صحیح استفاده از ماسک N95',
//       duration: '03:45',
//       date: '1403/07/19',
//       views: 187
//     },
//     {
//       id: '3',
//       uri: 'https://picsum.photos/400/300?random=12',
//       title: 'بررسی علائم',
//       description: 'شناسایی علائم اولیه بیماری',
//       duration: '08:15',
//       date: '1403/07/18',
//       views: 312
//     },
//   ];

//   const testDocuments = [
//     {
//       id: '1',
//       title: 'راهنمای پیشگیری از کووید-19',
//       description: 'مستندات کامل پیشگیری و درمان',
//       fileType: 'PDF',
//       size: '2.4 MB',
//       date: '1403/07/20',
//       downloads: 145
//     },
//     {
//       id: '2',
//       title: 'پروتکل‌های درمانی',
//       description: 'پروتکل‌های به‌روز شده درمان',
//       fileType: 'PDF',
//       size: '1.8 MB',
//       date: '1403/07/19',
//       downloads: 98
//     },
//     {
//       id: '3',
//       title: 'آمار و اطلاعات',
//       description: 'گزارش آماری ماهانه',
//       fileType: 'XLSX',
//       size: '856 KB',
//       date: '1403/07/18',
//       downloads: 76
//     },
//     {
//       id: '4',
//       title: 'دستورالعمل‌های بهداشتی',
//       description: 'دستورالعمل‌های وزارت بهداشت',
//       fileType: 'PDF',
//       size: '3.1 MB',
//       date: '1403/07/17',
//       downloads: 203
//     },
//   ];

//   const tabs = [
//     { id: 'images', label: 'تصاویر', icon: ImageIcon, gradient: ['#667eea', '#764ba2'] },
//     { id: 'videos', label: 'ویدیوها', icon: Play, gradient: ['#f093fb', '#f5576c'] },
//     { id: 'documents', label: 'اسناد', icon: FileText, gradient: ['#4facfe', '#00f2fe'] },
//   ];

//   const categories = [
//     { value: 'symptom', label: 'عکس علائم' },
//     { value: 'evidence', label: 'مدرک تهدید' },
//     { value: 'location', label: 'موقعیت' },
//     { value: 'other', label: 'سایر' },
//   ];

//   const pickImage = async (useCamera = false) => {
//     if (Platform.OS === 'web') {
//       Alert.alert('اطلاعات', 'دوربین/گالری در وب در دسترس نیست');
//       return;
//     }

//     let result;

//     if (useCamera) {
//       const permission = await ImagePicker.requestCameraPermissionsAsync();
//       if (!permission.granted) {
//         Alert.alert('خطا', 'دسترسی به دوربین نیاز است');
//         return;
//       }
//       result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         quality: 0.8,
//       });
//     } else {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permission.granted) {
//         Alert.alert('خطا', 'دسترسی به گالری نیاز است');
//         return;
//       }
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         quality: 0.8,
//       });
//     }

//     if (!result.canceled) {
//       setSelectedMedia(result.assets[0]);
//       setUploadModalVisible(true);
//     }
//   };

//   const handleUpload = () => {
//     if (!description.trim() || !category) {
//       Alert.alert('خطا', 'لطفا تمام فیلدها را پر کنید');
//       return;
//     }

//     setUploadModalVisible(false);
//     setSelectedMedia(null);
//     setDescription('');
//     setCategory('');

//     Alert.alert('موفق', 'فایل با موفقیت بارگذاری شد');
//   };

//   const renderImageItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.imageCard, isDarkMode && styles.imageCardDark]}
//         activeOpacity={0.8}
//       >
//         <Image
//           source={{ uri: item.uri }}
//           style={styles.imageThumb}
//           resizeMode="cover" // Ensure image scales correctly
//         />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.8)']}
//           style={styles.imageOverlay}
//         >
//           <Text style={styles.imageTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={styles.imageDescription} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.imageFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color="#fff" />
//               <Text style={styles.metaText}>{item.date}</Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Eye size={14} color="#fff" />
//               <Text style={styles.metaText}>{item.views}</Text>
//             </View>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderVideoItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.videoCard, isDarkMode && styles.videoCardDark]}
//         activeOpacity={0.8}
//       >
//         <View style={styles.videoThumbContainer}>
//           <Image
//             source={{ uri: item.uri }}
//             style={styles.videoThumb}
//             resizeMode="cover" // Ensure video thumbnail scales correctly
//           />
//           <View style={styles.playButton}>
//             <LinearGradient
//               colors={['rgba(240, 147, 251, 0.9)', 'rgba(245, 87, 108, 0.9)']}
//               style={styles.playButtonGradient}
//             >
//               <Play size={32} color="#fff" fill="#fff" />
//             </LinearGradient>
//           </View>
//           <View style={styles.durationBadge}>
//             <Text style={styles.durationText}>{item.duration}</Text>
//           </View>
//         </View>
//         <View style={styles.videoInfo}>
//           <Text style={[styles.videoTitle, isDarkMode && styles.textDark]} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={[styles.videoDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.videoFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.date}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Eye size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.views}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderDocumentItem = ({ item, index }) => (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{
//           translateY: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [50, 0],
//           })
//         }]
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.documentCard, isDarkMode && styles.documentCardDark]}
//         activeOpacity={0.8}
//       >
//         <View style={styles.documentIcon}>
//           <LinearGradient
//             colors={['#4facfe', '#00f2fe']}
//             style={styles.documentIconGradient}
//           >
//             <FileText size={32} color="#fff" strokeWidth={2} />
//           </LinearGradient>
//         </View>
//         <View style={styles.documentInfo}>
//           <Text style={[styles.documentTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={[styles.documentDescription, isDarkMode && styles.videoDescriptionDark]} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.documentMeta}>
//             <View style={styles.fileBadge}>
//               <Text style={styles.fileBadgeText}>{item.fileType}</Text>
//             </View>
//             <Text style={[styles.fileSize, isDarkMode && styles.fileSizeDark]}>
//               {item.size}
//             </Text>
//           </View>
//           <View style={styles.documentFooter}>
//             <View style={styles.metaItem}>
//               <Clock size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.date}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Download size={14} color={isDarkMode ? '#999' : '#666'} />
//               <Text style={[styles.metaTextDark, isDarkMode && styles.metaTextDarkMode]}>
//                 {item.downloads}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.downloadButton}>
//           <Download size={20} color="#667eea" />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'images':
//         return (
//           <FlatList
//             data={testImages}
//             renderItem={renderImageItem}
//             keyExtractor={item => item.id}
//             numColumns={2}
//             key="images-flatlist"
//             contentContainerStyle={styles.imageGrid}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       case 'videos':
//         return (
//           <FlatList
//             data={testVideos}
//             renderItem={renderVideoItem}
//             keyExtractor={item => item.id}
//             key="videos-flatlist"
//             contentContainerStyle={styles.videoList}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       case 'documents':
//         return (
//           <FlatList
//             data={testDocuments}
//             renderItem={renderDocumentItem}
//             keyExtractor={item => item.id}
//             key="documents-flatlist"
//             contentContainerStyle={styles.documentList}
//             showsVerticalScrollIndicator={false}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       <Header />

//       {/* Tabs */}
//       <View style={[styles.tabsContainer, isDarkMode && styles.tabsContainerDark]}>
//         {tabs.map(tab => {
//           const TabIcon = tab.icon;
//           const isActive = activeTab === tab.id;
//           return (
//             <TouchableOpacity
//               key={tab.id}
//               style={[styles.tab, isActive && styles.tabActive]}
//               onPress={() => setActiveTab(tab.id)}
//               activeOpacity={0.7}
//             >
//               {isActive ? (
//                 <LinearGradient
//                   colors={tab.gradient}
//                   style={styles.tabGradient}
//                 >
//                   <TabIcon size={20} color="#fff" strokeWidth={2.5} />
//                   <Text style={styles.tabTextActive}>{tab.label}</Text>
//                 </LinearGradient>
//               ) : (
//                 <>
//                   <TabIcon size={20} color={isDarkMode ? '#666' : '#999'} />
//                   <Text style={[styles.tabText, isDarkMode && styles.tabTextDark]}>
//                     {tab.label}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionContainer}>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => pickImage(true)}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#667eea', '#764ba2']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <Camera size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>دوربین</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => pickImage(false)}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#f093fb', '#f5576c']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <ImageIcon size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>گالری</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#4facfe', '#00f2fe']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.actionButtonGradient}
//           >
//             <Upload size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>بارگذاری</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <View style={styles.content}>
//         {renderContent()}
//       </View>

//       {/* Upload Modal */}
//       <Modal
//         visible={uploadModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setUploadModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
//             <View style={styles.modalHeader}>
//               <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
//                 بارگذاری فایل
//               </Text>
//               <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
//                 <X size={24} color={isDarkMode ? '#e0e0e0' : '#333'} />
//               </TouchableOpacity>
//             </View>

//             {selectedMedia && (
//               <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />
//             )}

//             <CustomInput
//               label="توضیحات"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//             />

//             <View style={styles.categoryContainer}>
//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 دسته‌بندی
//               </Text>
//               <View style={styles.categoryButtons}>
//                 {categories.map(cat => (
//                   <TouchableOpacity
//                     key={cat.value}
//                     style={[
//                       styles.categoryButton,
//                       category === cat.value && styles.categoryButtonActive,
//                       isDarkMode && styles.categoryButtonDark,
//                     ]}
//                     onPress={() => setCategory(cat.value)}
//                   >
//                     <Text style={[
//                       styles.categoryButtonText,
//                       category === cat.value && styles.categoryButtonTextActive,
//                     ]}>
//                       {cat.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalActionButton}
//                 onPress={() => setUploadModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>انصراف</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalActionButton}
//                 onPress={handleUpload}
//               >
//                 <LinearGradient
//                   colors={['#667eea', '#764ba2']}
//                   style={styles.uploadButtonGradient}
//                 >
//                   <Text style={styles.uploadButtonText}>بارگذاری</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
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
  
//   // Tabs
//   tabsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 8,
//     gap: 8,
//   },
//   tabsContainerDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   tabActive: {
//     overflow: 'hidden',
//   },
//   tabGradient: {
//     width: '100%',
//     height: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     borderRadius: 12,
//   },
//   tabText: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '600',
//   },
//   tabTextDark: {
//     color: '#666',
//   },
//   tabTextActive: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '700',
//   },
  
//   // Action Buttons
//   actionContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   actionButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     gap: 8,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//   },
  
//   // Content
//   content: {
//     flex: 1,
//   },
  
//   // Images
//   imageGrid: {
//     padding: 8,
//   },
//   imageCard: {
//     width: (width - 32) / 2, // Constrain width for 2-column grid
//     margin: 8,
//     aspectRatio: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   imageCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   imageThumb: {
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 12,
//   },
//   imageTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   imageDescription: {
//     fontSize: 11,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 8,
//   },
//   imageFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 11,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   metaTextDark: {
//     fontSize: 11,
//     color: '#666',
//     fontWeight: '500',
//   },
//   metaTextDarkMode: {
//     color: '#999',
//   },
  
//   // Videos
//   videoList: {
//     padding: 16,
//   },
//   videoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   videoCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   videoThumbContainer: {
//     position: 'relative',
//     width: '100%',
//     aspectRatio: 16 / 9, // Standard video aspect ratio
//   },
//   videoThumb: {
//     width: '100%',
//     height: '100%',
//   },
//   playButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginTop: -32,
//     marginLeft: -32,
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   playButtonGradient: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   durationBadge: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   videoInfo: {
//     padding: 16,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 6,
//   },
//   videoDescription: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 12,
//   },
//   videoDescriptionDark: {
//     color: '#999',
//   },
//   videoFooter: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   textDark: {
//     color: '#e0e0e0',
//   },
  
//   // Documents
//   documentList: {
//     padding: 16,
//   },
//   documentCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//     width: width - 32, // Constrain width to screen width minus padding
//   },
//   documentCardDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   documentIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginLeft: 16,
//   },
//   documentIconGradient: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   documentInfo: {
//     flex: 1,
//     marginRight: 8, // Prevent content from stretching too far
//   },
//   documentTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 6,
//   },
//   documentDescription: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   documentMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   fileBadge: {
//     backgroundColor: '#667eea',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//   },
//   fileBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   fileSize: {
//     fontSize: 11,
//     color: '#666',
//     fontWeight: '500',
//   },
//   fileSizeDark: {
//     color: '#999',
//   },
//   documentFooter: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   downloadButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#f8f9fa',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     padding: 24,
//     maxHeight: '85%',
//   },
//   modalContentDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//   },
//   previewImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 16,
//     marginBottom: 20,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   labelDark: {
//     color: '#e0e0e0',
//   },
//   categoryButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   categoryButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//     backgroundColor: '#f8f9fa',
//   },
//   categoryButtonDark: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#3a3a3a',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#667eea',
//     borderColor: '#667eea',
//   },
//   categoryButtonText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '600',
//   },
//   categoryButtonTextActive: {
//     color: '#fff',
//     fontWeight: '700',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalActionButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#666',
//     textAlign: 'center',
//     paddingVertical: 16,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//     borderRadius: 16,
//   },
//   uploadButtonGradient: {
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });