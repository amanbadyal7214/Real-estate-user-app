import { Building, Building2, Home, HomeIcon, Key, LandPlot } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DEFAULT_TABS = [
  { id: 'Buy', label: 'Homes', icon: Home, color: '#008E96' },
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Business', icon: Building, color: '#101828' },
];

const PLOT_TABS = [
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'Buy', label: 'Homes', icon: Home, color: '#008E96' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Business', icon: Building, color: '#101828' },
  
];

const COMMERCIAL_TABS = [
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Commercial', label: 'Business', icon: Building, color: '#008E96' },
  { id: 'Buy', label: 'Homes', icon: Home, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
];

const PG_TABS = [
  { id: 'Buy', label: 'Homes', icon: Home, color: '#101828' },
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#008E96' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'Commercial', label: 'Business', icon: Building, color: '#101828' },
];

const CategoryTabs = ({ activeTab = 'Buy', onTabPress, mode = 'Buy' }) => {
  const scrollViewRef = useRef(null);
  const tabs = useMemo(() => {
    if (mode === 'Plot') return PLOT_TABS;
    if (mode === 'Commercial') return COMMERCIAL_TABS;
    if (mode === 'PG') return PG_TABS;
    return DEFAULT_TABS;
  }, [mode]);

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1 && scrollViewRef.current) {
        // Tab width is wp('20%'), marginRight is wp('3.2%'). Total wp('23.2%') per tab.
        const scrollToX = activeIndex * wp('23.2%');
        scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [activeTab, tabs]);

  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: wp('4.3%') }}
      className="flex-row"
      style={{ marginBottom: hp('3%') }}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <View key={tab.id} style={{ width: wp('20%'), marginRight: wp('3.2%') }} className="relative">
            <TouchableOpacity
              onPress={() => onTabPress?.(tab.id)}
              style={{ height: hp('9.6%'), justifyContent: 'center', paddingHorizontal: wp('2.1%'), borderRadius: wp('4.3%') }}
              className={`items-center bg-white border-2 ${
                isActive ? 'border-[#008E96]' : 'border-transparent'
              }`}
            >
              <Icon size={wp('5.3%')} color={isActive ? '#008E96' : '#101828'} />
              <Text
                style={{ fontFamily: 'Inter-Medium', fontSize: tab.id === 'Commercial' ? wp('2.9%') : wp('3.5%'), marginTop: hp('1%') }}
                className={`text-center ${
                  isActive ? 'text-[#008E96]' : 'text-[#101828]'
                }`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
            {tab.isNew && (
              <View className="absolute left-1/2 -translate-x-1/2 bg-[#008E96] rounded-full" style={{ top: hp('-1%'), paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.2%') }}>
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.1%') }} className="text-white">NEW</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default CategoryTabs;
