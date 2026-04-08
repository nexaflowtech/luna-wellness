import { View, Text, Image, ViewStyle } from 'react-native';
import { Colors, Radius, FontWeight } from '@/constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name?: string;
  uri?: string;
  size?: AvatarSize;
  onlineIndicator?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = { xs: 28, sm: 36, md: 48, lg: 60, xl: 80 };

// Generates a consistent color from a name string
function getInitialColor(name: string = 'U') {
  const colors = [Colors.primary, '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name: string = 'U') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ name, uri, size = 'md', onlineIndicator, style }: AvatarProps) {
  const dim = sizeMap[size];
  const fontSize = dim * 0.36;
  const bgColor = getInitialColor(name ?? 'U');
  const indicatorSize = dim * 0.28;
  const indicatorBorder = dim * 0.055;

  return (
    <View style={[{ position: 'relative', width: dim, height: dim }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
        />
      ) : (
        <View
          style={{
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize, fontWeight: FontWeight.bold, color: '#fff' }}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {onlineIndicator && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: indicatorSize / 2,
            backgroundColor: Colors.success,
            borderWidth: indicatorBorder,
            borderColor: '#fff',
          }}
        />
      )}
    </View>
  );
}
