import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const HighestGrowthCard = ({ image, title, location, growth, timeline, price, onPress }) => {
    return (
        <View className="w-[320px] h-[376.5px] bg-white border-[0.67px] border-[#E4E7EC] rounded-[16px] p-[16.67px] shadow-sm ">
            {/* Top Info Row */}
            <View className="flex-row items-start mb-4 gap-3">
                <Image
                    source={{ uri: image }}
                    className="w-20 h-20 rounded-[14px]"
                />
                <View className="flex-1">
                    <Text className="font-inter-semibold text-[17px] text-[#101828] leading-[26px]">
                        {title}
                    </Text>
                    <Text className="font-inter-regular text-[13px] text-[#6A7282] leading-[20px]">
                        {location}
                    </Text>
                </View>
            </View>

            {/* Growth Graph Area */}
            <View className="relative w-full h-[100px] mb-6 overflow-hidden">
                {(() => {
                    const growthVal = parseFloat(growth.replace('%', '')) || 0;
                    // Dynamic calculation for a more realistic growth curve
                    const dynamicTop = Math.max(10, 70 - (growthVal * 0.5)); 
                    const rotation = Math.max(-15, - (growthVal * 0.15)); // Higher growth = steeper angle
                    
                    return (
                        <View 
                            style={{
                                position: 'absolute',
                                top: dynamicTop,
                                left: -40,
                                right: -40,
                                height: 200,
                                borderRadius: 180,
                                borderWidth: 2,
                                borderColor: '#00C48C',
                                overflow: 'hidden',
                                transform: [{ rotate: `${rotation}deg` }] // Tilt for growth effect
                            }}
                        >
                            <LinearGradient
                                colors={['rgba(0, 196, 140, 0.25)', 'rgba(28, 178, 169, 0)']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                className="flex-1"
                            />
                        </View>
                    );
                })()}
            </View>

            {/* Growth Stats Row */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="trending-up" size={16} color="#00C48C" />
                    <Text className="font-inter-semibold text-[15px] text-[#00C48C]">
                        {growth}
                    </Text>
                    <Text className="font-inter-regular text-[13px] text-[#00C48C]">
                        in {timeline}
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="font-inter-medium text-[14px] text-[#101828] underline">
                        View price trend
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Price Info section */}
            <View className="flex-row items-center py-4 border-b-[0.67px] border-dashed border-[#E4E7EC] mb-4 gap-2">
                <View className="w-6 h-6 border-[1px] border-dashed border-[#6A7282] rounded-[4px] items-center justify-center">
                    <MaterialCommunityIcons name="currency-rupee" size={14} color="#6A7282" />
                </View>
                <Text className="font-inter-semibold text-[15px] text-[#101828]">
                    {price}
                </Text>
            </View>

            {/* View Property Button */}
            <TouchableOpacity
                onPress={onPress}
                className="h-11 bg-[#008E96]/10 rounded-[14px] justify-center items-center"
            >
                <Text className="font-inter-semibold text-[15px] text-[#008E96]">
                    View Property
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default HighestGrowthCard;
