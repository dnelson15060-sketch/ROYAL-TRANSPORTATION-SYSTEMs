# Deployment Guide - Royal Transportation System

## Environment Setup

### Prerequisites

- Google Cloud Platform (GCP) account
- Firebase project
- Node.js 18+ installed locally
- Flutter SDK installed locally
- GitHub repository access
- Domain name for API

## Development Environment

### Local Setup

```bash
# Clone repository
git clone https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs.git
cd ROYAL-TRANSPORTATION-SYSTEMs

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with Firebase credentials
npm run dev

# Mobile app setup
cd ../mobile_app
flutter pub get
flutter run -d chrome  # For web testing
```

### Firebase Emulator

```bash
# Install Firebase tools
npm install -g firebase-tools

# Start emulator
firebase emulators:start

# Run tests against emulator
NODE_ENV=emulator npm test
```

## Staging Environment

### Firebase Setup

1. Create Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project: `royal-transportation-staging`
   - Enable Firestore
   - Enable Authentication
   - Enable Cloud Storage
   - Enable Cloud Messaging

2. Configure services:

```bash
firebase use --add
# Select project: royal-transportation-staging
# Alias: staging
```

### Deploy Backend to Cloud Run

```bash
# Build Docker image
cd backend
docker build -t gcr.io/royal-transportation-staging/api .

# Push to Container Registry
gcloud auth configure-docker
docker push gcr.io/royal-transportation-staging/api

# Deploy to Cloud Run
gcloud run deploy royal-api-staging \
  --image gcr.io/royal-transportation-staging/api \
  --platform managed \
  --region us-central1 \
  --set-env-vars FIREBASE_PROJECT_ID=royal-transportation-staging
```

### Deploy Mobile App to Firebase Hosting

```bash
cd mobile_app
flutter build web --release

firebase deploy --only hosting:royal-transportation-staging
```

## Production Environment

### Firebase Production Setup

1. Create production Firebase project:
   - Project name: `royal-transportation`
   - Configure all services as staging

2. Set up custom domain:

```bash
firebase use production
firebase hosting:sites:create royal-transportation
```

### Backend Deployment (Production)

```bash
# Build and push production image
cd backend
docker build -t gcr.io/royal-transportation/api:v1.0.0 .
gcloud auth configure-docker
docker push gcr.io/royal-transportation/api:v1.0.0

# Deploy with production configuration
gcloud run deploy royal-api \
  --image gcr.io/royal-transportation/api:v1.0.0 \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 2 \
  --max-instances 10 \
  --set-env-vars \
    FIREBASE_PROJECT_ID=royal-transportation,\
    NODE_ENV=production,\
    LOG_LEVEL=info
```

### Mobile App Deployment

#### iOS App Store

```bash
cd mobile_app

# Build for iOS
flutter build ios --release

# Open in Xcode for signing
open ios/Runner.xcworkspace

# Archive and upload to App Store Connect
# (Follow Xcode's built-in process)
```

#### Google Play Store

```bash
# Build for Android
flutter build appbundle --release

# Upload to Google Play Console
# Via web interface at https://play.google.com/console
```

### SSL/TLS Configuration

```bash
# Set up custom domain with SSL
gcloud compute ssl-certificates create royal-api-cert \
  --certificate=/path/to/cert.pem \
  --private-key=/path/to/key.pem

# Or use managed certificates
gcloud compute ssl-certificates create royal-api-cert \
  --domains api.royaltransportation.com
```

## Database Migration

### Create Firestore Indexes

```bash
# Deploy indexes defined in firestore.indexes.json
firebase deploy --only firestore:indexes
```

### Example Firestore Indexes

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "Collection",
      "fields": [
        {"fieldPath": "email", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "locations",
      "queryScope": "Collection",
      "fields": [
        {"fieldPath": "routeId", "order": "ASCENDING"},
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    }
  ]
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

Current repository workflows live under `.github/workflows/`:

- `backend-ci.yml` — backend lint, tests, and Docker build validation
- `admin-ci.yml` — admin dashboard lint, tests, and production build validation
- `mobile-ci.yml` — Flutter analysis, tests, debug APK build, and release app bundle validation

There is currently no checked-in `.github/workflows/deploy.yml`; use the deployment commands below from your release pipeline or add a dedicated deploy workflow separately.

```yaml
# Validation workflow paths:
# - .github/workflows/backend-ci.yml
# - .github/workflows/admin-ci.yml
# - .github/workflows/mobile-ci.yml
```

### Required environment and secret inputs

- **Backend (`backend/.env`)**
  - `PORT`
  - `NODE_ENV`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_DATABASE_URL` (when used)
  - `ALLOWED_ORIGINS`
  - `APP_VERSION`
- **Admin (`admin_dashboard/.env`)**
  - `VITE_API_BASE_URL`
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- **Mobile (`mobile_app/.env`, native signing/config files)**
  - `API_BASE_URL`
  - `FIREBASE_PROJECT_ID`
  - `GOOGLE_MAPS_API_KEY`
  - `ANDROID_STORE_FILE`
  - `ANDROID_KEYSTORE_PASSWORD`
  - `ANDROID_KEY_ALIAS`
  - `ANDROID_KEY_PASSWORD`
  - optional CI-only `ANDROID_KEYSTORE_BASE64`

### Release-candidate validation steps

Run the same commands locally or in CI to validate a release candidate:

```bash
# Backend
cd backend
npm ci
npm run lint
npm test -- --runInBand

# Admin dashboard
cd ../admin_dashboard
npm ci
npm run lint
npm test
npm run build

# Mobile app
cd ../mobile_app
flutter pub get
dart format --output=none --set-exit-if-changed lib/
flutter analyze
flutter test --coverage
flutter build apk --debug
flutter build appbundle --release
```

## Monitoring and Logging

### Cloud Monitoring Setup

```bash
# Create uptime check
gcloud monitoring uptime-checks create royal-api \
  --resource-type uptime-url \
  --monitored-resource monitored_url=api.royaltransportation.com/health

# Create alert policy
gcloud alpha monitoring policies create \
  --display-name="API Error Rate High" \
  --condition-display-name="Error rate > 5%"
```

### Cloud Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Create log sink
gcloud logging sinks create royal-api-logs \
  gs://royal-transportation-logs \
  --log-filter='resource.type="cloud_run_revision"'
```

## Rollback Procedure

```bash
# Rollback to previous version
gcloud run deploy royal-api \
  --image gcr.io/royal-transportation/api:v1.0.0-previous \
  --region us-central1

# Verify deployment
curl https://api.royaltransportation.com/health
```

## Performance Optimization

### Image Optimization

```bash
# Enable Cloud CDN
gcloud compute backend-services create royal-api-backend \
  --enable-cdn

# Configure caching
gcloud compute backend-services update royal-api-backend \
  --cache-mode=CACHE_ALL_STATIC
```

### Database Optimization

- Enable Firestore indexes for common queries
- Set up composite indexes
- Configure Firestore TTL for temporary data

## Disaster Recovery

### Backup Procedures

```bash
# Export Firestore
gcloud firestore export gs://royal-transportation-backups/$(date +%Y%m%d_%H%M%S)

# Setup automatic exports
gcloud scheduler jobs create app-engine firestore-backup \
  --schedule="0 2 * * *" \
  --http-method=POST \
  --uri=https://region-firestore.googleapis.com/v1/projects/royal-transportation/databases/\(default\)/exportDocuments
```

### Restore Procedures

```bash
# Restore from backup
gcloud firestore import gs://royal-transportation-backups/backup_path
```

## Scaling Strategy

### Auto-Scaling Configuration

```bash
# Cloud Run auto-scaling
gcloud run deploy royal-api \
  --min-instances 2 \
  --max-instances 20 \
  --concurrency 80
```

---

**Last Updated**: July 2026
**Version**: 1.0
