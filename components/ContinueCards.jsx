import { ChevronRight, History } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ContinueCards = ({ data = [] }) => {
  if (data.length === 0) return null;

  return (
    <View className="px-4 mt-6">
      <View className="flex-row items-center gap-2 mb-4">
        <History size={20} color="#667085" />
        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#4A5565]">
          Continue where you left
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="bg-white border border-[#EAECF0] p-4 rounded-2xl w-[280px] mr-3 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-2">
              <Text 
                numberOfLines={1} 
                style={{ fontFamily: 'Inter-Bold' }} 
                className="text-[15px] text-[#101828]"
              >
                {item.title}
              </Text>
              <Text 
                style={{ fontFamily: 'Inter-Regular' }} 
                className="text-[13px] text-[#667085] mt-1"
              >
                {item.subtitle}
              </Text>
            </View>
            <ChevronRight size={20} color="#008E96" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ContinueCards;
