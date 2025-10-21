# Pintoshop (Expo)

A small e-commerce demo app built with Expo and React Native.

## Features
- Browse products
- Product details and images
- Shopping cart and checkout flow (demo)
- Simple, responsive UI for mobile devices

## Prerequisites
- Node.js 14+
- npm or yarn
- Expo CLI (optional but recommended): `npm install -g expo-cli`
- (Optional) Android Studio / Xcode for device emulators

## Getting started

1. Install dependencies
    - npm:
      ```
      npm install
      ```

      ```

2. Start the development server
    ```
    npx expo start

3. Run on a device or emulator
    - Expo Go (scan QR)


## Available scripts
- `start` — start Expo dev server
- `android` — run on Android emulator/device
- `ios` — run on iOS simulator/device


## Building for production
- Classic build (Expo):
  ```
  expo build:android
  expo build:ios
  ```
- Recommended: use EAS for builds:
  ```
  eas build --platform android
  eas build --platform ios
  ```

## Contributing
- Fork the repository
- Create a topic branch
- Open a pull request with a clear description

## License
MIT — see LICENSE file.
