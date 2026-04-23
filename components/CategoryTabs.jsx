import { Building, Building2, Home, Key } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const CategoryTabs = ({ activeTab = 'Buy', onTabPress }) => {
  const tabs = [
    { id: 'Buy', label: 'Buy', icon: Home, color: '#008E96' },
    { id: 'Rent', label: 'Rent', icon: Key, color: '#101828' },
    { id: 'Project', label: 'Project', icon: Building2, color: '#101828', isNew: true },
    { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },
  ];

  return (
    <View className="flex-row justify-between mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <View key={tab.id} className="w-[23%] relative">
            <TouchableOpacity
              onPress={() => onTabPress?.(tab.id)}
              className={`items-center bg-white p-4 rounded-2xl ${
                isActive ? 'border-2 border-[#008E96]' : ''
              }`}
            >
              <Icon size={28} color={isActive ? '#008E96' : '#101828'} />
              <Text
                style={{ fontFamily: 'Inter-Medium' }}
                className={`mt-2 text-[13px] text-center ${
                  isActive ? 'text-[#008E96]' : 'text-[#101828]'
                } ${tab.id === 'Commercial' ? 'text-[11px]' : ''}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
            {tab.isNew && (
              <View className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#008E96] px-2 py-0.5 rounded-full">
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[8px] text-white">NEW</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default CategoryTabs;
