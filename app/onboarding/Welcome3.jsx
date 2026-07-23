import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome3 = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 px-8 pt-4">
        {/* Header: Logo + Skip */}
        <View className="flex-row items-center justify-between mb-10">
          <Image
            source={require('../../assets/images/icon3.jpeg')}
            style={{ width: 150, height: 40 }}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => router.replace('/(auth)/Login')}>
            <Text className="text-[#99A1AF] text-md font-normal">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Illustration Container */}
        <View className="flex-1 justify-center items-center mb-10">
          <Image
            source={require('../../assets/images/c3.png')}
            className="w-full h-[313px]"
            resizeMode="contain"
          />
        </View>

        {/* Content Container */}
        <View className="pb-10 items-center">
          {/* Heading */}
          <Text className="text-[25px] font-bold text-[#101828] text-center leading-[30px] mb-4">
            Book with Confidence
          </Text>

          {/* Description */}
          <Text className="text-[15px] text-[#6A7282] text-center font-normal leading-[23px] mb-10 px-12">
            Secure booking process with instant confirmation and verified properties
          </Text>

          {/* Pagination Dots */}
          <View className="flex-row gap-2 mb-10">
            <View className="w-2 h-2 bg-[#E5E7EB] rounded-full" />
            <View className="w-2 h-2 bg-[#E5E7EB] rounded-full" />
            <View className="w-8 h-2 bg-primary rounded-full" />
          </View>

          {/* Next Button */}
          <View
            style={{
              width: '100%',
              shadowColor: '#DFFFFD',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              className="w-full h-14 items-center justify-center flex-row"
              style={{
                borderRadius: 14,
                backgroundColor: '#008E96',
                shadowColor: '#9ADDD9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 6,
                elevation: 4,
              }}
              activeOpacity={0.8}
              onPress={() => router.replace('/(auth)/onboard')}
            >
              <Text className="text-white text-lg font-bold mr-2 ml-4">Get Started</Text>
              <ChevronRight color="white" size={20} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome3;