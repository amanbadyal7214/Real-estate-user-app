import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

const UniqueAmenityCard = ({ image, title, properties, onPress }) => {
    return (
        <View className="w-[280px] h-[160px] rounded-[16px] overflow-hidden">
            <ImageBackground
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.2)', 'transparent']}
                    className="absolute inset-0"
                    locations={[0, 0.5, 1]}
                />
                <TouchableOpacity 
                    onPress={onPress}
                    className="flex-1 justify-end p-4 pb-5"
                >
                    <View className="gap-1">
                        <Text className="font-inter-semibold text-[22px] text-white leading-[30px]">
                            {title}
                        </Text>
                        <Text className="font-inter-regular text-[14px] text-white/90 leading-[21px]">
                            {properties} Properties
                        </Text>
                        
                        <View className="flex-row items-center mt-2 gap-1">
                            <Text className="font-inter-medium text-[15px] text-white underline leading-[22px]">
                                View all
                            </Text>
                            <MaterialCommunityIcons name="chevron-right" size={18} color="white" />
                        </View>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default UniqueAmenityCard;
