import React, { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { User } from 'lucide-react-native';
import { Colors } from '@/src/constants/theme';
import { getSplineState, getBodyVariant, BodyVariant } from '@/src/utils/getBodyVariant';

interface BodyPreview3DProps {
  bmi?: number;
  bodyVariant?: BodyVariant;
  isLoading?: boolean;
}

const SPLINE_SCENE_URL = 'https://prod.spline.design/jZ6Z4v6-0S-K6Z4/scene.splinecode'; // Placeholder scene

export const BodyPreview3D: React.FC<BodyPreview3DProps> = ({ 
  bmi, 
  bodyVariant,
  isLoading: externalLoading 
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine the target state based on BMI or explicit variant
  const targetVariant: BodyVariant = bodyVariant || (bmi ? getBodyVariant(bmi) : 'normal');
  const targetState = getSplineState(targetVariant);

  useEffect(() => {
    if (!isWebViewLoading && webViewRef.current) {
      // Inject JS to change spline state
      const script = `
        (function() {
          const viewer = document.getElementById('viewer');
          const updateState = () => {
            if (window.spline) {
              window.spline.emitEvent('mouseUp', '${targetState}');
              console.log('Setting Spline state to: ${targetState}');
            }
          };
          if (window.spline) { updateState(); }
          else if (viewer) { viewer.addEventListener('load', updateState); }
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [targetState, isWebViewLoading]);

  // HTML template to load Spline Viewer with Runtime API support
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
          #container { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          spline-viewer { width: 100%; height: 100%; }
        </style>
        <script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>
      </head>
      <body>
        <div id="container">
          <spline-viewer id="viewer" url="${SPLINE_SCENE_URL}" events-target="global"></spline-viewer>
        </div>
        <script>
          const viewer = document.getElementById('viewer');
          viewer.addEventListener('load', () => {
            window.spline = viewer.app;
            window.ReactNativeWebView.postMessage('loaded');
          });
        </script>
      </body>
    </html>
  `;

  if (hasError) {
    return (
      <View style={[styles.container, styles.fallbackContainer]}>
        <User color="#94A3B8" size={64} style={{ opacity: 0.6 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(isWebViewLoading || externalLoading) && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00D4FF" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        overScrollMode="never"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'loaded') {
            setIsWebViewLoading(false);
          }
        }}
        onError={() => setHasError(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 380,
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

