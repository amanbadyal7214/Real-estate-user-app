import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Mic, Target } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PGSearch = () => {
  const popularLocalities = [
    { id: 1, name: 'Kharar' },
    { id: 2, name: 'Sector 115' },
    { id: 3, name: 'Sector 116' },
  ];



  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 pt-2">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full justify-center items-start"
        >
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>

        <View className="mt-4 mb-6">
          <Text className="font-inter-regular text-[15px] text-[#4A5565] mb-1">
            You are looking to Pg in
          </Text>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Text className="font-inter-bold text-[22px] text-[#101828]">
              Select Locality or Landmark in Mohali
            </Text>
            <ChevronDown size={22} color="#101828" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center px-4 h-12 bg-[#F3F4F6] rounded-[12px]">
            <TextInput
              placeholder="Locality, Landmark, Project..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 font-inter-regular text-[15px] color-[#101828]"
            />
            <TouchableOpacity className="w-9 h-9 items-center justify-center bg-transparent">
              <Mic size={20} color="#008E96" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Location CTA */}
        <TouchableOpacity className="flex-row items-center px-4 py-3 gap-2 border-b border-[#E4E7EC]">
          <Target size={20} color="#008E96" />
          <Text className="font-inter-medium text-[15px] text-[#008E96]">
            Use my current location
          </Text>
        </TouchableOpacity>

        {/* Popular Localities Section */}
        <View className="mt-6">
          <Text className="px-4 font-inter-medium text-[14px] text-[#9CA3AF] mb-1">
            Popular Localities
          </Text>
          {popularLocalities.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push('/screens/PG/PG')}
              className="flex-row justify-between items-center px-4 py-4 border-b border-[#E4E7EC]"
            >
              <Text className="font-inter-medium text-[16px] text-[#101828]">{item.name}</Text>
              <Text className="font-inter-medium text-[14px] text-[#9CA3AF]">Locality</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity className="flex-row items-center justify-end px-4 py-3 gap-1">
            <Text className="font-inter-medium text-[14px] text-[#008E96]">more</Text>
            <ChevronDown size={16} color="#008E96" />
          </TouchableOpacity>
        </View>

     
      </ScrollView>
    </SafeAreaView>
  );
};

export default PGSearch;
