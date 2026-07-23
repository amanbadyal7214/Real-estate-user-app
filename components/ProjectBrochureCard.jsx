import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, Text, TouchableOpacity, View, Image } from "react-native";

const fallbackImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300",
];

const ProjectBrochureCard = ({ totalPages = 30, onDownload, brochureUrl, previewImages = fallbackImages }) => {
  const images = previewImages.length > 0 ? previewImages : fallbackImages;
  const extraPages = Math.max(totalPages - 2, 0);
  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }

    if (brochureUrl) {
      await Linking.openURL(brochureUrl);
    }
  };

  return (
    <View 
      className="bg-white rounded-[16px] p-4 gap-3 w-full"
      style={{ 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <Text className="font-medium text-[#101828] text-[18px] leading-[27px]">Project brochure</Text>
      
      <View 
        className="rounded-[14px] overflow-hidden flex-row gap-2" 
        style={{ width: "100%", height: 160 }}
      >
        <View className="flex-[2] rounded-[10px] overflow-hidden relative">
          <Image 
            source={{ uri: images[0] }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)"]}
            className="absolute inset-0"
          />
          <View className="absolute left-2 bottom-2 bg-black/60 rounded-[4px] px-2 py-0.5">
            <Text className="text-white font-normal text-[11px]">1/{totalPages}</Text>
          </View>
        </View>

        <View className="flex-1 gap-2">
          <View className="flex-1 rounded-[10px] overflow-hidden">
            <Image 
              source={{ uri: images[1] || images[0] }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 rounded-[10px] overflow-hidden relative">
            <Image 
              source={{ uri: images[2] || images[0] }} 
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <Text className="text-white font-medium text-[16px]">+{extraPages}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity 
          className="flex-1 border-2 border-[#E5E7EB] rounded-[10px] items-center justify-center bg-white h-[48px]"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="share-social-outline" size={18} color="#101828" />
            <Text className="font-medium text-[#101828] text-[14px]">Share</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleDownload}
          className="flex-[2] bg-[#F2F4F7] h-[48px] rounded-[10px] flex-row items-center justify-center gap-2"
        >
          <Ionicons name="download-outline" size={20} color="#101828" />
          <Text className="font-medium text-[#101828] text-[14px]">Download Brochure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectBrochureCard;
