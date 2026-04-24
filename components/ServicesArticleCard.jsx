import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * ServicesArticleCard
 *
 * Props:
 *  - title    (string) – article title
 *  - date     (string) – e.g. "Feb 2025"
 *  - excerpt  (string) – short description
 *  - image    (string) – image URI
 *  - onPress  (fn)     – tap handler
 */
const ServicesArticleCard = ({ title, date, excerpt, image, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            className="bg-white overflow-hidden mr-4"
            style={{
                width: 290,
                borderWidth: 0.667,
                borderColor: '#E4E7EC',
                borderRadius: 16,
            }}
        >
            {/* Article Image */}
            <Image
                source={{ uri: image }}
                className="w-full"
                style={{ height: 140 }}
                resizeMode="cover"
            />

            {/* Content */}
            <View className="px-4 pt-4 pb-4 gap-1">
                {/* Title */}
                <Text
                    className="font-inter-semibold text-[#101828]"
                    style={{ fontSize: 16, lineHeight: 20 }}
                    numberOfLines={2}
                >
                    {title}
                </Text>

                {/* Date */}
                <Text
                    className="font-inter-medium text-[#6A7282]"
                    style={{ fontSize: 12, lineHeight: 18, marginTop: 3 }}
                >
                    {date}
                </Text>

                {/* Excerpt */}
                <Text
                    className="font-inter-medium text-[#4A5565]"
                    style={{ fontSize: 14, lineHeight: 23, marginTop: 3 }}
                    numberOfLines={2}
                >
                    {excerpt}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ServicesArticleCard;
