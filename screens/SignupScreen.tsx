import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const scheme = useColorScheme();
  const c = useMemo(() => getTheme(scheme === 'dark'), [scheme]);

  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );
  const passwordValid = useMemo(() => password.length >= 8, [password]);
  const usernameValid = useMemo(() => username.trim().length >= 3, [username]);
  const formValid = useMemo(
    () => emailValid && passwordValid && usernameValid,
    [emailValid, passwordValid, usernameValid]
  );

  const handleSignup = async () => {
    setError(null);

    if (!formValid) {
      setError('נא למלא את כל השדות בצורה תקינה');
      return;
    }

    try {
      setLoading(true);
      await authService.signUp(email.trim(), password, username.trim());
      Alert.alert(
        '✅ נשלח מייל אימות',
        `שלחנו קוד אימות ל-${email}\n\nבדוק את תיבת הדואר שלך (כולל ספאם) ולחץ על הקישור לאימות החשבון.`,
        [
          {
            text: 'הבנתי',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (e: any) {
      console.error('Signup failed:', e);
      if (e.message?.includes('already registered')) {
        setError('המייל כבר רשום במערכת');
      } else {
        setError(e.message || 'הרשמה נכשלה');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.brand, { color: c.text }]}>Veeky</Text>
          <Text style={[styles.subtitle, { color: c.muted }]}>
            הצטרפו לקהילה של מטיילים 🌍
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: c.muted }]}>שם משתמש</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="לפחות 3 תווים"
              placeholderTextColor={c.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              style={[styles.input, { color: c.text, borderColor: c.inputBorder, backgroundColor: c.inputBg }]}
            />
            {!usernameValid && username.length > 0 && (
              <Text style={[styles.helper, { color: c.danger }]}>שם משתמש חייב להכיל 3 תווים לפחות</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: c.muted }]}>אימייל</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor={c.placeholder}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              style={[styles.input, { color: c.text, borderColor: c.inputBorder, backgroundColor: c.inputBg }]}
            />
            {!emailValid && email.length > 0 && (
              <Text style={[styles.helper, { color: c.danger }]}>אימייל לא תקין</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: c.muted }]}>סיסמה</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="מינימום 8 תווים"
                placeholderTextColor={c.placeholder}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignup}
                style={[styles.input, styles.passwordInput, { color: c.text, borderColor: c.inputBorder, backgroundColor: c.inputBg }]}
              />
              <TouchableOpacity
                onPress={() => setShowPw((s) => !s)}
                style={[styles.showBtn, { borderColor: c.inputBorder, backgroundColor: c.chipBg }]}
              >
                <Text style={{ color: c.muted }}>{showPw ? 'הסתר' : 'הצג'}</Text>
              </TouchableOpacity>
            </View>
            {!passwordValid && password.length > 0 && (
              <Text style={[styles.helper, { color: c.danger }]}>סיסמה חייבת לכלול 8 תווים לפחות</Text>
            )}
          </View>

          {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: formValid ? c.primary : c.disabled, opacity: loading ? 0.7 : 1 }]}
            onPress={handleSignup}
            disabled={loading || !formValid}
          >
            {loading ? (
              <ActivityIndicator color={c.primaryText} />
            ) : (
              <Text style={[styles.primaryText, { color: c.primaryText }]}>הרשמה</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkBtn}>
            <Text style={[styles.link, { color: c.link }]}>כבר יש לך חשבון? התחבר</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <Text style={[styles.terms, { color: c.muted }]}>
            בלחיצה על "הרשמה" אתה מאשר את{' '}
            <Text style={{ color: c.link }}>תנאי השימוש</Text> ו
            <Text style={{ color: c.link }}>מדיניות הפרטיות</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTheme(dark: boolean) {
  const primary = '#00D5FF';
  return dark
    ? {
        bg: '#0B0B0C', card: '#141416', text: '#FFFFFF', muted: '#B4B6BF',
        border: '#2A2B31', placeholder: '#6C6F7A', inputBg: '#1A1B1E',
        inputBorder: '#2A2B31', chipBg: '#18191B', primary, primaryText: '#0B0B0C',
        link: primary, disabled: '#2E2F36', danger: '#FF6B6B',
      }
    : {
        bg: '#F7F8FA', card: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
        border: '#E5E7EB', placeholder: '#9CA3AF', inputBg: '#FFFFFF',
        inputBorder: '#E5E7EB', chipBg: '#F3F4F6', primary, primaryText: '#0B0B0C',
        link: '#007EA0', disabled: '#D1D5DB', danger: '#DC2626',
      };
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  brand: { fontSize: 40, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { marginTop: 6, fontSize: 14, textAlign: 'center' },
  card: { borderWidth: 1, padding: 16, borderRadius: 16, gap: 12 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  helper: { fontSize: 12, marginTop: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  showBtn: { marginLeft: 8, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  primaryBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { fontWeight: '700', fontSize: 16 },
  linkBtn: { marginTop: 8, alignItems: 'center' },
  link: { fontSize: 14, fontWeight: '600' },
  bottomActions: { alignItems: 'center', marginTop: 16 },
  terms: { textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 6 },
});
