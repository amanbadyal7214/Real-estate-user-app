import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ProjectReviewCard = ({ 
  name = "Homeland Heights", 
  location = "Sector 70, Mohali", 
  price = "₹15,903/ sq.ft.", 
  rating = "4.9", 
  reviewsCount = 5, 
  image = null,
  isProject = true
}) => {
  return (
    <View 
      className="bg-white border-[0.67px] border-[#F3F4F6] rounded-[16px] p-[16.67px] gap-[16px] self-stretch"
      style={{
        shadowColor: 'rgba(0, 0, 0, 0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Top Section */}
      <View className="flex-row justify-between items-start">
        {/* Left Side: Image/Icon and Info */}
        <View className="flex-row items-start gap-[12px] flex-1">
          {/* Project Image or Location Icon */}
          {isProject && image ? (
            <Image 
              source={typeof image === 'string' ? { uri: image } : image} 
              className="w-[64px] h-[64px] rounded-[12px]"
              resizeMode="cover"
            />
          ) : (
            <View className="w-[48px] h-[48px] bg-[#8B5CF6]/10 rounded-[12px] items-center justify-center">
              <Ionicons name={isProject ? "business-outline" : "location-outline"} size={24} color="#8B5CF6" />
            </View>
          )}

          {/* Text Container */}
          <View className="flex-1">
            <Text className="font-inter-semibold text-[16px] leading-[24px] text-[#101828]">
              {name}
            </Text>
            <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mt-[2px]">
              {location}
            </Text>
            <Text className="font-inter-medium text-[14px] leading-[21px] text-[#4A5565] mt-[6px]">
              {price}
            </Text>
          </View>
        </View>

        {/* Right Side: Rating */}
        <View className="items-end gap-[4px]">
          <Text className="font-inter-bold text-[16px] leading-[24px] text-[#008E96]">
            {rating}
          </Text>
          <View className="flex-row gap-[2px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons key={star} name="star" size={16} color="#1CB2A9" />
            ))}
          </View>
          <Text className="font-inter-regular text-[12px] leading-[18px] text-[#6A7282]">
            Based on {reviewsCount} ratings
          </Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View className="flex-row gap-[12px]">
        <TouchableOpacity className="flex-1 h-[41px] items-center justify-center">
          <Text className="font-inter-medium text-[14px] leading-[21px] text-[#008E96] text-center">
            Read all reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 h-[41px] bg-[#008E96]/10 rounded-[10px] items-center justify-center">
          <Text className="font-inter-medium text-[14px] leading-[21px] text-[#008E96] text-center">
            {isProject ? "View Project" : "View Properties"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectReviewCard;
