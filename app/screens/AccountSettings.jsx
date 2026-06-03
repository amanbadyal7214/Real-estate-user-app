import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, UserMinus, UserX } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountSettings = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header Back Button */}
      <View className="px-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title */}
        <Text
          style={{ fontFamily: 'Inter-Bold' }}
          className="text-[#101828] text-[28px]  mt-4 mb-8"
        >
          Account Settings
        </Text>

        {/* Deactivate Section */}
        <View className="mb-8">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <UserMinus size={22} color="#008E96" strokeWidth={2} />
              <Text
                style={{ fontFamily: 'Inter-SemiBold' }}
                className="text-[#008E96] text-[18px] font-semibold"
              >
                Deactivate my account
              </Text>
            </View>
            <ChevronRight size={20} color="#008E96" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'Inter-Regular', lineHeight: 22 }}
            className="text-[#4A5565] text-[14px] mt-2 font-normal"
          >
            Deactivating an account means temporarily disabling your account without permanently deleting it.Your profile and content may be hidden from other users.The platform usually keeps your data and account information stored.{"\n\n"}You can typically reactivate the account later by logging back in.
          </Text>
        </View>

        {/* Delete Section */}
        <View className="mb-8">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <UserX size={22} color="#008E96" strokeWidth={2} />
              <Text
                style={{ fontFamily: 'Inter-SemiBold' }}
                className="text-[#008E96] text-[18px] font-semibold"
              >
                Delete my account
              </Text>
            </View>
            <ChevronRight size={20} color="#008E96" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'Inter-Regular', lineHeight: 22 }}
            className="text-[#4A5565] text-[14px] mt-2 font-normal"
          >
            Deleting an account means permanently removing your account from a platform.Once deleted, you may lose access to your profile, data, and settings.In many cases, deleted accounts cannot be recovered after a certain period.This action is usually irreversible and removes your presence from the service.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Terms & Conditions */}
      <View className="py-6 items-center justify-center bg-white">
        <TouchableOpacity activeOpacity={0.7}>
          <Text
            style={{ fontFamily: 'Inter-Medium' }}
            className="text-[#008E96] text-[14px] font-medium"
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettings;
