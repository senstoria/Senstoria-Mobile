// Cincin difusi aroma — richness arah D, digambar dengan View (tanpa SVG).
// Lingkaran konsentris tipis; dekoratif saja (bukan teks, tanpa syarat
// kontras). Di atas putih, cincin teal sangat redup dan satu cincin pink
// aksen. Cincin TIDAK pernah ditaruh di belakang teks (perbaikan final
// CRITIQUE #2) — ia hidup di zonanya sendiri (hero / empty).
import { StyleSheet, View, type ViewStyle } from 'react-native';

type RingSpec = { diameter: number; color: string };

export function Rings({
  rings,
  style,
}: {
  /** Lingkaran dari dalam ke luar; diameter dalam dp. */
  rings: RingSpec[];
  style?: ViewStyle;
}) {
  const size = Math.max(...rings.map((r) => r.diameter));
  return (
    <View style={[styles.host, { width: size, height: size }, style]} pointerEvents="none">
      {rings.map((ring) => (
        <View
          key={ring.diameter}
          style={[
            styles.ring,
            {
              width: ring.diameter,
              height: ring.diameter,
              borderRadius: ring.diameter / 2,
              borderColor: ring.color,
              left: (size - ring.diameter) / 2,
              top: (size - ring.diameter) / 2,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'relative' },
  ring: { position: 'absolute', borderWidth: 1.5, backgroundColor: 'transparent' },
});
