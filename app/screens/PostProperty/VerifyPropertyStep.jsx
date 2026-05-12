import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { usePostProperty } from '../../context/PostPropertyContext';

const VerifyPropertyStep = () => {
  const { postData } = usePostProperty();

  const isResidential = postData.propertyDetails.type === 'Residential';

  const DetailRow = ({ label, value, color = "#364153", isBold = false }) => (
    <View className="flex-row justify-between py-1">
      <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Medium' }}>{label}</Text>
      <Text 
        className={`text-sm ${isBold ? 'font-bold' : ''} text-right flex-1 ml-4`} 
        style={{ color, fontFamily: isBold ? 'Inter-Bold' : 'Inter-Medium' }}
      >
        {value || 'Not provided'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
        
        {/* Review Summary */}
        <View className="px-5 pt-6 gap-4">
          <Text className="text-[18px] text-[#101828]" style={{ fontFamily: 'Inter-Bold' }}>Review Details</Text>
          
          {/* Main Info Card */}
          <View className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] gap-4">
            <View className="border-b border-[#E5E7EB] pb-3">
              <Text className="text-[16px] text-[#101828] mb-1" style={{ fontFamily: 'Inter-Bold' }}>
                {postData.propertyDetails.title || (postData.propertyDetails.bhk ? `${postData.propertyDetails.bhk} in ${postData.propertyDetails.locality}` : postData.propertyDetails.locality)}
              </Text>
              <Text className="text-[#008E96] text-[18px]" style={{ fontFamily: 'Inter-Bold' }}>₹ {postData.priceDetails.expectedPrice}</Text>
            </View>

            <View className="gap-2">
              <Text className="text-[12px] text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold' }}>Basic Details</Text>
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

            <View className="gap-2 pt-2 border-t border-[#E5E7EB]">
              <Text className="text-[12px] text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold' }}>Price & Area</Text>
              <DetailRow label="Area" value={`${postData.advancedDetails.carpetArea} ${postData.advancedDetails.measurementUnit}`} />
              <DetailRow label="Maintenance" value={`₹ ${postData.priceDetails.maintenance || '0'}`} />
              <DetailRow label="Deposit" value={`₹ ${postData.priceDetails.securityDeposit || '0'}`} />
            </View>

            {isResidential && (
              <View className="gap-2 pt-2 border-t border-[#E5E7EB]">
                <Text className="text-[12px] text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold' }}>Advanced Details</Text>
                <DetailRow label="Bathrooms" value={postData.advancedDetails.bathrooms} />
                <DetailRow label="Balconies" value={postData.advancedDetails.balconies} />
                <DetailRow label="Property Age" value={`${postData.advancedDetails.ageOfProperty} Years`} />
                <DetailRow label="Facing" value={postData.advancedDetails.facing} />
                <DetailRow label="RERA ID" value={postData.advancedDetails.reraId} />
              </View>
            )}

            <View className="gap-2 pt-2 border-t border-[#E5E7EB]">
              <Text className="text-[12px] text-[#101828] uppercase tracking-wider" style={{ fontFamily: 'Inter-SemiBold' }}>Description</Text>
              <Text className="text-[#4A5565] text-sm leading-5" style={{ fontFamily: 'Inter-Regular' }}>
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
