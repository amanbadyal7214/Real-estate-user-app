import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMICalculator = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(20000000);
  const [tenure, setTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(7.25);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* TopBar */}
          <View className="flex-row justify-between items-center px-[16px]  h-[64px]">
          <TouchableOpacity onPress={() => router.back()} className="p-[8px]">
            <Ionicons name="arrow-back" size={24} color="#101828" />
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-[#008E96] flex-row items-center px-[16px] py-[8px] rounded-[14px]">
            <Ionicons name="home-outline" size={16} color="#FFFFFF" />
            <Text className="text-white font-inter-medium text-[14px] ml-[8px]">Home Loans</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-[16px]" showsVerticalScrollIndicator={false}>
          {/* Main Calculator Card */}
          <View className="bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
            <Text className="text-[#101828] font-inter-medium text-[18px] mb-[24px]">EMI Calculator</Text>

            {/* Loan Amount */}
            <View className="mb-[24px]">
              <View className="flex-row justify-between items-center mb-[12px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Loan amount (INR)</Text>
                <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[120px] flex-row items-center">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px] mr-1">₹</Text>
                  <TextInput
                    style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, minWidth: 80 }}
                    value={loanAmount.toString()}
                    onChangeText={(text) => {
                      const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                      setLoanAmount(val);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              {/* Range Slider */}
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={100000}
                maximumValue={50000000}
                step={100000}
                value={loanAmount}
                onValueChange={(value) => setLoanAmount(value)}
                minimumTrackTintColor="#008E96"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#008E96"
              />
              <View className="flex-row justify-between mt-[0px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹1L</Text>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹5 Cr</Text>
              </View>
            </View>

            {/* Dropdown Placeholder */}
            <TouchableOpacity className="border border-[#E5E7EB] rounded-[10px] p-[12px] flex-row justify-between items-center mb-[24px]">
              <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828]">Select Loan Type</Text>
              <Ionicons name="chevron-down" size={20} color="#98A2B3" />
            </TouchableOpacity>

            {/* Tenure */}
            <View className="mb-[24px]">
              <View className="flex-row justify-between items-center mb-[12px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Tenure (Years)</Text>
                <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] flex-row items-center">
                  <TextInput
                    style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, minWidth: 30, textAlign: 'center' }}
                    value={tenure.toString()}
                    onChangeText={(text) => {
                      const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                      setTenure(val);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={2}
                maximumValue={30}
                step={1}
                value={tenure}
                onValueChange={(value) => setTenure(value)}
                minimumTrackTintColor="#008E96"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#008E96"
              />
              <View className="flex-row justify-between mt-[0px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">2 Years</Text>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">30 Years</Text>
              </View>
            </View>

            {/* Interest Rate */}
            <View className="mb-[24px]">
              <View className="flex-row justify-between items-center mb-[12px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Interest Rates (% P.A.)</Text>
                <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] flex-row items-center">
                  <TextInput
                    style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, minWidth: 40, textAlign: 'center' }}
                    value={interestRate.toString()}
                    onChangeText={(text) => {
                      const val = parseFloat(text) || 0;
                      setInterestRate(val);
                    }}
                    keyboardType="numeric"
                  />
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', marginLeft: 2 }}>%</Text>
                </View>
              </View>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={7}
                maximumValue={15}
                step={0.05}
                value={interestRate}
                onValueChange={(value) => setInterestRate(parseFloat(value.toFixed(2)))}
                minimumTrackTintColor="#008E96"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#008E96"
              />
              <View className="flex-row justify-between mt-[0px]">
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">7%</Text>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">15%</Text>
              </View>
            </View>

            {/* Add Pre-Payment */}
            <TouchableOpacity className="flex-row items-center mb-[24px]">
              <View className="bg-[#008E96] rounded-[4px] p-[2px] mr-[8px]">
                <Ionicons name="add" size={16} color="white" />
              </View>
              <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#008E96] font-inter-medium text-[16px]">Add Pre-Payment</Text>
            </TouchableOpacity>

            {/* Calculate Button */}
            <TouchableOpacity className="bg-[#008E96] h-[52px] rounded-[14px] items-center justify-center">
              <Text className="text-white font-inter-medium text-[16px]">Calculate EMI</Text>
            </TouchableOpacity>
          </View>

          {/* Home Loans Promo Card */}
          <LinearGradient
            colors={['#008E96', '#1CB2A9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[16px] p-[24px] mb-[16px] relative overflow-hidden"
          >
            <View className="z-10">
              <Text className="text-white font-inter-medium text-[24px] mb-[8px]">Home Loans</Text>
              <Text style={{ fontFamily: 'Inter-Regular' }} className="text-white/90 text-[14px] leading-[20px] w-[250px] mb-[24px]">
                One place to compare offers from all the best bank
              </Text>
              <TouchableOpacity className="bg-[#1CB2A9] px-[24px] py-[12px] rounded-[14px] self-start">
                <Text className="text-white font-inter-medium text-[16px]">Explore Home Loan</Text>
              </TouchableOpacity>
            </View>
            {/* Decorative Circle Icon Placeholder */}
            <View className="absolute -right-10 -top-10 bg-white/10 w-[200px] h-[200px] rounded-full items-center justify-center">
               <View className="bg-white/20 w-[120px] h-[120px] rounded-full" />
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View className="bg-white rounded-[16px] p-[16px] shadow-sm mb-[24px]">
            <TouchableOpacity 
              onPress={() => setShowInfo(!showInfo)}
              className="flex-row justify-between items-center mb-[12px]"
            >
              <Text className="text-[#101828] font-inter-medium text-[18px] flex-1">
                What is an EMI? How is it Calculated?
              </Text>
              <Ionicons name={showInfo ? "chevron-up" : "chevron-down"} size={20} color="#008E96" />
            </TouchableOpacity>

            {showInfo && (
              <>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px] mb-[16px]">
                  If you are planning to get a home loan, the EMI or Equated Monthly Instalment is the fixed amount you pay back to the bank every month until the loan is fully repaid.
                </Text>
                
                <View className="pl-[4px] mb-[16px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">1) The amount of the loan</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">2) The rate of interest</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">3) The tenure of loan</Text>
                </View>

                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px] mb-[16px]">
                  The most popular method of computation is that of the reducing balance method.
                </Text>

                {/* Formula Box */}
                <View className="bg-[#F9FAFB] rounded-[10px] p-[16px] mb-[16px]">
                  <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[8px]">Home loan EMI =</Text>
                  <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[12px]">(L×i) × (1+i) ^N / ((1+i) ^N)-1</Text>
                  <Text className="text-[#4A5565] font-inter-regular text-[12px]">L = Loan amount</Text>
                  <Text className="text-[#4A5565] font-inter-regular text-[12px]">i = Interest Rate (rate per annum divided by 12)</Text>
                  <Text className="text-[#4A5565] font-inter-regular text-[12px]">^ = to the power of</Text>
                  <Text className="text-[#4A5565] font-inter-regular text-[12px]">N = loan period in months</Text>
                </View>

                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[12px] leading-[16px] mb-[12px]">
                  (It is to be noted that an increase in the tenure of a loan will result in a lower EMI but a higher total interest outgo.)
                </Text>

                <TouchableOpacity onPress={() => setShowInfo(false)}>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#008E96] font-inter-medium text-[14px]">Read Less</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EMICalculator;
