// Layar Masuk / Daftar — MODE DEMO (kerangka Fase 2).
// Firebase DITUNDA founder 25 Nov 2026 ("gunakan data demo dulu"):
// tidak ada panggilan backend di sini. Email + kata sandi hanya
// memvalidasi format, lalu sesi demo disimpan lokal (AsyncStorage via
// store) — akun TIDAK dibuat di server mana pun. Tombol "Masuk sebagai
// demo" adalah jalan pintas satu ketukan ke sesi demo yang sama.
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore } from '../lib/store';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginScreen() {
  const navigation = useNavigation();
  const fontReady = useDisplayFontReady();
  const { signInDemo } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!isEmail(email)) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (mode === 'register' && password !== confirm) {
      setError('Konfirmasi kata sandi tidak sama.');
      return;
    }
    setError('');
    // Sesi demo lokal — tanpa server.
    signInDemo(email);
    navigation.goBack();
  };

  const enterAsDemo = () => {
    setError('');
    signInDemo('demo@senstoria.app');
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Kembali"
      >
        <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
      </Pressable>

      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        {mode === 'login' ? 'Selamat\n datang.' : 'Buat akun.'}
      </Text>
      <Text style={styles.subtitle}>
        {mode === 'login'
          ? 'Masuk untuk menyimpan perpustakaan dan jurnalmu di perangkat ini.'
          : 'Satu akun demo untuk perpustakaan dan jurnalmu di perangkat ini.'}
      </Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@email.com"
        placeholderTextColor={tokens.color.ink3}
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <Text style={styles.label}>KATA SANDI</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimal 6 karakter"
        placeholderTextColor={tokens.color.ink3}
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setError('');
        }}
        secureTextEntry
        returnKeyType={mode === 'register' ? 'next' : 'done'}
        onSubmitEditing={mode === 'login' ? submit : undefined}
      />

      {mode === 'register' ? (
        <>
          <Text style={styles.label}>ULANGI KATA SANDI</Text>
          <TextInput
            style={styles.input}
            placeholder="Ketik ulang kata sandi"
            placeholderTextColor={tokens.color.ink3}
            value={confirm}
            onChangeText={(v) => {
              setConfirm(v);
              setError('');
            }}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </>
      ) : null}

      {error !== '' ? <Text style={styles.error}>{error}</Text> : null}

      <PressableScale
        style={styles.cta}
        onPress={submit}
        accessibilityRole="button"
        accessibilityLabel={mode === 'login' ? 'Masuk' : 'Buat akun'}
      >
        <Text style={styles.ctaText}>{mode === 'login' ? 'Masuk' : 'Buat akun'}</Text>
      </PressableScale>

      <Pressable
        onPress={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
        }}
        accessibilityRole="button"
      >
        <Text style={styles.switch}>
          {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>atau</Text>
        <View style={styles.dividerLine} />
      </View>

      <PressableScale
        style={styles.demoBtn}
        onPress={enterAsDemo}
        accessibilityRole="button"
        accessibilityLabel="Masuk sebagai demo"
      >
        <Text style={styles.demoBtnText}>Masuk sebagai demo</Text>
      </PressableScale>

      <Text style={styles.note}>
        Mode demo — akun dan data tersimpan hanya di perangkat ini. Belum ada
        server; masuk dengan akun sungguhan hadir setelah Firebase diaktifkan.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: tokens.color.ground },
  content: {
    paddingHorizontal: tokens.spacing.pad,
    paddingTop: 10,
    paddingBottom: tokens.spacing.contentBottom,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: tokens.type.display,
    fontWeight: '800',
    lineHeight: tokens.type.display,
    letterSpacing: -0.46,
    color: tokens.color.ink,
    marginTop: 24,
  },
  subtitle: { fontSize: tokens.type.body, lineHeight: 23, color: tokens.color.ink2, marginTop: 12 },
  label: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
    marginTop: 24,
  },
  input: {
    marginTop: 8,
    height: 52,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    paddingHorizontal: 16,
    fontSize: tokens.type.body,
    color: tokens.color.ink,
  },
  error: { fontSize: tokens.type.meta, color: tokens.color.accentText, marginTop: 12 },
  cta: {
    marginTop: 24,
    height: 52,
    borderRadius: tokens.radius.cta,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: tokens.color.onAccent,
  },
  switch: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
    textAlign: 'center',
  },
  divider: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: tokens.color.rule },
  dividerText: { fontSize: tokens.type.note, color: tokens.color.ink3 },
  demoBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: tokens.radius.cta,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.accentText },
  note: {
    fontSize: tokens.type.note,
    lineHeight: 18,
    color: tokens.color.ink3,
    textAlign: 'center',
    marginTop: 20,
  },
});
