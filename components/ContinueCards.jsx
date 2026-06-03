import { router } from 'expo-router';
import { ChevronRight, History } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ContinueCards = ({ data = [] }) => {
  if (data.length === 0) return null;

  return (
    <>
    <View className="px-4 mt-6">
      <View className="flex-row items-center gap-2 mb-4">
        <History size={20} color="#667085" />
        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#4A5565]">
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
            className="bg-white border border-[#EAECF0] p-3 rounded-2xl w-[224px] mr-3 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-2">
              <Text 
                numberOfLines={1} 
                style={{ fontFamily: 'Inter-Bold' }} 
                className="text-[15px] text-[#101828]"
              >
                {item.title}
              </Text>
              <Text 
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontFamily: 'Inter-Regular' }} 
                className="text-[13px] text-[#667085] mt-1"
              >
                {item.subtitle}
              </Text>
            </View>
            <ChevronRight size={20} color="#008E96" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
    </View>
     {/* Locality Banner */}
        {/* <View className="mx-4 mt-6 p-4 rounded-2xl bg-[#F0FBFA] flex-row items-center justify-between">
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#344054]">Not sure about locality?</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[14px] text-[#101828] underline mr-1">Explore options</Text>
            <ChevronRight size={16} color="#101828" />
          </TouchableOpacity>
        </View> */}
    </>
  );
};

export default ContinueCards;
