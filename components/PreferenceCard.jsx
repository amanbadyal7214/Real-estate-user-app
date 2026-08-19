import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PreferenceCard = ({ icon, label, value, properties, onPress }) => {
    return (
        <View 
            className="bg-white border-[#E4E7EC] shadow-sm pb-3 pt-3 px-3.5"
            style={{
                width: wp('42%'),
                borderWidth: 0.67,
                borderRadius: 14,
                marginBottom: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2
            }}
        >
            <Text style={{ fontWeight: '400', fontSize: 11, marginBottom: 6 }} className="text-[#6A7282]">
                {label}
            </Text>
            
            <View className="flex-row items-center" style={{ gap: 6, marginBottom: 10 }}>
                <MaterialCommunityIcons name={icon} size={18} color="#101828" />
                <Text 
                    style={{ fontWeight: '600', fontSize: 13, flexShrink: 1 }}
                    className="text-[#101828]"
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            <View className="w-full border-t-[0.67px] border-dashed border-[#E4E7EC] mb-3" />

            <TouchableOpacity onPress={onPress}>
                <Text style={{ fontWeight: '500', fontSize: 12 }} className="text-[#008E96] text-center">
                    View {properties}+ properties
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PreferenceCard;
