// import { Tabs } from 'expo-router';
// import { Hop as Home, Heart, FileText, Bookmark, Image as ImageIcon } from 'lucide-react-native';
// import { useStore } from '../../store/useStore';
// import { useEffect } from 'react';

// export default function TabLayout() {
//   const { isDarkMode, loadPersistedData } = useStore();

//   useEffect(() => {
//     loadPersistedData();
//   }, []);

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#007BFF',
//         tabBarInactiveTintColor: isDarkMode ? '#999' : '#666',
//         tabBarStyle: {
//           backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
//           borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
//           height: 60,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'خانه',
//           tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="public-health"
//         options={{
//           title: 'سلامت عمومی',
//           tabBarIcon: ({ size, color }) => <Heart size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="covid-symptoms"
//         options={{
//           title: 'علایم',
//           tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="saved"
//         options={{
//           title: 'ذخیره شده',
//           tabBarIcon: ({ size, color }) => <Bookmark size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="media"
//         options={{
//           title: 'رسانه',
//           tabBarIcon: ({ size, color }) => <ImageIcon size={size} color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }


import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { 
  Home, 
  Heart, 
  FileText, 
  Bookmark, 
  Image as ImageIcon,
  Activity,
  Stethoscope,
  ClipboardList,
  BookMarked,
  Camera
} from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; // expo install expo-blur

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  const { isDarkMode } = useStore();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animatedValues.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: state.index === index ? 1 : 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const getIconComponent = (routeName) => {
    const iconMap = {
      'index': Home,
      'public-health': Activity,
      'covid-symptoms': Stethoscope,
      'saved': BookMarked,
      'media': Camera,
    };
    return iconMap[routeName] || Home;
  };

  const getGradientColors = (index, isActive) => {
    const gradients = [
      ['#667eea', '#764ba2'], // خانه
      ['#f093fb', '#f5576c'], // سلامت
      ['#4facfe', '#00f2fe'], // علایم
      ['#43e97b', '#38f9d7'], // ذخیره
      ['#fa709a', '#fee140'], // رسانه
    ];
    
    if (!isActive) {
      return isDarkMode 
        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']
        : ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)'];
    }
    
    return gradients[index] || gradients[0];
  };

  return (
    <BlurView
      intensity={isDarkMode ? 50 : 80}
      tint={isDarkMode ? 'dark' : 'light'}
      style={styles.tabBarContainer}
    >
      <View style={[
        styles.tabBar,
        isDarkMode && styles.tabBarDark
      ]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;
          const Icon = getIconComponent(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const scale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.85, 1],
          });

          const translateY = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -4],
          });

          const iconScale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.tabItemContent,
                  {
                    transform: [
                      { scale },
                      { translateY },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={getGradientColors(index, isFocused)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.iconContainer,
                    isFocused && styles.iconContainerActive,
                  ]}
                >
                  <Animated.View
                    style={{
                      transform: [{ scale: iconScale }],
                    }}
                  >
                    <Icon
                      size={24}
                      color={isFocused ? '#ffffff' : (isDarkMode ? '#999' : '#666')}
                      strokeWidth={isFocused ? 2.5 : 2}
                    />
                  </Animated.View>
                </LinearGradient>

                {isFocused && (
                  <Animated.View
                    style={[
                      styles.activeIndicator,
                      {
                        opacity: animatedValues[index],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={getGradientColors(index, true)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.indicatorGradient}
                    />
                  </Animated.View>
                )}

                <Animated.Text
                  style={[
                    styles.tabLabel,
                    isDarkMode && styles.tabLabelDark,
                    isFocused && styles.tabLabelActive,
                    {
                      opacity: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1],
                      }),
                    },
                  ]}
                >
                  {label}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

export default function TabLayout() {
  const { isDarkMode, loadPersistedData } = useStore();

  useEffect(() => {
    loadPersistedData();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'خانه',
        }}
      />
      <Tabs.Screen
        name="public-health"
        options={{
          title: 'سلامت عمومی',
        }}
      />
      <Tabs.Screen
        name="covid-symptoms"
        options={{
          title: 'علایم',
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'ذخیره شده',
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'رسانه',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBarDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainerActive: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelDark: {
    color: '#999',
  },
  tabLabelActive: {
    fontWeight: '700',
    color: '#333',
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    width: 32,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 2,
  },
});