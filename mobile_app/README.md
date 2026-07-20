# Royal Transportation - Mobile App

## Structure

```
lib/
├── main.dart                    # App entry point
├── src/
│   └── app.dart                # Main app widget
├── core/
│   ├── constants/              # App constants
│   ├── extensions/             # Dart extensions
│   └── utils/                  # Helper utilities
├── models/                     # Data models
├── services/                   # Business logic
├── providers/                  # State management
├── widgets/                    # Reusable widgets
├── screens/                    # App screens
│   ├── authentication/
│   ├── parent/
│   ├── driver/
│   ├── student/
│   ├── management/
│   ├── payments/
│   ├── gps/
│   ├── complaints/
│   ├── attendance/
│   ├── notifications/
│   └── chat/
└── theme/                      # Theming
```

## Development

To run the app:

```bash
flutter pub get
flutter run
```

For web development:

```bash
flutter run -d chrome
```

For iOS:

```bash
flutter run -d ios
```

For Android:

```bash
flutter run -d android
```
