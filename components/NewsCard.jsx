import React from 'react';
import { View, Text, Image } from 'react-native';

const NewsCard = ({ image, title, meta, description }) => {
  return (
    <View 
      className="bg-white mr-4 mb-2 mt-1"
      style={{
        width: 338,
        height: 304,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden'
      }}
    >
      <View style={{ width: '100%', height: 167 }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
        <Text 
          className="font-inter-bold text-[#101828] mb-2" 
          style={{ fontSize: 15, lineHeight: 19 }}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282] mb-2" 
          style={{ fontSize: 12, lineHeight: 18 }}
        >
          {meta}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#4A5565]" 
          style={{ fontSize: 12, lineHeight: 20 }}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default NewsCard;
