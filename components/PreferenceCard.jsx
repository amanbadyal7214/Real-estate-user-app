import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PreferenceCard = ({ icon, label, value, properties, onPress }) => {
    return (
        <View 
            className="bg-white border-[#E4E7EC] shadow-sm"
            style={{
                width: wp('41.5%'),
                height: hp('14%'),
                borderWidth: 0.67,
                borderRadius: wp('3.7%'),
                padding: wp('3.7%'),
                marginBottom: hp('1.7%'),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2
            }}
        >
            <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3%'), lineHeight: hp('2.1%'), marginBottom: hp('0.8%') }} className="text-[#6A7282]">
                {label}
            </Text>
            
            <View className="flex-row items-center" style={{ gap: wp('1.8%'), marginBottom: hp('1.2%'), height: hp('2.7%') }}>
                <MaterialCommunityIcons name={icon} size={wp('4.5%')} color="#101828" />
                <Text 
                    style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.8%'), lineHeight: hp('2.7%') }}
                    className="text-[#101828]"
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            <View className="w-full border-t-[0.67px] border-dashed border-[#E4E7EC]" style={{ marginBottom: hp('1.2%') }} />

            <TouchableOpacity onPress={onPress}>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), lineHeight: hp('2.2%') }} className="text-[#008E96] text-center">
                    View {properties}+ properties
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PreferenceCard;
