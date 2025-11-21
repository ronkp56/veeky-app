// screens/LoginScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const scheme = useColorScheme();
  const c = useMemo(() => getTheme(scheme === 'dark'), [scheme]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /.+@.+\..+/.test(email.trim());
  const passwordValid = password.length >= 8;
  const formValid = emailValid && passwordValid;

  const handleLogin = async () => {
    setError(null);
    if (!formValid) {
      setError("נא למלא אימייל וסיסמה תקינים (מינ' 8 תווים).");
      return;
    }
    try {
      setLoading(true);
      // TODO: replace with your real auth call, e.g. await api.login({ email, password })
      await wait(900); // simulate network
      // TODO: store tokens securely (expo-secure-store) and hydrate user state
      navigation.replace('MainTabs');
    } catch (_e) {
      setError('כניסה נכשלה. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // TODO: integrate OAuth (e.g., expo-auth-session / backend)
      await wait(600);
      navigation.replace('MainTabs');
    } catch {
      setError('התחברות עם Google נכשלה.');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    // Optional: flag guest mode in your global state
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Brand / Title */}
          <View style={styles.header}>
            <Text style={[styles.brand, { color: c.text }]}>Veeky</Text>
            <Text style={[styles.subtitle, { color: c.muted }]}>
              כנסו לעולם של חופשות שמזמינים בוידאו 🎥
            </Text>
          </View>

          {/* Form */}
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: c.muted }]}>אימייל</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="name@example.com"
                placeholderTextColor={c.placeholder}
                style={[
                  styles.input,
                  { color: c.text, borderColor: c.inputBorder, backgroundColor: c.inputBg },
                ]}
                accessibilityLabel="Email"
                returnKeyType="next"
                autoCorrect={false}
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
                  placeholder="••••••••"
                  placeholderTextColor={c.placeholder}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { color: c.text, borderColor: c.inputBorder, backgroundColor: c.inputBg },
                  ]}
                  accessibilityLabel="Password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPw((s) => !s)}
                  accessibilityRole="button"
                  accessibilityLabel={showPw ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  style={[
                    styles.showBtn,
                    { borderColor: c.inputBorder, backgroundColor: c.chipBg },
                  ]}
                >
                  <Text style={{ color: c.muted }}>{showPw ? 'הסתר' : 'הצג'}</Text>
                </TouchableOpacity>
              </View>
              {!passwordValid && password.length > 0 && (
                <Text style={[styles.helper, { color: c.danger }]}>
                  סיסמה חייבת לכלול 8 תווים לפחות
                </Text>
              )}
            </View>

            {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: formValid ? c.primary : c.disabled, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleLogin}
              disabled={loading || !formValid}
              accessibilityRole="button"
              accessibilityLabel="התחברות"
            >
              {loading ? <ActivityIndicator /> : <Text style={styles.primaryText}>התחברות</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkRow]}
              onPress={() => {
                /* TODO: navigate to ForgotPassword */
              }}
              accessibilityRole="button"
            >
              <Text style={[styles.link, { color: c.link }]}>שכחת סיסמה?</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <Text style={{ color: c.muted, marginHorizontal: 8 }}>או</Text>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
          </View>

          {/* Socials */}
          <View style={styles.socials}>
            <TouchableOpacity
              onPress={handleGoogleLogin}
              style={[styles.socialBtn, { borderColor: c.border, backgroundColor: c.card }]}
              accessibilityRole="button"
            >
              <Text style={[styles.socialText, { color: c.text }]}>המשך עם Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                /* TODO: Apple OAuth */
              }}
              style={[styles.socialBtn, { borderColor: c.border, backgroundColor: c.card }]}
              accessibilityRole="button"
            >
              <Text style={[styles.socialText, { color: c.text }]}>המשך עם Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              onPress={() => {
                /* TODO: navigate to SignUp */
              }}
            >
              <Text style={[styles.link, { color: c.link }]}>אין לך חשבון? יצירת חשבון</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={continueAsGuest}>
              <Text style={[styles.linkMuted, { color: c.muted }]}>המשך כאורח</Text>
            </TouchableOpacity>

            <Text style={[styles.terms, { color: c.muted }]}>
              בלחיצה על “התחברות” אתה מאשר את <Text style={{ color: c.link }}>תנאי השימוש</Text> ו
              <Text style={{ color: c.link }}>מדיניות הפרטיות</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---- helpers & theme ----
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getTheme(dark: boolean) {
  const primary = '#00D5FF'; // Veeky accent
  return dark
    ? {
        bg: '#0B0B0C',
        card: '#141416',
        text: '#FFFFFF',
        muted: '#B4B6BF',
        border: '#2A2B31',
        placeholder: '#6C6F7A',
        inputBg: '#1A1B1E',
        inputBorder: '#2A2B31',
        chipBg: '#18191B',
        primary,
        link: primary,
        disabled: '#2E2F36',
        danger: '#FF6B6B',
      }
    : {
        bg: '#F7F8FA',
        card: '#FFFFFF',
        text: '#1A1A1A',
        muted: '#6B7280',
        border: '#E5E7EB',
        placeholder: '#9CA3AF',
        inputBg: '#FFFFFF',
        inputBorder: '#E5E7EB',
        chipBg: '#F3F4F6',
        primary,
        link: '#007EA0',
        disabled: '#D1D5DB',
        danger: '#DC2626',
      };
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  brand: { fontSize: 40, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { marginTop: 6, fontSize: 14, textAlign: 'center' },

  card: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  helper: { fontSize: 12, marginTop: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  showBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: { fontSize: 13, marginTop: 4 },

  primaryBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryText: { color: '#0B0B0C', fontWeight: '700', fontSize: 16 },

  linkRow: { alignItems: 'center', marginTop: 2 },
  link: { fontWeight: '700', fontSize: 14 },
  linkMuted: { fontSize: 14, marginTop: 10 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    justifyContent: 'center',
  },
  divider: { height: 1, flex: 1, borderRadius: 1 },

  socials: { gap: 12 },
  socialBtn: {
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { fontSize: 15, fontWeight: '600' },

  bottomActions: {
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  terms: { textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 6 },
});
