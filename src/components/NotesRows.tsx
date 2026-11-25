// Baris piramida notes TOP / HEART / BASE (mockup: label 11pt caps pink
// + nilai 13pt). Label memakai accent-text #A32668 (5.67:1 di atas Cream Grey —
// Lipstick Pink #EC5CAB hanya 2.58:1, dilarang). Nilai membungkus dengan hanging
// indent: label 44pt tetap, nilai flex — di 402px "Green Pear" boleh
// berakhir di tepi kanan (perbaikan final #5, dicatat tidak diubah).
import { StyleSheet, Text, View } from 'react-native';
import type { Perfume } from '../data/catalog';
import { tokens } from '../theme/tokens';

export function NotesRows({ notes }: { notes: Perfume['notes'] }) {
  const rows: { label: string; value: string }[] = [
    { label: 'TOP', value: notes.top.join(' · ') },
    { label: 'HEART', value: notes.heart.join(' · ') },
    { label: 'BASE', value: notes.base.join(' · ') },
  ];
  return (
    <View style={styles.notes}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  notes: { marginTop: 14, borderTopWidth: 1, borderTopColor: tokens.color.rule },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  label: {
    flex: 0,
    width: 44,
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: tokens.color.accentText,
    paddingTop: 1,
  },
  value: { flex: 1, fontSize: tokens.type.note, lineHeight: 18, color: tokens.color.ink },
});
