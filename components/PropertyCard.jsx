import { useRouter } from 'expo-router';
import { Heart, MessageSquare } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BHKCard = ({ config, area, price }) => {
  return (
    <View className="bg-white border border-[#E4E7EC]" style={{ width: wp('27%'), height: hp('13.5%'), padding: wp('2.7%'), borderRadius: wp('2.7%'), marginRight: wp('2.7%') }}>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.2%'), lineHeight: hp('1.9%') }} className="text-[#101828]">{config}</Text>
      <View style={{ marginTop: hp('0.5%') }}>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('2.7%'), lineHeight: hp('1.6%') }} className="text-[#6A7282]">Super Builtup Area</Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3%'), lineHeight: hp('1.7%') }} className="text-[#4A5565]">{area}</Text>
      </View>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.2%'), lineHeight: hp('1.9%'), marginTop: hp('0.5%') }} className="text-[#101828]">{price}</Text>
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
        borderRadius: wp('3.7%'),
        padding: wp('2.3%'),
        marginBottom: hp('1.7%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {/* Image Section */}
      <View className="relative overflow-hidden" style={{ height: hp('15.7%'), borderRadius: wp('3.2%') }}>
        <Image 
          source={{ uri: property.image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* RERA Badge */}
        {property.reraCertified && (
          <View className="absolute bg-primary flex-row items-center" style={{ left: wp('2.7%'), top: hp('1.2%'), borderRadius: wp('1.8%'), paddingHorizontal: wp('2.3%'), paddingVertical: hp('0.4%'), gap: wp('1.4%') }}>
            <View className="bg-white rounded-full items-center justify-center" style={{ width: wp('3.2%'), height: wp('3.2%') }}>
              <View className="bg-primary rounded-full" style={{ width: wp('1.8%'), height: wp('1.8%') }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.5%') }} className="text-white tracking-widest">RERA</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity className="absolute bg-white/90 rounded-full items-center justify-center" style={{ right: wp('2.7%'), top: hp('1.2%'), width: wp('8.2%'), height: wp('8.2%') }}>
          <Heart size={wp('4.5%')} color="#4A5565" />
        </TouchableOpacity>

        {/* Image Count & Indicator */}
        <View className="absolute bg-black/60 flex-row items-center" style={{ left: wp('2.7%'), bottom: hp('1.2%'), borderRadius: wp('1.8%'), paddingHorizontal: wp('2.3%'), paddingVertical: hp('0.4%'), gap: wp('1.4%') }}>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('2.7%') }} className="text-white">1/{property.imageCount}</Text>
          <View className="flex-row" style={{ gap: wp('1%') }}>
            <View className="bg-white rounded-full" style={{ width: wp('1%'), height: wp('1%') }} />
            <View className="bg-white/40 rounded-full" style={{ width: wp('1%'), height: wp('1%') }} />
            <View className="bg-white/40 rounded-full" style={{ width: wp('1%'), height: wp('1%') }} />
          </View>
        </View>
      </View>

      {/* Property Details */}
      <View style={{ marginTop: hp('1.2%') }}>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('2.7%'), lineHeight: hp('1.6%') }} className="text-[#6A7282]">
          Possession by {property.possessionDate} • Avg. rate/sq.ft. {property.avgRate}
        </Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('5.2%'), lineHeight: hp('3%'), marginTop: hp('0.8%') }} className="text-[#101828]">
          {property.projectName}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%'), lineHeight: hp('1.9%'), marginTop: hp('0.4%') }} className="text-[#4A5565]">
          {property.location}
        </Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.1%'), lineHeight: hp('2.3%'), marginTop: hp('0.8%') }} className="text-[#101828]">
          {property.priceRange}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3%'), lineHeight: hp('1.7%'), marginTop: hp('0.8%') }} className="text-[#4A5565]">
          {property.bhkFlats}
        </Text>

        {/* BHK Configuration Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: hp('1.2%') }}
          contentContainerStyle={{ paddingRight: wp('3.7%') }}
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
        <View className="flex-row" style={{ marginTop: hp('1.7%'), gap: wp('2.7%') }}>
          <TouchableOpacity className="flex-1 flex-row justify-center items-center bg-primary/10" style={{ height: hp('5%'), borderRadius: wp('2.7%'), gap: wp('1.8%') }}>
            <MessageSquare size={wp('4.5%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-primary">Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 justify-center items-center bg-primary" style={{ height: hp('5%'), borderRadius: wp('2.7%'), elevation: 2 }}>
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-white">Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
