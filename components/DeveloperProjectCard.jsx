import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const formatSafeLabel = (val) => {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed || /^[a-f0-9]{24}$/i.test(trimmed)) return '';
    return trimmed;
  }
  if (typeof val === 'object') {
    return val.name || val.label || val.title || '';
  }
  return '';
};

const formatSafeLocation = (loc) => {
  if (!loc) return 'Location not available';
  if (typeof loc === 'string' && !loc.includes('[object Object]')) {
    return loc;
  }
  if (typeof loc === 'object') {
    const parts = [
      formatSafeLabel(loc.addressLine1 || loc.localityName || loc.locality),
      formatSafeLabel(loc.city || loc.district),
      formatSafeLabel(loc.state),
    ].filter(Boolean);
    const uniqueParts = parts.filter((part, idx) => parts.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === idx);
    return uniqueParts.join(', ') || 'Location not available';
  }
  return String(loc);
};

const formatSafeConfig = (cfg) => {
  if (!cfg) return 'Project';
  if (typeof cfg === 'object') return cfg.label || cfg.name || 'Project';
  return String(cfg);
};

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
        width: wp('53%'),
        height: hp('26%'),
        borderRadius: wp('3.8%'),
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
        style={{ width: '100%', height: hp('13.5%') }}
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
                className="font-black" 
                style={{ fontSize: wp('2.7%'), color: logoColor }}
              >
                {logoText}
              </Text>
            )}
          </View>

          {/* Title & Developer Info */}
          <View style={{ flex: 1 }}>
            <Text className="font-bold text-[#101828]" style={{ fontSize: wp('3.4%'), lineHeight: hp('2.3%') }} numberOfLines={1}>
              {title}
            </Text>
            <Text className="font-normal text-[#6A7282]" style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }} numberOfLines={1}>
              rated by {developerName}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center" style={{ gap: wp('1.1%') }}>
            <FontAwesome name="star" size={wp('2.8%')} color="#00A63E" />
            <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('2.5%') }}>{rating}</Text>
          </View>
        </View>

        {/* Property Details */}
        <View style={{ gap: hp('0.2%') }}>
          <Text
            className="font-normal text-[#4A5565]"
            style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatSafeConfig(config)}
          </Text>
          <Text
            className="font-normal text-[#4A5565]"
            style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatSafeLocation(location)}
          </Text>
        </View>

        {/* Price Range */}
        <Text className="font-bold text-[#101828]" style={{ fontSize: wp('3.4%'), lineHeight: hp('2.3%') }}>
          {priceRange}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeveloperProjectCard;
