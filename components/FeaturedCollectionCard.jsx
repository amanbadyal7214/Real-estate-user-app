import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FeaturedCollectionCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const collections = [
    {
      id: 1,
      title: 'Ready to Move-In',
      image: { uri: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop' },
      bgColor: 'bg-[#B4C2C9]',
    },
    {
      id: 2,
      title: 'Luxury',
      image: { uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
      bgColor: 'bg-[#A69480]',
    },
    {
      id: 3,
      title: 'Townships',
      image: { uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
      bgColor: 'bg-[#5B646E]',
    },
  ];

  const handlePress = () => {
    if (isExpanded) return; // Prevent closing on click
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(true);
  };

  return (
    <View className="px-4 py-6">
      <View className="mb-4">
        <Text className="font-inter-bold text-[20px] text-[#101828]">Featured Collections</Text>
        <Text className="font-inter-regular text-[14px] text-[#667085]">Category suited to your property needs</Text>
      </View>

      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handlePress}
        disabled={isExpanded} // Disable the TouchableOpacity once expanded
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={isExpanded}
          contentContainerStyle={{
            paddingHorizontal: isExpanded ? 16 : 0,
            flexDirection: 'row',
            minWidth: isExpanded ? 'auto' : 600,
          }}
        >
          <View 
            className="flex-row" 
            style={{ 
              height: 350, 
              width: isExpanded ? undefined : 600,
            }}
          >
            {collections.map((item, index) => {
              // index 0 (Ready to Move-In): 0
              // index 1 (Luxury): 100 (leaves 100px of index 0 visible -> ~33%)
              // index 2 (Townships): 220 (leaves 120px of index 1 visible -> ~40%)
              // All cards are now more visible in the stack
              const leftPos = isExpanded ? 0 : (index === 0 ? 0 : (index === 1 ? 100 : 220));
              
              return (
                <View
                  key={item.id}
                  className={`rounded-[30px] overflow-hidden ${isExpanded ? 'mr-4' : ''}`}
                  style={{
                    width: isExpanded ? 280 : 300,
                    position: isExpanded ? 'relative' : 'absolute',
                    left: leftPos,
                    zIndex: index,
                    height: '100%',
                    transform: [{ scale: 1 }],
                    borderWidth: isExpanded ? 0 : 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Image
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/20" />
                  <View className="absolute top-6 left-6 right-6">
                    <Text className="font-inter-bold text-[22px] text-white leading-[28px]">
                      {item.title.split(' ').map((word, i) => (
                        <React.Fragment key={i}>
                          {word}{'\n'}
                        </React.Fragment>
                      ))}
                    </Text>
                    <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center mt-3">
                      <Ionicons name="chevron-forward" size={16} color="white" />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </TouchableOpacity>
    </View>
  );
};

export default FeaturedCollectionCard;
