import { Text, TouchableOpacity, View } from 'react-native';

const ProjectFinancialServicesCard = () => {
  return (
    <View 
      className="bg-white rounded-[16px] p-4 gap-4 w-full"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <Text className="font-inter-medium text-[#101828] text-[18px]">Financial services</Text>
      
      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 border border-[#E5E7EB] rounded-[14px] p-4 items-center justify-center gap-2">
           <Text className="text-[24px]">🏠</Text>
           <Text className="font-inter-regular text-[#101828] text-[14px]">Home Loans</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 border border-[#E5E7EB] rounded-[14px] p-4 items-center justify-center gap-2">
           <Text className="text-[24px]">💎</Text>
           <Text className="font-inter-regular text-[#101828] text-[14px]">Housing Pr...</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text className="font-inter-medium text-[#101828] text-[14px] underline">Explore more services →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectFinancialServicesCard;