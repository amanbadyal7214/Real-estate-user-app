import { useRouter } from "expo-router";
import { ChevronDown, User } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { performRoleBasedRedirect } from "../hooks/Register";
import DashboardSelectorModal from "./DashboardSelectorModal";

const UserHeader = ({ userName: propUserName }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest!");
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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
          setUserData(user);
        } catch (e) {
          console.error("Error parsing userData in UserHeader:", e);
          setUserName("User!");
          setUserData(null);
        }
      } else {
        setUserName("User!");
        setUserData(null);
      }
    } else {
      setUserName("Guest!");
      setUserData(null);
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

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setShowDropdown(false);
              await Promise.all([
                SecureStore.deleteItemAsync('token'),
                SecureStore.deleteItemAsync('userRole'),
                SecureStore.deleteItemAsync('userData')
              ]);
              setIsLoggedIn(false);
              setUserName("Guest!");
              setUserData(null);
              router.replace("/(auth)/Login");
            } catch (error) {
              console.error("Logout Error in UserHeader:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ zIndex: 1000 }}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <TouchableOpacity 
          onPress={() => setShowDropdown(!showDropdown)}
          className="flex-row items-center gap-2"
          activeOpacity={0.7}
        >
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <User color="white" size={20} />
          </View>
          <View className="flex-row items-center">
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828]">Hi {userName}</Text>
            <ChevronDown size={18} color="#101828" className="ml-1" />
          </View>
        </TouchableOpacity>

        {/* Center Logo */}
        <Image
          source={require('../assets/images/realeasteapphorizontal1.png')}
          style={{ width: 140, height: 36 }}
          resizeMode="contain"
        />

        <TouchableOpacity 
          onPress={handlePostProperty}
          className="flex-row items-center bg-[#F2F4F7] px-4 py-2 rounded-full h-10"
        >
          <Text className="font-inter-medium text-[13px] text-[#101828] mr-2">List your place</Text>
          <View className="bg-primary px-1.5 py-0.5 rounded-md">
            <Text className="font-inter-bold text-[9px] text-white">FREE</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                {isLoggedIn && userData ? (
                  <View className="p-4 gap-3">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className="w-8 h-8 rounded-full bg-[#E6F7F6] items-center justify-center">
                        <User color="#008E96" size={16} />
                      </View>
                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[16px] text-[#101828] flex-1" numberOfLines={1}>
                        {userData.name}
                      </Text>
                    </View>
                    
                    {userData.email && (
                      <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#4A5565] ml-1">
                        ✉️  {userData.email}
                      </Text>
                    )}

                    {(userData.phone || userData.profileData?.phone) && (
                      <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#4A5565] ml-1">
                        📞  {userData.phone || userData.profileData?.phone}
                      </Text>
                    )}

                    {userData.role && (
                      <View className="flex-row gap-1.5 flex-wrap mt-1">
                        {(Array.isArray(userData.role) ? userData.role : [userData.role]).map((r) => (
                          <View key={r} className="bg-[#E6F7F6] px-2.5 py-0.5 rounded-md border border-[#008E96]/20">
                            <Text className="text-[#008E96] text-[10px] uppercase font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                              {r}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View className="h-[1px] bg-gray-100 my-2" />

                    <TouchableOpacity 
                      onPress={handleLogout}
                      className="flex-row items-center justify-center bg-red-50 py-2.5 rounded-xl border border-red-100"
                    >
                      <Text style={{ fontFamily: 'Inter-Medium' }} className="text-red-600 text-[14px]">
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="p-4 gap-3">
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[16px] text-[#101828]">
                      Welcome, Guest!
                    </Text>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#6A7282] leading-5">
                      Log in to access your properties, post new ads, and explore calculators.
                    </Text>
                    <TouchableOpacity 
                      onPress={() => {
                        setShowDropdown(false);
                        router.push("/(auth)/Login");
                      }}
                      className="bg-[#008E96] py-3 rounded-xl items-center shadow-sm"
                    >
                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[14px]">
                        Login / Register
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 75,
    left: 16,
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },
});

export default UserHeader;
