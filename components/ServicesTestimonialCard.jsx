import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

/**
 * ServicesTestimonialCard
 *
 * Props:
 *  - name      (string)  – reviewer name
 *  - location  (string)  – city
 *  - rating    (string)  – e.g. "4.8"
 *  - comment   (string)  – review text
 *  - image     (string)  – avatar URI
 */
const ServicesTestimonialCard = ({ name, location, rating, comment, image }) => {
    return (
        <View
            className="bg-white rounded-2xl mr-4"
            style={{
                width: 290,
                padding: 17,
                gap: 12,
                borderWidth: 0.667,
                borderColor: '#E4E7EC',
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
            }}
        >
            {/* Header Row: avatar + name/location + rating */}
            <View className="flex-row items-center gap-3">
                {/* Avatar */}
                <Image
                    source={{ uri: image }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                />

                {/* Name + Location */}
                <View className="flex-1">
                    <Text
                        className="font-inter-semibold text-[#101828] leading-[22px]"
                        style={{ fontSize: 15 }}
                        numberOfLines={1}
                    >
                        {name}
                    </Text>
                    <Text
                        className="font-inter-regular text-[#6A7282] leading-[20px]"
                        style={{ fontSize: 13 }}
                    >
                        {location}
                    </Text>
                </View>

                {/* Star + Rating */}
                <View className="flex-row items-center gap-1">
                    <Ionicons name="star" size={16} color="#FFA726" />
                    <Text
                        className="font-inter-semibold text-[#101828] leading-[21px]"
                        style={{ fontSize: 14 }}
                    >
                        {rating}
                    </Text>
                </View>
            </View>

            {/* Comment */}
            <Text
                className="font-inter-regular text-[#4A5565]"
                style={{ fontSize: 14, lineHeight: 23 }}
            >
                {comment}
            </Text>
        </View>
    );
};

export default ServicesTestimonialCard;
