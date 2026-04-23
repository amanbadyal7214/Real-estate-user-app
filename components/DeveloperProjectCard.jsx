import { FontAwesome } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

const DeveloperProjectCard = ({ 
  image, 
  logo, 
  logoText, 
  logoColor = "#E7000B",
  title, 
  developerName, 
  rating, 
  config, 
  location, 
  priceRange 
}) => {
  return (
    <View 
      className="bg-white rounded-[20px] mb-2 overflow-hidden mr-4"
      style={{
        width: 292.5,
        height: 308.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* Property Image */}
      <Image 
        source={{ uri: image }} 
        style={{ width: '100%', height: 160 }}
        resizeMode="cover"
      />

      {/* Content Container */}
      <View className="p-4 flex-1 justify-between">
        {/* Header: Logo, Title, Rating */}
        <View className="flex-row items-start gap-2">
          {/* Developer Logo */}
          <View className="bg-[#F3F4F6] w-8 h-8 rounded-[10px] items-center justify-center">
            {logo ? (
              <Image source={{ uri: logo }} className="w-6 h-6" resizeMode="contain" />
            ) : (
              <Text 
                className="font-inter-black text-[10px]" 
                style={{ color: logoColor }}
              >
                {logoText}
              </Text>
            )}
          </View>

          {/* Title & Developer Info */}
          <View className="flex-1">
            <Text className="font-inter-bold text-[15px] text-[#101828] leading-[22px]" numberOfLines={1}>
              {title}
            </Text>
            <Text className="font-inter-regular text-[11px] text-[#6A7282] leading-[16px]" numberOfLines={1}>
              rated by {developerName}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center gap-1">
            <FontAwesome name="star" size={12} color="#00A63E" />
            <Text className="font-inter-semibold text-[11px] text-[#101828]">{rating}</Text>
          </View>
        </View>

        {/* Property Details */}
        <View style={{ gap: 2 }}>
          <Text className="font-inter-regular text-[11px] text-[#4A5565] leading-[16px]">
            {config}
          </Text>
          <Text className="font-inter-regular text-[11px] text-[#4A5565] leading-[16px]">
            {location}
          </Text>
        </View>

        {/* Price Range */}
        <Text className="font-inter-bold text-[15px] text-[#101828] leading-[22px]">
          {priceRange}
        </Text>
      </View>
    </View>
  );
};

export default DeveloperProjectCard;
