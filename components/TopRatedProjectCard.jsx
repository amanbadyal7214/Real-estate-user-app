import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const TopRatedProjectCard = ({ image, title, location, price, rating, ratingCount, onPress }) => {
    return (
        <View
            className="w-full h-[266.83px] bg-white border-[0.67px] border-[#E4E7EC] rounded-[16px] p-[16.67px] shadow-sm mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
            }}
        >
            {/* Top Info Row */}
            <View className="flex-row gap-3 mb-3">
                <Image
                    source={{ uri: image }}
                    className="w-[100px] h-[100px] rounded-[14px]"
                />
                <View className="flex-1 gap-1">
                    <Text
                        className="font-semibold text-[18px] leading-[27px] text-[#101828]"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text className="font-normal text-[14px] leading-[21px] text-[#6A7282]">
                        {location}
                    </Text>
                    <Text className="font-semibold text-[15px] leading-[22px] text-[#101828] mt-1">
                        {price}
                    </Text>
                </View>
            </View>

            {/* Rating Row */}
            <View className="flex-row justify-between items-center mb-0.5">
                <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-[20px] leading-[30px] text-[#00C48C]">
                        {rating}
                    </Text>
                    <View className="flex-row gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Ionicons
                                key={i}
                                name="star"
                                size={16}
                                color="#00C48C"
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity>
                    <Text className="font-medium text-[14px] leading-[21px] text-[#101828] underline">
                        Read all reviews
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Ratings Count */}
            <Text className="font-normal text-[13px] leading-[20px] text-[#6A7282] mb-4">
                Based on {ratingCount} ratings
            </Text>

            {/* View Property Button */}
            <TouchableOpacity
                onPress={onPress}
                className="h-11 bg-[#008E96]/10 rounded-[14px] justify-center items-center"
            >
                <Text className="font-semibold text-[15px] leading-[22px] text-[#008E96]">
                    View Property
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TopRatedProjectCard;
