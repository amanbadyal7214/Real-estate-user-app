import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ChevronDown, User } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white" style={{ paddingHorizontal: wp('3.2%'), paddingVertical: hp('1.5%') }}>

        {/* Left Section: User */}
        <View className="items-start justify-center flex-shrink" style={{ zIndex: 10 }}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            className="flex-row items-center flex-shrink"
            style={{ gap: wp('1.6%') }}
            activeOpacity={0.7}
          >
            <View className="bg-primary items-center justify-center rounded-full" style={{ width: wp('8.5%'), height: wp('8.5%') }}>
              <User color="white" size={wp('4.3%')} />
            </View>
            <View className="flex-row items-center flex-shrink" style={{ paddingRight: wp('1.1%') }}>
              <Text style={{ fontWeight: '500', fontSize: wp('3.5%') }} className="text-[#101828]">
                Hi {userName}
              </Text>
              <ChevronDown size={wp('3.7%')} color="#101828" style={{ marginLeft: wp('0.5%') }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Section: Post Button */}
        <View className="items-end justify-center" style={{ zIndex: 10 }}>
          <TouchableOpacity
            onPress={handlePostProperty}
            className="flex-row items-center bg-[#F2F4F7] rounded-full"
            style={{ paddingHorizontal: wp('2.7%'), paddingVertical: hp('0.7%') }}
          >
            <Text numberOfLines={1} className="font-medium text-[#101828]" style={{ fontSize: wp('2.9%'), marginRight: wp('1.6%') }}>List Property</Text>
            <View className="bg-primary rounded" style={{ paddingHorizontal: wp('1.6%'), paddingVertical: hp('0.2%') }}>
              <Text className="font-bold text-white" style={{ fontSize: wp('2.1%') }}>FREE</Text>
            </View>
          </TouchableOpacity>
        </View>

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
                  <View style={{ padding: wp('4.3%'), gap: wp('3.2%') }}>
                    <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginBottom: hp('0.5%') }}>
                      <View className="bg-[#E6F7F6] items-center justify-center rounded-full" style={{ width: wp('8.5%'), height: wp('8.5%') }}>
                        <User color="#008E96" size={wp('4.3%')} />
                      </View>
                      <Text style={{ fontWeight: '700', fontSize: wp('4.3%') }} className="text-[#101828] flex-1" numberOfLines={1}>
                        {userData.name}
                      </Text>
                    </View>

                    {userData.email && (
                      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), marginLeft: wp('1.1%') }} className="text-[#4A5565]">
                        ✉️  {userData.email}
                      </Text>
                    )}

                    {(userData.phone || userData.profileData?.phone) && (
                      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), marginLeft: wp('1.1%') }} className="text-[#4A5565]">
                        📞  {userData.phone || userData.profileData?.phone}
                      </Text>
                    )}

                    {userData.role && (
                      <View className="flex-row flex-wrap" style={{ gap: wp('1.6%'), marginTop: hp('0.5%') }}>
                        {(Array.isArray(userData.role) ? userData.role : [userData.role]).map((r) => (
                          <View key={r} className="bg-[#E6F7F6] rounded-md border border-[#008E96]/20" style={{ paddingHorizontal: wp('2.7%'), paddingVertical: hp('0.2%') }}>
                            <Text className="text-[#008E96] uppercase font-semibold" style={{ fontWeight: '600', fontSize: wp('2.7%') }}>
                              {r}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View className="h-[1px] bg-gray-100" style={{ marginVertical: hp('1%') }} />

                    <TouchableOpacity
                      onPress={handleLogout}
                      className="flex-row items-center justify-center bg-red-50 rounded-xl border border-red-100"
                      style={{ paddingVertical: hp('1.2%') }}
                    >
                      <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-red-600">
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ padding: wp('4.3%'), gap: wp('3.2%') }}>
                    <Text style={{ fontWeight: '700', fontSize: wp('4.3%') }} className="text-[#101828]">
                      Welcome, Guest!
                    </Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), lineHeight: hp('2.5%') }} className="text-[#6A7282]">
                      Log in to access your properties, post new ads, and explore calculators.
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDropdown(false);
                        router.push("/(auth)/Login");
                      }}
                      className="bg-[#008E96] rounded-xl items-center shadow-sm"
                      style={{ paddingVertical: hp('1.5%') }}
                    >
                      <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-white">
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
    top: hp('9.2%'),
    left: wp('4.3%'),
    width: wp('74.7%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5.3%'),
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
