import { useRouter } from "expo-router";
import { ChevronDown, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const UserHeader = ({ userName = "Guest!" }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
      <View className="flex-row items-center gap-2">
        <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
          <User color="white" size={20} />
        </View>
        <View className="flex-row items-center">
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828]">Hi {userName}</Text>
          <ChevronDown size={18} color="#101828" className="ml-1" />
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => router.push("/screens/PostProperty/Register")}
        className="flex-row items-center bg-[#F2F4F7] px-4 py-2 rounded-full h-10"
      >
        <Text className="font-inter-medium text-[13px] text-[#101828] mr-2">Post Property</Text>
        <View className="bg-primary px-1.5 py-0.5 rounded-md">
          <Text className="font-inter-bold text-[9px] text-white">FREE</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserHeader;
