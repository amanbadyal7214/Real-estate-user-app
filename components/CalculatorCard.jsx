import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const CalculatorCard = ({ titlePrefix, description, vectorsConfig }) => {
  return (
    <View 
      style={{
        width: 233.33,
        height: 269.33,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#D4A574',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginRight: 12,
        marginBottom: 8,
        marginTop: 2
      }}
    >
      <Text 
        className="font-inter-bold"
        style={{
          position: 'absolute',
          left: 16.67,
          top: 16.67,
          fontSize: 16,
          lineHeight: 24,
          color: '#8B6F47'
        }}
      >
        {titlePrefix}
      </Text>
      
      <Text 
        className="font-inter-bold"
        style={{
          position: 'absolute',
          left: 16.67,
          top: 44.67,
          fontSize: 16,
          lineHeight: 24,
          color: '#8B6F47'
        }}
      >
        Calculator
      </Text>
      
      <Text 
        className="font-inter-regular"
        style={{
          position: 'absolute',
          left: 16.67,
          top: 76.67,
          fontSize: 12,
          lineHeight: 18,
          color: '#6A7282',
          width: 200,
          height: 36
        }}
        numberOfLines={2}
      >
        {description}
      </Text>

      {/* Illustration Container */}
      <View 
        style={{
          position: 'absolute',
          width: 200,
          height: 80,
          left: 16.67,
          top: 124.67
        }}
      >
        {/* Render dynamic vectors passed via config */}
        {vectorsConfig.map((v, i) => (
          <View 
            key={i}
            style={{
              position: 'absolute',
              left: `${v.left}%`,
              right: `${v.right}%`,
              top: `${v.top}%`,
              bottom: `${v.bottom}%`,
              backgroundColor: v.background || 'transparent',
              borderWidth: v.borderWidth || 0,
              borderColor: v.borderColor || 'transparent',
              borderTopLeftRadius: v.roundedTop ? 100 : 0,
              borderTopRightRadius: v.roundedTop ? 100 : 0
            }}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          width: 36,
          height: 36,
          left: 180.67,
          top: 216.67,
          backgroundColor: '#D4A574',
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ChevronRight size={20} color="#FFFFFF" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
};

export default CalculatorCard;
