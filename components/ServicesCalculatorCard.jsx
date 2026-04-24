import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * ServicesCalculatorCard
 *
 * Props:
 *  - title       (string)  – e.g. "EMI Calculator"
 *  - subtitle    (string)  – e.g. "EMI starts at ₹10.60K"
 *  - iconColor   (string)  – hex colour for the arrow button bg, default #FFA726
 *  - image       (string)  – URI for the illustration shown bottom-right
 *  - onPress     (fn)      – tap handler
 */
const ServicesCalculatorCard = ({
    title,
    subtitle,
    iconColor = '#FFA726',
    image,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            className="w-[250px] h-[160px] bg-white rounded-2xl mr-4 overflow-hidden"
            style={{ borderWidth: 0.667, borderColor: '#E4E7EC' }}
        >
            {/* Title + Subtitle */}
            <View className="absolute gap-1" style={{ left: 16, top: 22 }}>
                <Text
                    className="font-inter-semibold text-[#101828] leading-[22px]"
                    style={{ fontSize: 18 }}
                    numberOfLines={2}
                >
                    {title}
                </Text>
                <Text
                    className="font-inter-medium text-[#6A7282] leading-[16px]"
                    style={{ fontSize: 13, maxWidth: 140 }}
                    numberOfLines={2}
                >
                    {subtitle}
                </Text>
            </View>

            {/* Arrow Button */}
            <View
                className="absolute w-9 h-9 rounded-full justify-center items-center"
                style={{ backgroundColor: '#FFA726', right: 14, top: 22 }}
            >
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>

            {/* Background Illustration */}
            {image ? (
                <Image
                    source={{ uri: image }}
                    className="absolute"
                    style={{ width: 92, height: 92, right: 0, bottom: 0 }}
                    resizeMode="cover"
                />
            ) : null}
        </TouchableOpacity>
    );
};

export default ServicesCalculatorCard;
