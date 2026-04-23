import React from 'react';
import { View, Text, Image } from 'react-native';

const LastSearchedCard = ({ image, price, title, builder, location }) => {
  return (
    <View 
      className="bg-white mr-3 pb-2 mb-2 mt-1"
      style={{
        width: 209,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <View style={{ width: '100%', height: 165, borderRadius: 24, overflow: 'hidden' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16, flex: 1, justifyContent: 'flex-start' }}>
        <Text 
          className="font-inter-bold text-[#101828] mb-1" 
          style={{ fontSize: 15, lineHeight: 22 }}
          numberOfLines={1}
        >
          {price}
        </Text>
        
        <Text 
          className="font-inter-semibold text-[#101828] mb-2" 
          style={{ fontSize: 15, lineHeight: 22 }}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282] mb-[2px]" 
          style={{ fontSize: 12, lineHeight: 18 }}
          numberOfLines={1}
        >
          {builder}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282]" 
          style={{ fontSize: 12, lineHeight: 18 }}
          numberOfLines={1}
        >
          {location}
        </Text>
      </View>
    </View>
  );
};

export default LastSearchedCard;
