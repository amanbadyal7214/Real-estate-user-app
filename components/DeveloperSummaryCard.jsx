import { Image, Text, TouchableOpacity, View } from 'react-native';

const DeveloperSummaryCard = ({ logo, logoText, name, yearEstd, projectCount, logoColor = '#E7000B', onPress, isActive }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`bg-white border ${isActive ? 'border-primary' : 'border-[#F3F4F6]'} rounded-[16px] p-3 items-center justify-center`}
      style={{
        width: 160,
        height: 136.33,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Logo Container */}
      <View className="h-12 items-center justify-center mb-1">
        {logo ? (
          <Image source={{ uri: logo }} style={{ width: 40, height: 40 }} resizeMode="contain" />
        ) : (
          <Text 
            className="font-inter-black" 
            style={{ fontSize: 20, color: logoColor, lineHeight: 30 }}
          >
            {logoText || (name ? name.substring(0, 1) : 'D')}
          </Text>
        )}
      </View>

      {/* Developer Name */}
      <Text 
        className="font-inter-semibold text-[#101828] text-center mb-3"
        style={{ fontSize: 13, lineHeight: 20 }}
      >
        {name}
      </Text>

      {/* Stats Row */}
      <View className="flex-row items-center justify-center gap-3">
        <View className="items-center">
          <Text className="font-inter-semibold text-[#101828] text-[11px] leading-[16.5px]">
            {yearEstd}
          </Text>
          <Text className="font-inter-regular text-[#4A5565] text-[10px] leading-[15px]">
            Year estd.
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-inter-semibold text-[#101828] text-[11px] leading-[16.5px]">
            {projectCount}
          </Text>
          <Text className="font-inter-regular text-[#4A5565] text-[10px] leading-[15px]">
            Project
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeveloperSummaryCard;
