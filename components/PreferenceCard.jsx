import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const PreferenceCard = ({ icon, label, value, properties, onPress }) => {
    return (
        <View 
            className="w-[182px] h-[135px] bg-white border-[0.67px] border-[#E4E7EC] rounded-[16px] p-[16.67px] shadow-sm mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2
            }}
        >
            <Text className="font-inter-regular text-[13px] text-[#6A7282] leading-[20px] mb-2">
                {label}
            </Text>
            
            <View className="flex-row items-center gap-2 mb-3 h-[26px]">
                <MaterialCommunityIcons name={icon} size={20} color="#101828" />
                <Text 
                    className="font-inter-semibold text-[17px] text-[#101828] leading-[26px]"
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            <View className="w-full border-t-[0.67px] border-dashed border-[#E4E7EC] mb-3" />

            <TouchableOpacity onPress={onPress}>
                <Text className="font-inter-medium text-[14px] text-[#008E96] text-center leading-[21px]">
                    View {properties}+ properties
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PreferenceCard;
