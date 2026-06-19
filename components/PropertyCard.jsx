import { useRouter } from 'expo-router';
import { Heart, MessageSquare } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BHKCard = ({ config, area, price }) => {
  return (
    <View className="bg-white border border-[#E4E7EC]" style={{ width: wp('32%'), height: hp('15.8%'), padding: wp('3.2%'), borderRadius: wp('3.2%'), marginRight: wp('3.2%') }}>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.7%'), lineHeight: hp('2.2%') }} className="text-[#101828]">{config}</Text>
      <View style={{ marginTop: hp('0.7%') }}>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), lineHeight: hp('1.8%') }} className="text-[#6A7282]">Super Builtup Area</Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2%') }} className="text-[#4A5565]">{area}</Text>
      </View>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.7%'), lineHeight: hp('2.2%'), marginTop: hp('0.7%') }} className="text-[#101828]">{price}</Text>
    </View>
  );
};

const PropertyCard = ({ property }) => {
  const router = useRouter();
  if (!property) return null;

  const projectId =
    property.projectId ||
    property.project?._id ||
    property.project?.id ||
    property._id ||
    property.id;

  const navigateToDetails = () => {
    router.push({
      pathname: '/screens/ProjectDetails',
      params: { projectId }
    });
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={navigateToDetails}
      className="bg-white self-center w-full border-2 border-primary"
      style={{
        borderRadius: wp('4.3%'),
        padding: wp('2.7%'),
        marginBottom: hp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {/* Image Section */}
      <View className="relative overflow-hidden" style={{ height: hp('18.5%'), borderRadius: wp('3.7%') }}>
        <Image 
          source={{ uri: property.image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* RERA Badge */}
        {property.reraCertified && (
          <View className="absolute bg-primary flex-row items-center" style={{ left: wp('3.2%'), top: hp('1.5%'), borderRadius: wp('2.1%'), paddingHorizontal: wp('2.7%'), paddingVertical: hp('0.5%'), gap: wp('1.6%') }}>
            <View className="bg-white rounded-full items-center justify-center" style={{ width: wp('3.7%'), height: wp('3.7%') }}>
              <View className="bg-primary rounded-full" style={{ width: wp('2.1%'), height: wp('2.1%') }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.9%') }} className="text-white tracking-widest">RERA</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity className="absolute bg-white/90 rounded-full items-center justify-center" style={{ right: wp('3.2%'), top: hp('1.5%'), width: wp('9.6%'), height: wp('9.6%') }}>
          <Heart size={wp('5.3%')} color="#4A5565" />
        </TouchableOpacity>

        {/* Image Count & Indicator */}
        <View className="absolute bg-black/60 flex-row items-center" style={{ left: wp('3.2%'), bottom: hp('1.5%'), borderRadius: wp('2.1%'), paddingHorizontal: wp('2.7%'), paddingVertical: hp('0.5%'), gap: wp('1.6%') }}>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-white">1/{property.imageCount}</Text>
          <View className="flex-row" style={{ gap: wp('1.1%') }}>
            <View className="bg-white rounded-full" style={{ width: wp('1.1%'), height: wp('1.1%') }} />
            <View className="bg-white/40 rounded-full" style={{ width: wp('1.1%'), height: wp('1.1%') }} />
            <View className="bg-white/40 rounded-full" style={{ width: wp('1.1%'), height: wp('1.1%') }} />
          </View>
        </View>
      </View>

      {/* Property Details */}
      <View style={{ marginTop: hp('1.5%') }}>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%'), lineHeight: hp('1.8%') }} className="text-[#6A7282]">
          Possession by {property.possessionDate} • Avg. rate/sq.ft. {property.avgRate}
        </Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('6.1%'), lineHeight: hp('3.6%'), marginTop: hp('1%') }} className="text-[#101828]">
          {property.projectName}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: hp('2.2%'), marginTop: hp('0.5%') }} className="text-[#4A5565]">
          {property.location}
        </Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%'), lineHeight: hp('2.7%'), marginTop: hp('1%') }} className="text-[#101828]">
          {property.priceRange}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2%'), marginTop: hp('1%') }} className="text-[#4A5565]">
          {property.bhkFlats}
        </Text>

        {/* BHK Configuration Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: hp('1.5%') }}
          contentContainerStyle={{ paddingRight: wp('4.3%') }}
        >
          {property.configurations?.map((config, index) => (
            <BHKCard 
              key={index}
              config={config.type} 
              area={config.area} 
              price={config.price} 
            />
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row" style={{ marginTop: hp('2%'), gap: wp('3.2%') }}>
          <TouchableOpacity className="flex-1 flex-row justify-center items-center bg-primary/10" style={{ height: hp('5.9%'), borderRadius: wp('3.2%'), gap: wp('2.1%') }}>
            <MessageSquare size={wp('5.3%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-primary">Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 justify-center items-center bg-primary" style={{ height: hp('5.9%'), borderRadius: wp('3.2%'), elevation: 2 }}>
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-white">Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
