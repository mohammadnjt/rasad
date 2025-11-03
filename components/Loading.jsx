import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useStore } from '../store/useStore';

const SimpleLoading = ({ message = "در حال بارگذاری..." }) => {
  const { isDarkMode } = useStore();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    animation.start();
    
    // Cleanup function
    return () => {
      animation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[
      styles.simpleContainer,
      isDarkMode && styles.simpleContainerDark
    ]}>
      <Animated.View
        style={[
          styles.simpleSpinner,
          {
            transform: [{ rotate }],
            borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            borderTopColor: isDarkMode ? '#667eea' : '#667eea',
          }
        ]}
      />
      <Text style={[
        styles.simpleText,
        isDarkMode && styles.simpleTextDark
      ]}>
        {message}
      </Text>
    </View>
  );
};

const ElegantLoading = ({ message = "در حال بارگذاری..." }) => {
  const { isDarkMode } = useStore();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // انیمیشن پیشرفت
    const progressAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    // انیمیشن چرخش
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    progressAnimation.start();
    rotateAnimation.start();

    // Cleanup
    return () => {
      progressAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[
      styles.container,
      isDarkMode && styles.containerDark
    ]}>
      <View style={[
        styles.content,
        isDarkMode && styles.contentDark
      ]}>
        {/* اسپینر دایره‌ای */}
        <View style={[
          styles.spinnerContainer,
          isDarkMode && styles.spinnerContainerDark
        ]}>
          <Animated.View
            style={[
              styles.spinner,
              {
                transform: [{ rotate }],
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderTopColor: isDarkMode ? '#667eea' : '#667eea',
              }
            ]}
          />
        </View>

        {/* متن لودینگ */}
        <Text style={[
          styles.text,
          isDarkMode && styles.textDark
        ]}>
          {message}
        </Text>

        {/* نوار پیشرفت */}
        <View style={[
          styles.progressBar,
          isDarkMode && styles.progressBarDark
        ]}>
          <Animated.View
            style={[
              styles.progressFill,
              { width },
              isDarkMode && styles.progressFillDark
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const DotWaveLoading = ({ message = "در حال بارگذاری" }) => {
  const { isDarkMode } = useStore();
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1Anim, 0);
    const anim2 = createAnimation(dot2Anim, 200);
    const anim3 = createAnimation(dot3Anim, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const getDotStyle = (anim) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.4],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  const dotColor = isDarkMode ? '#667eea' : '#667eea';

  return (
    <View style={styles.dotContainer}>
      <View style={styles.dotsWrapper}>
        <Animated.View 
          style={[
            styles.dot, 
            getDotStyle(dot1Anim),
            { backgroundColor: dotColor }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            getDotStyle(dot2Anim),
            { backgroundColor: dotColor }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            getDotStyle(dot3Anim),
            { backgroundColor: dotColor }
          ]} 
        />
      </View>
      <Text style={[
        styles.dotText,
        isDarkMode && styles.dotTextDark
      ]}>
        {message}
      </Text>
    </View>
  );
};

// استایل‌ها
const styles = StyleSheet.create({
  // استایل‌های SimpleLoading
  simpleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  simpleContainerDark: {
    backgroundColor: 'transparent',
  },
  simpleSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    marginBottom: 16,
  },
  simpleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  simpleTextDark: {
    color: '#94a3b8',
  },

  // استایل‌های ElegantLoading
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 200,
  },
  contentDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  spinnerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  spinnerContainerDark: {
    backgroundColor: 'transparent',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 20,
    textAlign: 'center',
  },
  textDark: {
    color: '#e2e8f0',
  },
  progressBar: {
    width: 150,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  progressFillDark: {
    backgroundColor: '#764ba2',
  },

  // استایل‌های DotWaveLoading
  dotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  dotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  dotTextDark: {
    color: '#94a3b8',
  },
});

// کامپوننت اصلی
export default function Loading({ type = "simple", message }) {
  switch (type) {
    case "elegant":
      return <ElegantLoading message={message} />;
    case "dots":
      return <DotWaveLoading message={message} />;
    case "simple":
    default:
      return <SimpleLoading message={message} />;
  }
}

// هوک برای استفاده آسان
export const useLoading = () => {
  return {
    Loading,
    ElegantLoading,
    SimpleLoading,
    DotWaveLoading
  };
};