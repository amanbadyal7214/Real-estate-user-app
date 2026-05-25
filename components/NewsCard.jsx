import { Image, Text, TouchableOpacity, View } from 'react-native';

const NewsCard = ({ image, title, meta, description }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="bg-white mr-4 mb-2 mt-1"
      style={{
        width: 272,
        height: 240,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden'
      }}
    >
      <View style={{ width: '100%', height: 128 }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 }}>
        <Text 
          className="font-inter-bold text-[#101828] mb-1" 
          style={{ fontSize: 14, lineHeight: 18 }}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282] mb-1" 
          style={{ fontSize: 11, lineHeight: 16 }}
        >
          {meta}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#4A5565]" 
          style={{ fontSize: 11, lineHeight: 18 }}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
