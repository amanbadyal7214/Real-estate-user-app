import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft, ChevronRight, UserMinus, UserX } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';

const AccountSettings = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(null); // 'deactivate' | 'delete' | null
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const syncAuthState = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      syncAuthState();
    }, [syncAuthState])
  );

  const clearLocalSession = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('token'),
      SecureStore.deleteItemAsync('userRole'),
      SecureStore.deleteItemAsync('userData'),
    ]);
    setIsLoggedIn(false);
  };

  const requireLoginPrompt = (actionLabel) => {
    Alert.alert(
      'Sign In Required',
      `Please sign in first to ${actionLabel}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/Login') },
      ]
    );
  };

  const handleOpenDeactivate = () => {
    if (!isLoggedIn) {
      requireLoginPrompt('deactivate your account');
      return;
    }
    setDeactivateModalVisible(true);
  };

  const handleOpenDelete = () => {
    if (!isLoggedIn) {
      requireLoginPrompt('delete your account');
      return;
    }
    setDeleteModalVisible(true);
  };

  const handleConfirmDeactivate = async () => {
    try {
      setSubmittingAction('deactivate');
      const response = await api.patch('/auth/me/deactivate');
      if (response.status >= 200 && response.status < 300 && response.data?.success !== false) {
        await clearLocalSession();
        setDeactivateModalVisible(false);
        Alert.alert(
          'Account Deactivated',
          'Your account has been deactivated. You can reactivate it anytime by logging back in.',
          [{ text: 'OK', onPress: () => router.replace('/screens/Buy/Buy') }]
        );
      } else {
        Alert.alert('Error', response.data?.message || 'Unable to deactivate your account.');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404 || status === 405 || status === 501) {
        Alert.alert(
          'Server Endpoint Needed',
          'Account deactivation endpoint (PATCH /auth/me/deactivate) is not enabled on api.housingmania.com yet.'
        );
      } else {
        Alert.alert(
          'Deactivation Failed',
          error.response?.data?.message || error.response?.data?.error || 'Could not deactivate your account. Please try again.'
        );
      }
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmittingAction('delete');
      const response = await api.delete('/auth/me');
      if (response.status >= 200 && response.status < 300 && response.data?.success !== false) {
        await clearLocalSession();
        setDeleteModalVisible(false);
        Alert.alert(
          'Account Deleted',
          'Your account and associated personal data have been permanently deleted.',
          [{ text: 'OK', onPress: () => router.replace('/screens/Buy/Buy') }]
        );
      } else {
        Alert.alert('Error', response.data?.message || 'Unable to delete your account.');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404 || status === 405 || status === 501) {
        Alert.alert(
          'Server Endpoint Needed',
          'Account deletion endpoint (DELETE /auth/me) is not enabled on api.housingmania.com yet.'
        );
      } else {
        Alert.alert(
          'Deletion Failed',
          error.response?.data?.message || error.response?.data?.error || 'Could not delete your account. Please try again.'
        );
      }
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
          style={{ fontWeight: '700', fontSize: wp('7.5%'), marginTop: hp('2%'), marginBottom: hp('3.9%') }}
          className="text-[#101828]"
        >
          Account Settings
        </Text>

        {/* Deactivate Section */}
        <View style={{ marginBottom: hp('3.9%') }}>
          <TouchableOpacity
            onPress={handleOpenDeactivate}
            disabled={!!submittingAction}
            className="flex-row items-center justify-between"
            style={{ paddingVertical: hp('1%') }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
              <UserMinus size={wp('5.9%')} color="#008E96" strokeWidth={2} />
              <Text
                style={{ fontWeight: '600', fontSize: wp('4.8%') }}
                className="text-[#008E96]"
              >
                Deactivate my account
              </Text>
            </View>
            <ChevronRight size={wp('5.3%')} color="#008E96" />
          </TouchableOpacity>
          <Text
            style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginTop: hp('1%') }}
            className="text-[#4A5565]"
          >
            Deactivating an account means temporarily disabling your account without permanently deleting it. Your profile and content may be hidden from other users. The platform keeps your data and account information stored.{"\n\n"}You can reactivate your account later by logging back in.
          </Text>
        </View>

        {/* Delete Section */}
        <View style={{ marginBottom: hp('3.9%') }}>
          <TouchableOpacity
            onPress={handleOpenDelete}
            disabled={!!submittingAction}
            className="flex-row items-center justify-between"
            style={{ paddingVertical: hp('1%') }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
              <UserX size={wp('5.9%')} color="#DC2626" strokeWidth={2} />
              <Text
                style={{ fontWeight: '600', fontSize: wp('4.8%') }}
                className="text-[#DC2626]"
              >
                Delete my account
              </Text>
            </View>
            <ChevronRight size={wp('5.3%')} color="#DC2626" />
          </TouchableOpacity>
          <Text
            style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginTop: hp('1%') }}
            className="text-[#4A5565]"
          >
            Deleting your account permanently removes your account, profile, saved listings, and associated personal data from HousingMania. Once deleted, your account cannot be recovered.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Terms & Conditions */}
      <View className="items-center justify-center bg-white" style={{ paddingVertical: hp('2.9%') }}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setTermsModalVisible(true)}>
          <Text
            style={{ fontWeight: '500', fontSize: wp('3.7%') }}
            className="text-[#008E96]"
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Deactivate Confirmation Modal */}
      <Modal
        visible={deactivateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !submittingAction && setDeactivateModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#101828', marginBottom: 8 }}>
              Deactivate Account?
            </Text>
            <Text style={{ fontSize: 14, color: '#4A5565', lineHeight: 20, marginBottom: 20 }}>
              Your profile and listings will be temporarily hidden until you sign back in.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setDeactivateModalVisible(false)}
                disabled={!!submittingAction}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E4E7EC', alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: '#344054' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDeactivate}
                disabled={!!submittingAction}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#008E96', alignItems: 'center', justifyContent: 'center' }}
              >
                {submittingAction === 'deactivate' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ fontWeight: '600', color: '#fff' }}>Deactivate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Permanent Account Deletion Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !submittingAction && setDeleteModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Ionicons name="warning-outline" size={24} color="#DC2626" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#101828', flex: 1 }}>
                Delete Account Permanently?
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#4A5565', lineHeight: 20, marginBottom: 20 }}>
              This action is irreversible. Your account, profile information, saved properties, search history, and posted listings will be permanently deleted.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                disabled={!!submittingAction}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E4E7EC', alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: '#344054' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={!!submittingAction}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' }}
              >
                {submittingAction === 'delete' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ fontWeight: '600', color: '#fff' }}>Delete Forever</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={termsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '75%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#101828' }}>
                Terms & Conditions
              </Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6A7282" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 14, color: '#4A5565', lineHeight: 22 }}>
                By using HousingMania, you agree to provide accurate contact and property listing information and to comply with applicable local real estate laws.{"\n\n"}
                Privacy & Data: We collect account contact details (name, email, phone number, city/address), coarse location for property discovery, uploaded property photos, saved listings, and search activity strictly to provide app functionality.{"\n\n"}
                Account Control: You can deactivate your account temporarily or permanently delete your account and associated data at any time from Account Settings.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountSettings;
