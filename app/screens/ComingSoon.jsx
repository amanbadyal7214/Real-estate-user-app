import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const ComingSoon = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F3F8F8]">
      <LinearGradient
        colors={['#E7F6F5', '#F8FBFB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
        style={{ paddingHorizontal: wp('5.3%') }}
      >
        <View className="flex-row items-center justify-between" style={{ paddingTop: hp('1%') }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('2.1%') }}>
            <Ionicons name="arrow-back" size={wp('6.4%')} color="#101828" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <View
            className="w-full bg-white border border-[#DCE7E7] items-center"
            style={{ maxWidth: wp('96%'), borderRadius: wp('6.4%'), padding: wp('5.3%') }}
          >
            <LottieView
              source={require('../../assets/comming.json')}
              autoPlay
              loop
              style={{ width: wp('64%'), height: wp('64%') }}
            />

            <Text
              style={{ fontWeight: '700', fontSize: wp('7.5%'), marginTop: hp('1%') }}
              className="text-[#101828] text-center"
            >
              Coming Soon
            </Text>

            <Text
              style={{ fontWeight: '400', fontSize: wp('4%'), lineHeight: wp('5.9%'), marginTop: hp('1.5%') }}
              className="text-[#4A5565] text-center"
            >
              We are building something exciting for you. This feature will be available very soon.
            </Text>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-[#008E96]"
              style={{ marginTop: hp('3%'), paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.7%') }}
            >
              <Text style={{ fontWeight: '500', fontSize: wp('4%') }} className="text-white">
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
