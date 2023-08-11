import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const Toast = ({ message, onDismiss }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (message) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(onDismiss);
      }, 3000);
    }
  }, [message]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
  },
});

export default Toast;
