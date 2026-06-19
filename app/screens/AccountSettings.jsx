import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, UserMinus, UserX } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountSettings = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header Back Button */}
      <View style={{ paddingHorizontal: wp('5.3%'), paddingTop: hp('1.5%') }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center"
          style={{ width: wp('10.6%'), height: wp('10.6%'), marginLeft: -wp('2%') }}
        >
          <ArrowLeft size={wp('6.4%')} color="#101828" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: wp('5.3%') }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('4.9%') }}
      >
        {/* Title */}
        <Text
          style={{ fontFamily: 'Inter-Bold', fontSize: wp('7.5%'), marginTop: hp('2%'), marginBottom: hp('3.9%') }}
          className="text-[#101828]"
        >
          Account Settings
        </Text>

        {/* Deactivate Section */}
        <View style={{ marginBottom: hp('3.9%') }}>
          <TouchableOpacity
            className="flex-row items-center justify-between"
            style={{ paddingVertical: hp('1%') }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
              <UserMinus size={wp('5.9%')} color="#008E96" strokeWidth={2} />
              <Text
                style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.8%') }}
                className="text-[#008E96]"
              >
                Deactivate my account
              </Text>
            </View>
            <ChevronRight size={wp('5.3%')} color="#008E96" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginTop: hp('1%') }}
            className="text-[#4A5565]"
          >
            Deactivating an account means temporarily disabling your account without permanently deleting it.Your profile and content may be hidden from other users.The platform usually keeps your data and account information stored.{"\n\n"}You can typically reactivate the account later by logging back in.
          </Text>
        </View>

        {/* Delete Section */}
        <View style={{ marginBottom: hp('3.9%') }}>
          <TouchableOpacity
            className="flex-row items-center justify-between"
            style={{ paddingVertical: hp('1%') }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
              <UserX size={wp('5.9%')} color="#008E96" strokeWidth={2} />
              <Text
                style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.8%') }}
                className="text-[#008E96]"
              >
                Delete my account
              </Text>
            </View>
            <ChevronRight size={wp('5.3%')} color="#008E96" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginTop: hp('1%') }}
            className="text-[#4A5565]"
          >
            Deleting an account means permanently removing your account from a platform.Once deleted, you may lose access to your profile, data, and settings.In many cases, deleted accounts cannot be recovered after a certain period.This action is usually irreversible and removes your presence from the service.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Terms & Conditions */}
      <View className="items-center justify-center bg-white" style={{ paddingVertical: hp('2.9%') }}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }}
            className="text-[#008E96]"
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettings;
