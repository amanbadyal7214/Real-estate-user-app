import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AffordabilityCalculator = () => {
  const router = useRouter();
  const [downPayment, setDownPayment] = useState(100000);
  const [grossIncome, setGrossIncome] = useState(25000);
  const [tenure, setTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(6.75);
  const [otherEMIs, setOtherEMIs] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [showAffordabilityResult, setShowAffordabilityResult] = useState(false);
  const [affordabilityResult, setAffordabilityResult] = useState(null);

  const formatINR = (value) => `₹${Math.round(value || 0).toLocaleString('en-IN')}`;

  const getFoir = (monthlyIncome) => {
    if (monthlyIncome < 50000) return 0.5;
    if (monthlyIncome < 100000) return 0.55;
    return 0.6;
  };

  const getLtvr = (loanAmount, dp) => {
    if (loanAmount > 7500000 || dp > 1500000) return 0.75;
    if (loanAmount > 3000000 || dp > 300000) return 0.8;
    return 0.9;
  };

  const calculateAffordability = () => {
    const monthlyIncome = Number(grossIncome) || 0;
    const dp = Number(downPayment) || 0;
    const existingEmi = Number(otherEMIs) || 0;
    const years = Number(tenure) || 0;
    const annualRate = Number(interestRate) || 0;
    const months = years * 12;

    if (monthlyIncome <= 0 || months <= 0) {
      setAffordabilityResult({
        foir: 0,
        eligibleLoanAmount: 0,
        adjustedLoanAmount: 0,
        affordablePropertyCost: dp,
        minimumDownPaymentRequired: 0,
      });
      setShowAffordabilityResult(true);
      return;
    }

    const foir = getFoir(monthlyIncome);
    const availableEmiCapacity = Math.max((foir * monthlyIncome) - existingEmi, 0);
    const monthlyRate = annualRate / (12 * 100);

    let emiPerLakhFactor = 0;
    if (monthlyRate === 0) {
      emiPerLakhFactor = 1 / months;
    } else {
      const growth = (1 + monthlyRate) ** months;
      emiPerLakhFactor = (monthlyRate * growth) / (growth - 1);
    }

    const eligibleLoanAmount = emiPerLakhFactor > 0 ? (availableEmiCapacity / emiPerLakhFactor) : 0;
    const initialLtvr = getLtvr(eligibleLoanAmount, dp);
    const minimumDownPaymentRequired = initialLtvr > 0
      ? (eligibleLoanAmount * (1 - initialLtvr)) / initialLtvr
      : 0;

    const adjustedLoanAmount = dp < minimumDownPaymentRequired && (1 - initialLtvr) > 0
      ? (dp * initialLtvr) / (1 - initialLtvr)
      : eligibleLoanAmount;

    const affordablePropertyCost = Math.max(adjustedLoanAmount, 0) + dp;

    setAffordabilityResult({
      foir,
      eligibleLoanAmount: Math.max(eligibleLoanAmount, 0),
      adjustedLoanAmount: Math.max(adjustedLoanAmount, 0),
      affordablePropertyCost: Math.max(affordablePropertyCost, 0),
      minimumDownPaymentRequired: Math.max(minimumDownPaymentRequired, 0),
    });
    setShowAffordabilityResult(true);
  };

  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    setShowAffordabilityResult(false);
  };

  const handleGrossIncomeChange = (value) => {
    setGrossIncome(value);
    setShowAffordabilityResult(false);
  };

  const handleTenureChange = (value) => {
    setTenure(value);
    setShowAffordabilityResult(false);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value);
    setShowAffordabilityResult(false);
  };

  const handleOtherEmisChange = (value) => {
    setOtherEMIs(value);
    setShowAffordabilityResult(false);
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* TopBar */}
          <View className="flex-row justify-between items-center px-[16px] py-[12px] h-[64px]">
            <TouchableOpacity onPress={() => router.back()} className="p-[8px]">
              <Ionicons name="arrow-back" size={24} color="#101828" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/ComingSoon')} className="bg-[#008E96] flex-row items-center px-[16px] py-[8px] rounded-[14px]">
              <Ionicons name="home-outline" size={16} color="#FFFFFF" />
              <Text className="text-white font-inter-medium text-[14px] ml-[8px]">Home Loans</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-[16px]" showsVerticalScrollIndicator={false}>
            {/* Main Calculator Card */}
            <View className="bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
              <Text className="text-[#101828] font-inter-medium text-[18px] mb-[24px]">Affordability Calculator</Text>

              {/* Down Payment */}
              <View className="mb-[24px]">
                <View className="flex-row justify-between items-center mb-[12px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Down Payment (INR)</Text>
                  <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[110px] flex-row items-center justify-end">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px] mr-1">₹</Text>
                    <TextInput
                      style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, textAlign: 'right' }}
                      value={downPayment.toString()}
                      onChangeText={(text) => {
                        const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                        handleDownPaymentChange(val);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10000000}
                  step={10000}
                  value={downPayment}
                  onValueChange={(value) => handleDownPaymentChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-[0px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹0</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹1 Cr</Text>
                </View>
              </View>

              {/* Gross Income */}
              <View className="mb-[24px]">
                <View className="flex-row justify-between items-center mb-[12px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Gross Income (Monthly)</Text>
                  <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[100px] flex-row items-center justify-end">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px] mr-1">₹</Text>
                    <TextInput
                      style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, textAlign: 'right' }}
                      value={grossIncome.toString()}
                      onChangeText={(text) => {
                        const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                        handleGrossIncomeChange(val);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={5000000}
                  step={5000}
                  value={grossIncome}
                  onValueChange={(value) => handleGrossIncomeChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-[0px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹0</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹50 L</Text>
                </View>
              </View>

              {/* Tenure */}
              <View className="mb-[24px]">
                <View className="flex-row justify-between items-center mb-[12px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Tenure (Years)</Text>
                  <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[45px] items-center">
                    <TextInput
                      style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, textAlign: 'center' }}
                      value={tenure.toString()}
                      onChangeText={(text) => {
                        const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                        handleTenureChange(val);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                  value={tenure}
                  onValueChange={(value) => handleTenureChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-[0px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">1</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">30</Text>
                </View>
              </View>

              {/* Interest Rate */}
              <View className="mb-[24px]">
                <View className="flex-row justify-between items-center mb-[12px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Interest Rates (%P.A.)</Text>
                  <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[60px] flex-row items-center justify-center">
                    <TextInput
                      style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, textAlign: 'center' }}
                      value={interestRate.toString()}
                      onChangeText={(text) => {
                        const val = parseFloat(text) || 0;
                        handleInterestRateChange(val);
                      }}
                      keyboardType="numeric"
                    />
                    <Text style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', marginLeft: 1 }}>%</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={15}
                  step={0.05}
                  value={interestRate}
                  onValueChange={(value) => handleInterestRateChange(parseFloat(value.toFixed(2)))}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-[0px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">1%</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">15%</Text>
                </View>
              </View>

              {/* Other EMIs */}
              <View className="mb-[24px]">
                <View className="flex-row justify-between items-center mb-[12px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px]">Other EMIs (Monthly)</Text>
                  <View className="bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] py-[4px] min-w-[70px] flex-row items-center justify-end">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#101828] text-[16px] mr-1">₹</Text>
                    <TextInput
                      style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#101828', padding: 0, textAlign: 'right' }}
                      value={otherEMIs.toString()}
                      onChangeText={(text) => {
                        const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                        handleOtherEmisChange(val);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={5000000}
                  step={5000}
                  value={otherEMIs}
                  onValueChange={(value) => handleOtherEmisChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-[0px]">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹0</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#6A7282] text-[12px]">₹50 L</Text>
                </View>
              </View>

              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateAffordability}
                className="bg-[#008E96] h-[52px] rounded-[14px] items-center justify-center"
              >
                <Text className="text-white font-inter-medium text-[16px]">Calculate Affordability</Text>
              </TouchableOpacity>

              {showAffordabilityResult && affordabilityResult && (
                <View className="mt-[16px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-[12px]">
                  <View className="flex-row justify-between mb-[8px]">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px]">Affordable Property Cost</Text>
                    <Text className="text-[#008E96] font-inter-semibold text-[14px]">{formatINR(affordabilityResult.affordablePropertyCost)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-[8px]">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px]">Loan Amount</Text>
                    <Text className="text-[#101828] font-inter-semibold text-[14px]">{formatINR(affordabilityResult.adjustedLoanAmount)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-[8px]">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px]">Eligible Loan Amount</Text>
                    <Text className="text-[#101828] font-inter-semibold text-[14px]">{formatINR(affordabilityResult.eligibleLoanAmount)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-[8px]">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px]">Minimum Down Payment</Text>
                    <Text className="text-[#101828] font-inter-semibold text-[14px]">{formatINR(affordabilityResult.minimumDownPaymentRequired)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px]">FOIR Used</Text>
                    <Text className="text-[#101828] font-inter-semibold text-[14px]">{`${Math.round((affordabilityResult.foir || 0) * 100)}%`}</Text>
                  </View>
                </View>
              )}
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
              <View className="absolute -right-10 -top-10 bg-white/10 w-[200px] h-[200px] rounded-full items-center justify-center">
                 <View className="bg-white/20 w-[120px] h-[120px] rounded-full" />
              </View>
            </LinearGradient>

            {/* Info Card */}
            <View className="bg-white rounded-[16px] p-[16px] shadow-sm mb-[24px]">
              <TouchableOpacity 
                onPress={() => setShowInfo(!showInfo)}
                className="flex-row justify-between items-start mb-[12px]"
              >
                <Text className="text-[#101828] font-inter-medium text-[18px] flex-1 leading-[27px]">
                  What is an Affordability Calculator? How is it calculated?
                </Text>
                <Ionicons name={showInfo ? "chevron-up" : "chevron-down"} size={20} color="#008E96" style={{ marginTop: 4 }} />
              </TouchableOpacity>

              {showInfo && (
                <>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px] mb-[16px]">
                    Home Loan Affordability calculator which helps to determine how much house one can afford based on their income, down payment, current EMIs, and the terms of the loan like the interest rate and tenure. It prevents over-extending finances.
                  </Text>
                  
                  <View className="pl-[4px] mb-[16px]">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">1) Down Payment</Text>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">2) Gross Income (Monthly)</Text>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[14px]">3) Tenure (Years)</Text>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">4) Interest Rate (% P.A.)</Text>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px]">5) Other EMIs (Monthly)</Text>
                  </View>

                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-[14px] leading-[22px] mb-[16px]">
                    Mathematically the following convention is applied:
                  </Text>

                  {/* Formula Box */}
                  <View className="bg-[#F9FAFB] rounded-[10px] p-[16px] mb-[16px]">
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[8px]">months = tenure * 12</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[4px]">FOIR (Fixed Obligation to Income Ratio) =</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px]">0.5 ; Monthly Income &lt; 50,000</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px]">0.55 ; 50,000 &lt;= Monthly Income &lt; 1,00,000</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px] mb-[12px]">0.6 ; Monthly Income &gt;= 1,00,000</Text>
                    
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[12px]">EMI = (Interest Rate / 1200) * ([(1+Interest Rate/1200)^months] / [(1+Interest Rate/1200)^(months-1)])</Text>
                    
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[12px]">Eligible Loan Amount = ((FOIR * Monthly Income) - Other EMIs) / EMI</Text>

                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[4px]">LTVR (Loan to value ratio) =</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px]">0.75 ; Loan &gt; 75,00,000 or Down Payment &gt; 15,00,000</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px]">0.8 ; 30,00,000 &lt; Loan &lt;= 75,00,000 or 3,00,000 &lt; Down Payment &lt;= 15,00,000</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px] mb-[12px]">0.9 ; Loan &lt;= 30,00,000 or Down Payment &lt;= 3,00,000</Text>

                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[12px]">Minimum Down Payment required for availing the eligible loan amount = Eligible Loan Amount * (1 - LTVR) / LTVR</Text>

                    <Text className="text-[#4A5565] font-inter-regular text-[12px] mb-[4px]">IF Down Payment &lt; Minimum Down Payment Required</Text>
                    <Text className="text-[#4A5565] font-inter-regular text-[12px] ml-[8px] mb-[12px]">Then Loan Amount = (Down Payment * LTVR) / (1 - LTVR)</Text>
                    
                    <Text className="text-[#4A5565] font-inter-regular text-[12px]">Affordable Property Cost = Loan Amount + Down Payment</Text>
                  </View>

                  <TouchableOpacity onPress={() => setShowInfo(false)}>
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4B5BF6] font-inter-medium text-[14px]">Read Less</Text>
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

export default AffordabilityCalculator;
