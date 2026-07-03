import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const validatePasswordRules = (password = "") => {
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_+=\/\\[\]~`]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return {
    hasMinLength,
    hasCapital,
    hasNumber,
    hasSpecial,
    hasLetter,
    isValid: hasMinLength && hasCapital && hasNumber && hasSpecial && hasLetter
  };
};

const PasswordValidator = ({ password = "" }) => {
  const rules = validatePasswordRules(password);

  const renderRule = (label, isMet) => (
    <View key={label} className="flex-row items-center w-[48%] mb-1">
      <Ionicons 
        name={isMet ? "checkmark-circle" : "ellipse-outline"} 
        size={hp('1.8%')} 
        color={isMet ? "#10B981" : "#9CA3AF"} 
      />
      <Text 
        className={`ml-1.5 ${isMet ? "text-gray-700 font-bold" : "text-gray-400"}`}
        style={{ fontFamily: isMet ? 'Inter-Medium' : 'Inter-Regular', fontSize: hp('1.35%') }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <View className="mt-2 px-2.5 bg-gray-50 rounded-lg py-2 border border-gray-100">
      <View className="flex-row flex-wrap justify-between">
        {renderRule("8+ characters", rules.hasMinLength)}
        {renderRule("1 capital letter", rules.hasCapital)}
        {renderRule("1 number (0-9)", rules.hasNumber)}
        {renderRule("1 special char (@$!%)", rules.hasSpecial)}
      </View>
    </View>
  );
};

export default PasswordValidator;
