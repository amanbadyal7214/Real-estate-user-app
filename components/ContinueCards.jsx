import { router } from 'expo-router';
import { ChevronRight, History } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ContinueCards = ({ data = [] }) => {
  if (data.length === 0) return null;

  return (
    <>
    <View style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('3%') }}>
      <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
        <History size={wp('5.3%')} color="#667085" />
        <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#4A5565]">
          Pick up where you left off
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => {
              if (item.id) {
                router.push({
                  pathname: '/screens/PropertyDetails',
                  params: { propertyId: item.id }
                });
              } else {
                router.push('/screens/PropertyDetails');
              }
            }}
            className="bg-white border border-[#EAECF0] flex-row items-center justify-between"
            style={{ padding: wp('3.2%'), borderRadius: wp('3.8%'), width: wp('52%'), marginRight: wp('3.2%') }}
          >
            <View className="flex-1" style={{ marginRight: wp('2.1%') }}>
              <Text 
                numberOfLines={1} 
                style={{ fontWeight: '700', fontSize: wp('3.5%') }} 
                className="text-[#101828]"
              >
                {item.title}
              </Text>
              <Text 
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontWeight: '400', fontSize: wp('3%'), marginTop: hp('0.3%') }} 
                className="text-[#667085]"
              >
                {item.subtitle}
              </Text>
            </View>
            <ChevronRight size={wp('5.3%')} color="#008E96" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
    </View>
     {/* Locality Banner */}
        {/* <View className="bg-[#F0FBFA] flex-row items-center justify-between" style={{ marginHorizontal: wp('4.3%'), marginTop: hp('3%'), padding: wp('4.3%'), borderRadius: wp('4.3%') }}>
          <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#344054]">Not sure about locality?</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text style={{ fontWeight: '700', fontSize: wp('3.7%'), marginRight: wp('1.1%') }} className="text-[#101828] underline">Explore options</Text>
            <ChevronRight size={wp('4.3%')} color="#101828" />
          </TouchableOpacity>
        </View> */}
    </>
  );
};

export default ContinueCards;
