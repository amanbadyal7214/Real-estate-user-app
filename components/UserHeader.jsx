import { useRouter } from "expo-router";
import { ChevronDown, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { performRoleBasedRedirect } from "../hooks/Register";
import DashboardSelectorModal from "./DashboardSelectorModal";

const UserHeader = ({ userName: propUserName }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest!");
  const [roleSelector, setRoleSelector] = useState({ visible: false, roles: [] });

  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync("token");
    setIsLoggedIn(!!token);
    if (token) {
      const userStr = await SecureStore.getItemAsync("userData");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "User!");
        } catch (e) {
          console.error("Error parsing userData in UserHeader:", e);
          setUserName("User!");
        }
      } else {
        setUserName("User!");
      }
    } else {
      setUserName("Guest!");
    }
  };

  useEffect(() => {
    if (propUserName) {
      setUserName(propUserName);
    } else {
      checkLoginStatus();
    }
  }, [propUserName]);

  const handlePostProperty = async () => {
    if (isLoggedIn) {
      const role = await SecureStore.getItemAsync("userRole");
      performRoleBasedRedirect(role, "/screens/PostProperty/PropertyDetails", setRoleSelector);
    } else {
      router.push("/screens/PostProperty/Register");
    }
  };

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
        onPress={handlePostProperty}
        className="flex-row items-center bg-[#F2F4F7] px-4 py-2 rounded-full h-10"
      >
        <Text className="font-inter-medium text-[13px] text-[#101828] mr-2">List your place</Text>
        <View className="bg-primary px-1.5 py-0.5 rounded-md">
          <Text className="font-inter-bold text-[9px] text-white">FREE</Text>
        </View>
      </TouchableOpacity>
      <DashboardSelectorModal
        visible={roleSelector.visible}
        roles={roleSelector.roles}
        onSelect={(target) => {
          setRoleSelector(prev => ({ ...prev, visible: false }));
          router.replace(target);
        }}
        onClose={() => setRoleSelector(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

export default UserHeader;
