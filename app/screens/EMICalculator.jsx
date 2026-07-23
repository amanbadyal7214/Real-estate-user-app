import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMICalculator = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(20000000);
  const [tenure, setTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(7.25);
  const [showInfo, setShowInfo] = useState(true);
  const [emiResult, setEmiResult] = useState(null);
  const [showEmiResult, setShowEmiResult] = useState(false);

  const [loanAmountInput, setLoanAmountInput] = useState('20000000');
  const [tenureInput, setTenureInput] = useState('30');
  const [interestRateInput, setInterestRateInput] = useState('7.25');

  const calculateEmi = () => {
    const principal = Number(loanAmount) || 0;
    const monthlyRate = (Number(interestRate) || 0) / (12 * 100);
    const totalMonths = (Number(tenure) || 0) * 12;

    if (principal <= 0 || totalMonths <= 0) {
      setEmiResult({
        monthlyEmi: 0,
        totalAmount: 0,
        totalInterest: 0,
      });
      setShowEmiResult(true);
      return;
    }

    let monthlyEmi = 0;
    if (monthlyRate === 0) {
      monthlyEmi = principal / totalMonths;
    } else {
      const growth = (1 + monthlyRate) ** totalMonths;
      monthlyEmi = (principal * monthlyRate * growth) / (growth - 1);
    }

    const totalAmount = monthlyEmi * totalMonths;
    const totalInterest = totalAmount - principal;

    setEmiResult({
      monthlyEmi,
      totalAmount,
      totalInterest,
    });
    setShowEmiResult(true);
  };

  const formatINR = (value) => `₹${Math.round(value || 0).toLocaleString('en-IN')}`;

  const handleLoanAmountChange = (value) => {
    setLoanAmount(value);
    setLoanAmountInput(value.toString());
    setShowEmiResult(false);
  };

  const handleLoanAmountText = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setLoanAmountInput(cleanText);
    const val = parseInt(cleanText, 10) || 0;
    setLoanAmount(val);
    setShowEmiResult(false);
  };

  const handleLoanAmountBlur = () => {
    let val = loanAmount;
    if (val < 100000) val = 100000;
    if (val > 50000000) val = 50000000;
    setLoanAmount(val);
    setLoanAmountInput(val.toString());
  };

  const handleTenureChange = (value) => {
    setTenure(value);
    setTenureInput(value.toString());
    setShowEmiResult(false);
  };

  const handleTenureText = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setTenureInput(cleanText);
    const val = parseInt(cleanText, 10) || 0;
    setTenure(val);
    setShowEmiResult(false);
  };

  const handleTenureBlur = () => {
    let val = tenure;
    if (val < 2) val = 2;
    if (val > 30) val = 30;
    setTenure(val);
    setTenureInput(val.toString());
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value);
    setInterestRateInput(value.toString());
    setShowEmiResult(false);
  };

  const handleInterestRateText = (text) => {
    setInterestRateInput(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      setInterestRate(parsed);
    } else {
      setInterestRate(0);
    }
    setShowEmiResult(false);
  };

  const handleInterestRateBlur = () => {
    let val = interestRate;
    if (val < 7) val = 7;
    if (val > 15) val = 15;
    setInterestRate(val);
    setInterestRateInput(val.toString());
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* TopBar */}
          <View className="flex-row justify-between items-center" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%'), height: hp('7.9%') }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('2.1%') }}>
              <Ionicons name="arrow-back" size={wp('6.4%')} color="#101828" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/screens/ComingSoon')}
              className="bg-[#008E96] flex-row items-center"
              style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1%'), borderRadius: wp('3.7%') }}
            >
              <Ionicons name="home-outline" size={wp('4.3%')} color="#FFFFFF" />
              <Text style={{ fontSize: wp('3.7%'), marginLeft: wp('2.1%') }} className="text-white font-medium">Home Loans</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="flex-1" 
            style={{ paddingHorizontal: wp('4.3%') }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('4%') }}
          >
            {/* Main Calculator Card */}
            <View className="bg-white shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
              <Text className="text-[#101828] font-medium" style={{ fontSize: wp('4.8%'), marginBottom: hp('3%') }}>EMI Calculator</Text>

              {/* Loan Amount */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Loan amount (INR)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('32%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, minWidth: wp('20%'), textAlign: 'right' }}
                      value={loanAmountInput}
                      onChangeText={handleLoanAmountText}
                      onBlur={handleLoanAmountBlur}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* Range Slider */}
                <Slider
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={100000}
                  maximumValue={50000000}
                  step={100000}
                  value={loanAmount}
                  onValueChange={handleLoanAmountChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹1L</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">₹5 Cr</Text>
                </View>
              </View>

              {/* Dropdown Placeholder */}
              <TouchableOpacity 
                className="border border-[#E5E7EB] flex-row justify-between items-center bg-white"
                style={{ borderRadius: wp('2.7%'), padding: wp('3.2%'), marginBottom: hp('3%') }}
              >
                <Text style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828' }}>Select Loan Type</Text>
                <Ionicons name="chevron-down" size={wp('5.3%')} color="#98A2B3" />
              </TouchableOpacity>

              {/* Tenure */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Tenure (Years)</Text>
                  <View className="bg-white border border-[#E5E7EB] items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('12%') }}>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center', minWidth: wp('8%') }}
                      value={tenureInput}
                      onChangeText={handleTenureText}
                      onBlur={handleTenureBlur}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={2}
                  maximumValue={30}
                  step={1}
                  value={tenure}
                  onValueChange={handleTenureChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">2 Years</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">30 Years</Text>
                </View>
              </View>

              {/* Interest Rate */}
              <View style={{ marginBottom: hp('3%') }}>
                <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#101828]">Interest Rates (% P.A.)</Text>
                  <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('18%') }}>
                    <TextInput
                      style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center', minWidth: wp('10%') }}
                      value={interestRateInput}
                      onChangeText={handleInterestRateText}
                      onBlur={handleInterestRateBlur}
                      keyboardType="numeric"
                    />
                    <Text style={{ fontWeight: '400', fontSize: wp('4.3%'), color: '#101828', marginLeft: 1 }}>%</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: hp('4.9%') }}
                  minimumValue={7}
                  maximumValue={15}
                  step={0.05}
                  value={interestRate}
                  onValueChange={handleInterestRateChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">7%</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-[#6A7282]">15%</Text>
                </View>
              </View>

              {/* Add Pre-Payment */}
              <TouchableOpacity className="flex-row items-center" style={{ marginBottom: hp('3%') }}>
                <View className="bg-[#008E96]" style={{ borderRadius: wp('1%'), padding: wp('0.5%'), marginRight: wp('2.1%') }}>
                  <Ionicons name="add" size={wp('4.3%')} color="white" />
                </View>
                <Text style={{ fontWeight: '400', fontSize: wp('4.3%') }} className="text-[#008E96] font-medium">Add Pre-Payment</Text>
              </TouchableOpacity>

              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateEmi}
                className="bg-[#008E96] items-center justify-center"
                style={{ height: hp('6.4%'), borderRadius: wp('3.7%') }}
              >
                <Text style={{ fontSize: wp('4.3%') }} className="text-white font-medium">Calculate EMI</Text>
              </TouchableOpacity>

              {showEmiResult && emiResult && (
                <View className="border border-[#E5E7EB] bg-[#F9FAFB]" style={{ marginTop: hp('2%'), borderRadius: wp('3.2%'), padding: wp('3.2%') }}>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Monthly EMI</Text>
                    <Text style={{ fontSize: wp('3.7%') }} className="text-[#101828] font-semibold">{formatINR(emiResult.monthlyEmi)}</Text>
                  </View>
                  <View className="flex-row justify-between" style={{ marginBottom: hp('1%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Total Interest</Text>
                    <Text style={{ fontSize: wp('3.7%') }} className="text-[#101828] font-semibold">{formatINR(emiResult.totalInterest)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#4A5565]">Total Amount</Text>
                    <Text style={{ fontSize: wp('3.7%') }} className="text-[#008E96] font-semibold">{formatINR(emiResult.totalAmount)}</Text>
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
                <Text style={{ fontSize: wp('6.4%'), marginBottom: hp('1%') }} className="text-white font-medium">Home Loans</Text>
                <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.3%'), width: wp('66.7%'), marginBottom: hp('3%') }} className="text-white/90">
                  One place to compare offers from all the best bank
                </Text>
                <TouchableOpacity 
                  className="bg-[#1CB2A9] self-start"
                  style={{ paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.7%') }}
                >
                  <Text style={{ fontSize: wp('4.3%') }} className="text-white font-medium">Explore Home Loan</Text>
                </TouchableOpacity>
              </View>
              {/* Decorative Circle Icon Placeholder */}
              <View className="absolute bg-white/10 items-center justify-center" style={{ right: -wp('10.7%'), top: -wp('10.7%'), width: wp('53.3%'), height: wp('53.3%'), borderRadius: wp('26.7%') }}>
                 <View className="bg-white/20" style={{ width: wp('32%'), height: wp('32%'), borderRadius: wp('16%') }} />
              </View>
            </LinearGradient>

            {/* Info Card */}
            <View className="bg-white shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('3%'), borderWidth: 1, borderColor: '#E5E7EB' }}>
              <TouchableOpacity 
                onPress={() => setShowInfo(!showInfo)}
                className="flex-row justify-between items-center"
                style={{ marginBottom: showInfo ? hp('1.5%') : 0 }}
              >
                <Text className="text-[#101828] font-medium flex-1" style={{ fontSize: wp('4.8%'), lineHeight: wp('7.2%') }}>
                  What is an EMI? How is it Calculated?
                </Text>
                <Ionicons name={showInfo ? "chevron-up" : "chevron-down"} size={wp('5.3%')} color="#008E96" />
              </TouchableOpacity>

              {showInfo && (
                <>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginBottom: hp('2%') }} className="text-[#4A5565]">
                    If you are planning to get a home loan, the EMI or Equated Monthly Instalment is the fixed amount you pay back to the bank every month until the loan is fully repaid.
                  </Text>
                  
                  <View style={{ paddingLeft: wp('1%'), marginBottom: hp('2%') }}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">1) The amount of the loan</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">2) The rate of interest</Text>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">3) The tenure of loan</Text>
                  </View>

                  <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), lineHeight: wp('5.9%'), marginBottom: hp('2%') }} className="text-[#4A5565]">
                    The most popular method of computation is that of the reducing balance method.
                  </Text>

                  {/* Formula Box */}
                  <View className="bg-[#F9FAFB]" style={{ borderRadius: wp('2.7%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1%') }}>Home loan EMI =</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>(L×i) × (1+i) ^N / ((1+i) ^N)-1</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%') }}>L = Loan amount</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%') }}>i = Interest Rate (rate per annum divided by 12)</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%') }}>^ = to the power of</Text>
                    <Text className="text-[#4A5565] font-normal" style={{ fontSize: wp('3.2%') }}>N = loan period in months</Text>
                  </View>

                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), lineHeight: wp('4.3%'), marginBottom: hp('1.5%') }} className="text-[#4A5565]">
                    (It is to be noted that an increase in the tenure of a loan will result in a lower EMI but a higher total interest outgo.)
                  </Text>

                  <TouchableOpacity onPress={() => setShowInfo(false)}>
                    <Text style={{ fontWeight: '400', fontSize: wp('3.7%') }} className="text-[#008E96] font-medium">Read Less</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default EMICalculator;
