import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { usePostProperty } from '../../context/PostPropertyContext';

const VerifyPropertyStep = () => {
  const { postData } = usePostProperty();

  const isResidential = postData.propertyDetails.type === 'Residential';

  const DetailRow = ({ label, value, color = "#364153", isBold = false }) => (
    <View className="flex-row justify-between" style={{ paddingVertical: hp('0.5%') }}>
      <Text className="text-[#6A7282]" style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }}>{label}</Text>
      <Text 
        className={`text-right flex-1 ${isBold ? 'font-bold' : ''}`} 
        style={{ color, fontFamily: isBold ? 'Inter-Bold' : 'Inter-Medium', fontSize: wp('3.7%'), marginLeft: wp('4.3%') }}
      >
        {value || 'Not provided'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ gap: hp('3%'), paddingBottom: hp('5%') }}>
        
        {/* Review Summary */}
        <View style={{ paddingHorizontal: wp('5.3%'), paddingTop: hp('3%'), gap: hp('2%') }}>
          <Text className="text-[#101828]" style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%') }}>Review Details</Text>
          
          {/* Main Info Card */}
          <View className="bg-[#F9FAFB] border border-[#E5E7EB]" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%'), gap: hp('2%') }}>
            <View className="border-b border-[#E5E7EB]" style={{ paddingBottom: hp('1.5%') }}>
              <Text className="text-[#101828]" style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.3%'), marginBottom: hp('0.5%') }}>
                {postData.propertyDetails.title || (postData.propertyDetails.bhk ? `${postData.propertyDetails.bhk} in ${postData.propertyDetails.locality}` : postData.propertyDetails.locality)}
              </Text>
              <Text className="text-[#008E96]" style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%') }}>₹ {postData.priceDetails.expectedPrice}</Text>
            </View>

            <View style={{ gap: hp('1%') }}>
              <Text className="text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.2%') }}>Basic Details</Text>
              <DetailRow label="Category" value={`${postData.propertyDetails.category} (${postData.propertyDetails.type})`} />
              <DetailRow label="Locality" value={postData.propertyDetails.locality} />
              <DetailRow label="Furnishing" value={postData.propertyDetails.furnishing} />
              {isResidential && (
                <>
                  <DetailRow label="BHK" value={postData.propertyDetails.bhk} />
                  <DetailRow label="Structure" value={postData.propertyDetails.structure} />
                </>
              )}
            </View>

            <View className="border-t border-[#E5E7EB]" style={{ gap: hp('1%'), paddingTop: hp('1%') }}>
              <Text className="text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.2%') }}>Price & Area</Text>
              <DetailRow label="Area" value={`${postData.advancedDetails.carpetArea} ${postData.advancedDetails.measurementUnit}`} />
              <DetailRow label="Maintenance" value={`₹ ${postData.priceDetails.maintenance || '0'}`} />
              <DetailRow label="Deposit" value={`₹ ${postData.priceDetails.securityDeposit || '0'}`} />
            </View>

            {isResidential && (
              <View className="border-t border-[#E5E7EB]" style={{ gap: hp('1%'), paddingTop: hp('1%') }}>
                <Text className="text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.2%') }}>Advanced Details</Text>
                <DetailRow label="Bathrooms" value={postData.advancedDetails.bathrooms} />
                <DetailRow label="Balconies" value={postData.advancedDetails.balconies} />
                <DetailRow label="Property Age" value={`${postData.advancedDetails.ageOfProperty} Years`} />
                <DetailRow label="Facing" value={postData.advancedDetails.facing} />
                <DetailRow label="RERA ID" value={postData.advancedDetails.reraId} />
              </View>
            )}

            <View className="border-t border-[#E5E7EB]" style={{ gap: hp('1%'), paddingTop: hp('1%') }}>
              <Text className="text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.2%') }}>Description</Text>
              <Text className="text-[#4A5565]" style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: hp('2.5%') }}>
                {postData.propertyDetails.description || 'No description provided.'}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default VerifyPropertyStep;
