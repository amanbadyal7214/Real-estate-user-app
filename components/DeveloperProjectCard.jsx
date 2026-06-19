import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
  priceRange,
  projectId
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => router.push({ pathname: '/screens/ProjectDetails', params: { projectId } })}
      className="bg-white overflow-hidden"
      style={{
        width: wp('62.4%'),
        height: hp('30.4%'),
        borderRadius: wp('4.3%'),
        marginBottom: hp('1%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
        elevation: 2,
      }}
    >
      {/* Property Image */}
      <Image 
        source={{ uri: image }} 
        style={{ width: '100%', height: hp('15.8%') }}
        resizeMode="cover"
      />

      {/* Content Container */}
      <View className="flex-1 justify-between" style={{ padding: wp('3.2%') }}>
        {/* Header: Logo, Title, Rating */}
        <View className="flex-row items-start" style={{ gap: wp('2.1%') }}>
          {/* Developer Logo */}
          <View className="bg-[#F3F4F6] items-center justify-center" style={{ width: wp('8.5%'), height: wp('8.5%'), borderRadius: wp('2.7%') }}>
            {logo ? (
              <Image source={{ uri: logo }} style={{ width: wp('6.4%'), height: wp('6.4%') }} resizeMode="contain" />
            ) : (
              <Text 
                className="font-inter-black" 
                style={{ fontSize: wp('2.7%'), color: logoColor }}
              >
                {logoText}
              </Text>
            )}
          </View>

          {/* Title & Developer Info */}
          <View className="flex-1">
            <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('4%'), lineHeight: hp('2.7%') }} numberOfLines={1}>
              {title}
            </Text>
            <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }} numberOfLines={1}>
              rated by {developerName}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center" style={{ gap: wp('1.1%') }}>
            <FontAwesome name="star" size={wp('3.2%')} color="#00A63E" />
            <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('2.9%') }}>{rating}</Text>
          </View>
        </View>

        {/* Property Details */}
        <View style={{ gap: hp('0.2%') }}>
          <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>
            {config}
          </Text>
          <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>
            {location}
          </Text>
        </View>

        {/* Price Range */}
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('4%'), lineHeight: hp('2.7%') }}>
          {priceRange}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeveloperProjectCard;
