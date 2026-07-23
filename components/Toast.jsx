import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ message, type = 'success', onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (message) {
      // Animate In
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate Out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message]);

  if (!message) return null;

  let bgClass = 'bg-[#ECFDF5] border-[#A7F3D0]';
  let textClass = 'text-[#064E3B]';
  let iconName = 'checkmark-circle';
  let iconColor = '#10B981';

  if (type === 'error') {
    bgClass = 'bg-[#FEF2F2] border-[#FEE2E2]';
    textClass = 'text-[#7F1D1D]';
    iconName = 'alert-circle';
    iconColor = '#EF4444';
  } else if (type === 'warning' || type === 'info') {
    bgClass = 'bg-[#FFFBEB] border-[#FEF3C7]';
    textClass = 'text-[#78350F]';
    iconName = 'information-circle';
    iconColor = '#F59E0B';
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: 99999,
        elevation: 99,
      }}
    >
      <View
        className={`flex-row items-center border-[1px] p-4 rounded-2xl shadow-md ${bgClass}`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 99,
        }}
      >
        <Ionicons name={iconName} size={22} color={iconColor} />
        <Text 
          className={`ml-3 flex-1 text-[13px] leading-5 ${textClass}`}
          style={{ fontWeight: '500' }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
