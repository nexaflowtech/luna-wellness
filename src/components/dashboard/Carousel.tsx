import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
        decelerationRate="fast"
        snapToInterval={280} // Approx card width
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    marginHorizontal: -24, // Break out of parent padding
  },
  container: {
    paddingHorizontal: 24,
    gap: 16,
  },
});

export default Carousel;
