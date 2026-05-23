import { Image, Text, TouchableOpacity, View } from 'react-native';

const SellerCard = ({
  name,
  experienceYears,
  propertiesCount,
  avatar,
  tags = ['Commercial', 'Verified'],
  onPressContact,
}) => {
  return (
    <View
      className="bg-white border border-[#E4E7EC] rounded-2xl"
      style={{
        width: '100%',
        minHeight: 145,
        paddingTop: 13,
        paddingHorizontal: 13,
        paddingBottom: 10,
        gap: 10,
      }}
    >
      <View className="flex-row items-start" style={{ gap: 10 }}>
        <Image
          source={{
            uri:
              avatar ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          }}
          className="w-10 h-10 rounded-full"
          resizeMode="cover"
        />

        <View className="flex-1" style={{ gap: 2 }}>
          <Text className="font-inter-semibold text-[14px] leading-5 text-[#101828]">
            {name}
          </Text>
          <Text className="font-inter-regular text-[12px] leading-4 text-[#6A7282]">
            {experienceYears} years exp • {propertiesCount} properties
          </Text>
        </View>
      </View>

      <View className="flex-row" style={{ gap: 8 }}>
        {tags.map((tag) => (
          <View key={tag} className="bg-[#F3F4F6] rounded-md px-[10px] py-1">
            <Text className="font-inter-regular text-[12px] leading-[18px] text-[#4A5565]">
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onPressContact}
        activeOpacity={0.8}
        className="h-10 rounded-[10px] border-2 border-[#008E96] items-center justify-center"
      >
        <Text className="font-inter-semibold text-[14px] leading-[21px] text-[#008E96]">
          Show Contact
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SellerCard;