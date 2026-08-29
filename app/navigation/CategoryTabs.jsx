import { Building, Building2, Home, Key, LandPlot } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DEFAULT_TABS = [
  { id: 'Buy', label: 'Buy', icon: Home, color: '#008E96' },
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },
];

const PLOT_TABS = [
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'Buy', label: 'Buy', icon: Home, color: '#008E96' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },

];

const COMMERCIAL_TABS = [
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#008E96' },
  { id: 'Buy', label: 'Buy', icon: Home, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#101828' },
];

const PG_TABS = [
  { id: 'Buy', label: 'Buy', icon: Home, color: '#101828' },
  { id: 'Rent', label: 'Rentals', icon: Key, color: '#101828' },
  // { id: 'PG', label: 'PG', icon: HomeIcon, color: '#008E96' },
  { id: 'Project', label: 'Project', icon: Building2, color: '#101828' },
  { id: 'Plot', label: 'Plot', icon: LandPlot, color: '#101828' },
  { id: 'Commercial', label: 'Commercial', icon: Building, color: '#101828' },
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
      // Tab width is wp('18%'), marginRight is wp('2.7%'). Total wp('20.7%') per tab.
      const scrollToX = activeIndex * wp('20.7%');
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
      style={{ marginBottom: hp('1.5%') }}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <View key={tab.id} style={{ width: wp('18%'), marginRight: wp('2.7%') }} className="relative">
            <TouchableOpacity
              onPress={() => onTabPress?.(tab.id)}
              style={{ height: hp('8.2%'), justifyContent: 'center', paddingHorizontal: wp('1.6%'), borderRadius: wp('3.5%') }}
              className={`items-center bg-white border-2 ${isActive ? 'border-[#008E96]' : 'border-transparent'
                }`}
            >
              <Icon size={wp('4.5%')} color={isActive ? '#008E96' : '#101828'} />
              <Text
                style={{ fontWeight: '500', fontSize: tab.id === 'Commercial' ? wp('2.5%') : wp('3%'), marginTop: hp('0.6%') }}
                className={`text-center ${isActive ? 'text-[#008E96]' : 'text-[#101828]'
                  }`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
            {tab.isNew && (
              <View className="absolute left-1/2 -translate-x-1/2 bg-[#008E96] rounded-full" style={{ top: hp('-1%'), paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.2%') }}>
                <Text style={{ fontWeight: '700', fontSize: wp('2.1%') }} className="text-white">NEW</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default CategoryTabs;
