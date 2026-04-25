import { Building, Building2, Home, HomeIcon, Key, LandPlot } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const DEFAULT_TABS = [
  { id: 'Buy', label: 'Buy', icon: Home, color: '#008E96' },
  { id: 'Rent', label: 'Rent', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },
];

const PLOT_TABS = [
  { id: 'Rent', label: 'Rent', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'Buy', label: 'Buy', icon: Home, color: '#008E96' },
  { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },
  
];

const COMMERCIAL_TABS = [
  { id: 'Rent', label: 'Rent', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#008E96' },
  { id: 'Buy', label: 'Buy', icon: Home, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
];

const CategoryTabs = ({ activeTab = 'Buy', onTabPress, mode = 'Buy' }) => {
  const scrollViewRef = useRef(null);
  const tabs = useMemo(() => {
    if (mode === 'Plot') return PLOT_TABS;
    if (mode === 'Commercial') return COMMERCIAL_TABS;
    return DEFAULT_TABS;
  }, [mode]);

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1 && scrollViewRef.current) {
        // Tab width is 85, marginRight is 12. Total 97 per tab.
        const scrollToX = activeIndex * 97;
        scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [activeTab, tabs]);

  return (
    <ScrollView 
        ref={scrollViewRef}
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
      className="mb-6 flex-row"
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <View key={tab.id} style={{ width: 85, marginRight: 12 }} className="relative">
            <TouchableOpacity
              onPress={() => onTabPress?.(tab.id)}
              style={{ height: 88, justifyContent: 'center' }}
              className={`items-center bg-white px-2 rounded-2xl border-2 ${
                isActive ? 'border-[#008E96]' : 'border-transparent'
              }`}
            >
              <Icon size={28} color={isActive ? '#008E96' : '#101828'} />
              <Text
                style={{ fontFamily: 'Inter-Medium' }}
                className={`mt-2 text-[13px] text-center ${
                  isActive ? 'text-[#008E96]' : 'text-[#101828]'
                } ${tab.id === 'Commercial' ? 'text-[11px]' : ''}`}
                numberOfLines={1}
                adjustsFontSizeToFit
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
    </ScrollView>
  );
};

export default CategoryTabs;
