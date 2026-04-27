import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, MapPin, Mic, Search, TrendingUp } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RentSearch = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full border border-gray-100"
          >
            <ArrowLeft size={20} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[18px] text-[#101828]">Buy</Text>
        </View>

        <TouchableOpacity className="flex-row items-center bg-white px-3 py-1.5 rounded-xl border border-gray-100 gap-1.5">
          <MapPin size={16} color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#4A5565]">Mohali</Text>
          <ChevronRight size={14} color="#6A7282" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Bar */}
        <View className="mx-4 my-2 px-4 h-11 flex-row items-center bg-white/40 border-2 border-[#008E96]/30 rounded-full">
          <Search size={18} color="#6A7282" />
          <TextInput 
            placeholder="Locality, Landmark, Project..."
            placeholderTextColor="#6A7282"
            style={{ fontFamily: 'Inter-Regular' }}
            className="flex-1 ml-3 text-[14px] text-[#101828]"
          />
          <Mic size={18} color="#008E96" />
        </View>

        {/* Popular Localities Section */}
        <View className="mx-4 mt-4 p-4 rounded-3xl bg-[#EDFBFA]">
          <View className="flex-row items-center gap-2 mb-3">
            <TrendingUp size={16} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">Popular Localities</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {[
              { name: 'Kharar', price: '₹6.2K/sq.ft.' },
              { name: 'Zirakpur', price: '₹7.5K/sq.ft.' },
              { name: 'Sector 125', price: '₹8.9K/sq.ft.' },
              { name: 'Derabassi', price: '₹5.4K/sq.ft.' },
            ].map((locality, index) => (
              <TouchableOpacity 
                key={index}
                className="w-[140px] p-3 mr-3 bg-[#F7F9FA] border border-[#E4E7EC] rounded-2xl shadow-sm"
              >
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828] mb-1">{locality.name}</Text>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#6A7282]">{locality.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Landmarks Section */}
        <View className="mt-6">
          <View className="flex-row items-center px-4 gap-2 mb-4">
            <MapPin size={16} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">Popular Landmarks</Text>
          </View>
          
          <View className="flex-row flex-wrap px-4 gap-2">
            {[
              'City Heart', 'Maxim Merry School', 'Mohali Stadium', 
              'Phase 11 Market', 'ISB Campus'
            ].map((landmark, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center px-4 py-2.5 bg-white border border-[#E4E7EC] rounded-full gap-2"
              >
                <MapPin size={14} color="#008E96" />
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[13px] text-[#4A5565]">{landmark}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={() => router.push('/screens/Rent/Rent')}
          className="mx-4 my-10 p-4 flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20 rounded-2xl"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 bg-white items-center justify-center rounded-full border border-gray-100">
               <ArrowLeft size={16} color="#008E96" style={{ transform: [{ rotate: '180deg'}] }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={20} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RentSearch;
