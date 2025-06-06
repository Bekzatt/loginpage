import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Добро пожаловать в Money Talks!🎉',
    description: 'Я Раушан Итжанова, создатель этого приложения, и рада видеть тебя среди финансово осознанных людей!',
    showBulletPoints: false,
    background: require('../../assets/images/image.png')
  },
  {
    key: '2',
    title: 'Добро пожаловать в Money Talks!🎉',
    description: '💰 Здесь ты сможешь:',
    bulletPoints: [
      'Понять, куда уходят деньги и как управлять личными финансами',
      'Ставить и достигать финансовые цели (пенсия, образование, путешествия).',
      'Инвестировать и увеличивать капитал.',
      'Автоматизировать финансы и получить чёткий финансовый план.'
    ],
    showBulletPoints: true,
    background: require('../../assets/images/image.png')
  },
  {
    key: '3',
    title: 'Добро пожаловать в Money Talks!🎉',
    description: '📊 Давай начнём! 🚀 Выбери свою первую цель и сделай шаг к финансовой свободе.',
    showBulletPoints: false,
    background: require('../../assets/images/image.png')
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const renderItem = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.slide, { opacity }]}>
        <ImageBackground
          source={item.background}
          style={styles.backgroundImage}
          resizeMode="contain"
        >
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {item.showBulletPoints && item.bulletPoints && (
              <View style={styles.bulletContainer}>
                {item.bulletPoints.map((point, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ImageBackground>
      </Animated.View>
    );
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/login');
  };

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      {/* Индикатор слайдов */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  width: dotWidth,
                  opacity
                },
                currentIndex === index && styles.activeIndicator
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSkip}>
        <Text style={styles.buttonText}>Начать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
  },
  time: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'Roboto-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bulletContainer: {
    marginLeft: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bulletText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Roboto-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
});