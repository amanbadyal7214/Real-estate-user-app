import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
        <View style={{ flex: 1 }}>
          {/* TopBar */}
          <View className="flex-row justify-between items-center" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%'), height: hp('7.9%') }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('2.1%') }}>
              <Ionicons name="arrow-back" size={wp('6.4%')} color="#101828" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/ComingSoon')}
              className="bg-[#008E96] flex-row items-center"
              style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1%'), borderRadius: wp('3.7%') }}
            >
              <Ionicons name="home-outline" size={wp('4.3%')} color="#FFFFFF" />
              <Text className="text-white font-medium ml-[8px]" style={{ fontSize: wp('3.7%'), marginLeft: wp('2.1%') }}>Home Loans</Text>
            </TouchableOpacity>
          </View>
 
          <ScrollView style={{ flex: 1 }} style={{ paddingHorizontal: wp('4.3%') }} showsVerticalScrollIndicator={false}>
            {/* Main Calculator Card */}
            <View className="bg-white shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
              <Text className="text-[#101828] font-medium" style={{ fontSize: wp('4.8%'), marginBottom: hp('3%') }}>Affordability Calculator</Text>
 
              {/* Down Payment */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Down Payment (INR)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('29.3%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'right' }}
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
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={0}
                  maximumValue={10000000}
                  step={10000}
                  value={downPayment}
                  onValueChange={(value) => handleDownPaymentChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹0</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹1 Cr</Text>
                </View>
              </View>
 
              {/* Gross Income */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Gross Income (Monthly)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('26.7%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'right' }}
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
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={0}
                  maximumValue={5000000}
                  step={5000}
                  value={grossIncome}
                  onValueChange={(value) => handleGrossIncomeChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹0</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹50 L</Text>
                </View>
              </View>
 
              {/* Tenure */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Tenure (Years)</Text>
                  <View className="bg-white border border-[#E5E7EB] items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('12%') }}>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center' }}
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
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                  value={tenure}
                  onValueChange={(value) => handleTenureChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">1</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">30</Text>
                </View>
              </View>
 
              {/* Interest Rate */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Interest Rates (%P.A.)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('16%') }}>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center' }}
                      value={interestRate.toString()}
                      onChangeText={(text) => {
                        const val = parseFloat(text) || 0;
                        handleInterestRateChange(val);
                      }}
                      keyboardType="numeric"
                    />
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', marginLeft: 1 }}>%</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={1}
                  maximumValue={15}
                  step={0.05}
                  value={interestRate}
                  onValueChange={(value) => handleInterestRateChange(parseFloat(value.toFixed(2)))}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">1%</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">15%</Text>
                </View>
              </View>
 
              {/* Other EMIs */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Other EMIs (Monthly)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('18.7%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'right' }}
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
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={0}
                  maximumValue={5000000}
                  step={5000}
                  value={otherEMIs}
                  onValueChange={(value) => handleOtherEmisChange(value)}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹0</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹50 L</Text>
                </View>
              </View>
 
              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateAffordability}
                className="bg-[#008E96] items-center justify-center"
                style={{ height: hp('6.4%'), borderRadius: wp('3.7%') }}
              >
                <Text className="text-white font-medium" style={{ fontSize: wp('4.3%') }}>Calculate Affordability</Text>
              </TouchableOpacity>
 
              {showAffordabilityResult && affordabilityResult && (
                <View className="bg-[#F9FAFB] border border-[#E5E7EB]" style={{ marginTop: hp('2%'), borderRadius: wp('3.2%'), padding: wp('3.2%') }}>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Affordable Property Cost</Text>
                    <Text className="text-[#008E96] font-semibold" style={{ fontSize: wp('3.7%') }}>{formatINR(affordabilityResult.affordablePropertyCost)}</Text>
                  </View>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Loan Amount</Text>
                    <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('3.7%') }}>{formatINR(affordabilityResult.adjustedLoanAmount)}</Text>
                  </View>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Eligible Loan Amount</Text>
                    <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('3.7%') }}>{formatINR(affordabilityResult.eligibleLoanAmount)}</Text>
                  </View>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Minimum Down Payment</Text>
                    <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('3.7%') }}>{formatINR(affordabilityResult.minimumDownPaymentRequired)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">FOIR Used</Text>
                    <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('3.7%') }}>{`${Math.round((affordabilityResult.foir || 0) * 100)}%`}</Text>
                  </View>
                </View>
              )}
            </View>
 
            {/* Home Loans Promo Card */}
            <LinearGradient
              colors={['#008E96', '#1CB2A9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="relative overflow-hidden"
              style={{ borderRadius: wp('4.3%'), padding: wp('6.4%'), marginBottom: hp('2%') }}
            >
              <View className="z-10">
                <Text className="text-white font-medium" style={{ fontSize: wp('6.4%'), marginBottom: hp('1%') }}>Home Loans</Text>
                <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.3%'), width: wp('66.7%'), marginBottom: hp('3%') }} className="text-white/90">
                  One place to compare offers from all the best bank
                </Text>
                <TouchableOpacity
                  className="bg-[#1CB2A9] self-start"
                  style={{ paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.7%') }}
                >
                  <Text className="text-white font-medium" style={{ fontSize: wp('4.3%') }}>Explore Home Loan</Text>
                </TouchableOpacity>
              </View>
              <View className="absolute bg-white/10 rounded-full items-center justify-center" style={{ right: -wp('10%'), top: -wp('10%'), width: wp('53.3%'), height: wp('53.3%') }}>
                 <View className="bg-white/20 rounded-full" style={{ width: wp('32%'), height: wp('32%') }} />
              </View>
            </LinearGradient>
 
            {/* Info Card */}
            <View className="bg-white shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('3%') }}>
              <TouchableOpacity 
                onPress={() => setShowInfo(!showInfo)}
                className="flex-row justify-between items-start"
                style={{ marginBottom: hp('1.5%') }}
              >
                <Text className="text-[#101828] font-medium flex-1" style={{ fontSize: wp('4.8%'), lineHeight: wp('7.2%') }}>
                  What is an Affordability Calculator? How is it calculated?
                </Text>
                <Ionicons name={showInfo ? "chevron-up" : "chevron-down"} size={wp('5.3%')} color="#008E96" style={{ marginTop: 4 }} />
              </TouchableOpacity>
 
              {showInfo && (
                <>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginBottom: hp('2%') }} className="text-[#4A5565]">
                    Home Loan Affordability calculator which helps to determine how much house one can afford based on their income, down payment, current EMIs, and the terms of the loan like the interest rate and tenure. It prevents over-extending finances.
                  </Text>
                  
                  <View style={{ paddingLeft: wp('1%'), marginBottom: hp('2%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">1) Down Payment</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">2) Gross Income (Monthly)</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">3) Tenure (Years)</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">4) Interest Rate (% P.A.)</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">5) Other EMIs (Monthly)</Text>
                  </View>
 
                  <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginBottom: hp('2%') }} className="text-[#4A5565]">
                    Mathematically the following convention is applied:
                  </Text>
 
                  {/* Formula Box */}
                  <View className="bg-[#F9FAFB]" style={{ borderRadius: wp('2.7%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1%') }}>months = tenure * 12</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('0.5%') }}>FOIR (Fixed Obligation to Income Ratio) =</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%') }}>0.5 ; Monthly Income &lt; 50,000</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%') }}>0.55 ; 50,000 &lt;= Monthly Income &lt; 1,00,000</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%'), marginBottom: hp('1.5%') }}>0.6 ; Monthly Income &gt;= 1,00,000</Text>
                    
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>EMI = (Interest Rate / 1200) * ([(1+Interest Rate/1200)^months] / [(1+Interest Rate/1200)^(months-1)])</Text>
                    
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>Eligible Loan Amount = ((FOIR * Monthly Income) - Other EMIs) / EMI</Text>
 
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('0.5%') }}>LTVR (Loan to value ratio) =</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%') }}>0.75 ; Loan &gt; 75,00,000 or Down Payment &gt; 15,00,000</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%') }}>0.8 ; 30,00,000 &lt; Loan &lt;= 75,00,000 or 3,00,000 &lt; Down Payment &lt;= 15,00,000</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%'), marginBottom: hp('1.5%') }}>0.9 ; Loan &lt;= 30,00,000 or Down Payment &lt;= 3,00,000</Text>
 
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>Minimum Down Payment required for availing the eligible loan amount = Eligible Loan Amount * (1 - LTVR) / LTVR</Text>
 
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('0.5%') }}>IF Down Payment &lt; Minimum Down Payment Required</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginLeft: wp('2%'), marginBottom: hp('1.5%') }}>Then Loan Amount = (Down Payment * LTVR) / (1 - LTVR)</Text>
                    
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%') }}>Affordable Property Cost = Loan Amount + Down Payment</Text>
                  </View>
 
                  <TouchableOpacity onPress={() => setShowInfo(false)}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4B5BF6] font-medium">Read Less</Text>
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
