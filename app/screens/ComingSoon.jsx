import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ComingSoon = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F3F8F8]">
      <LinearGradient
        colors={['#E7F6F5', '#F8FBFB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 px-5"
      >
        <View className="flex-row items-center justify-between pt-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#101828" />
          </TouchableOpacity>

        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-full max-w-[360px] rounded-[24px] bg-white border border-[#DCE7E7] p-5 items-center">
            <LottieView
              source={require('../../assets/comming.json')}
              autoPlay
              loop
              style={{ width: 240, height: 240 }}
            />

            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[28px] text-center mt-2">
              Coming Soon
            </Text>

            <Text
              style={{ fontFamily: 'Inter-Regular' }}
              className="text-[#4A5565] text-[15px] text-center leading-[22px] mt-3"
            >
              We are building something exciting for you. This feature will be available very soon.
            </Text>

            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-6 bg-[#008E96] rounded-[14px] px-6 py-3"
            >
              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-white text-[15px]">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ComingSoon;
