// "Piringan lapak" — fallback botol tanpa foto (strategi fallback foto
// DIRECTION.md): cakram teal + inisial merek (Baloo 2) + cincin. Tidak
// pernah kotak abu-abu, tidak pernah foto stand-in di aplikasi.
// Monogram krem #F7F3EA di atas cakram teal #12262B = 14.17:1.
import { StyleSheet, Text, View } from 'react-native';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { tokens } from '../theme/tokens';
import { Rings } from './Rings';

export function Disc({
  initial,
  size = 132,
  fontSize,
  withRings = false,
}: {
  initial: string;
  size?: number;
  fontSize?: number;
  /** Cincin pink aksen di sekeliling cakram (hero Detail). */
  withRings?: boolean;
}) {
  const fontReady = useDisplayFontReady();
  const glyph = fontSize ?? Math.round(size * 0.42);
  return (
    <View style={[styles.host, { width: size, height: size }]}>
      {withRings ? (
        <View style={styles.ringsWrap} pointerEvents="none">
          <Rings
            rings={[
              { diameter: size * 1.4, color: tokens.color.ringPink[0] },
              { diameter: size * 1.64, color: tokens.color.ringPink[1] },
            ]}
          />
        </View>
      ) : null}
      <View style={[styles.plate, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text
          style={[
            styles.initial,
            { fontSize: glyph, fontFamily: displayFontFamily(fontReady) },
          ]}
        >
          {initial}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringsWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    backgroundColor: tokens.color.disc,
    borderWidth: 1,
    borderColor: 'rgba(10, 20, 23, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: tokens.color.discInk, fontWeight: '800' },
});
