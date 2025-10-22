# Rasad va Payesh Tahdidat Zisti (رصد و پایش تهدیدات زیستی)
## Monitoring and Surveillance of Biological Threats - Mobile App

A comprehensive cross-platform mobile application built with React Native and Expo for monitoring, reporting, and tracking biological threats and public health incidents.

## Features Overview

### Core Functionality

#### 1. Home Dashboard
- Central navigation hub with quick access to all app sections
- Menu items: Login, Education, News, Contact, Settings, Guide
- Responsive card-based layout
- RTL support for Persian language

#### 2. Login System (ورود)
- Secure authentication with username/password
- "Remember Me" functionality
- Persistent login state using AsyncStorage
- Demo credentials: username: `demo`, password: `demo123`

#### 3. Public Health Dashboard (سلامت عمومی)
- Real-time health statistics display
- Cards showing:
  - Total Reports (مجموع گزارش‌ها)
  - Active Threats (تهدیدات فعال)
  - Recovery Rate (نرخ بهبودی)
  - New Reports Today (گزارش‌های امروز)
- Quick access button to report new incidents

#### 4. COVID-like Symptoms Reporting (علایم شبه کرونا)
Comprehensive symptom reporting form with:
- Personal Information:
  - Name (نام)
  - Phone Number (شماره تلفن)
  - Age (سن)
  - Gender (جنسیت) - Male/Female/Other
- Symptom Checklist:
  - Fever (تب)
  - Cough (سرفه)
  - Shortness of Breath (تنگی نفس)
  - Fatigue (خستگی)
  - Loss of Taste/Smell (از دست دادن حس چشایی/بویایی)
  - Headache (سردرد)
  - Body Ache (درد بدن)
  - Sore Throat (گلودرد)
  - Nausea (حالت تهوع)
  - Diarrhea (اسهال)
- Additional Details:
  - Onset Date (تاریخ شروع علائم)
  - Location (City/Address)
  - Severity Slider (1-10 scale)
  - Photo upload capability
- Form validation with error messages
- Report submission with confirmation

#### 5. Saved Reports (ذخیره شده)
- View all saved reports
- Report cards showing:
  - Name and date
  - City and severity
  - Status badge (Pending/Reviewed/Closed)
- Actions: View details, Delete
- Empty state message when no saved items

#### 6. Photos & Videos (عکس و فیلم)
- Media upload functionality:
  - Take photo with camera
  - Choose from gallery
- Upload form with:
  - Description field
  - Category selection (Symptom Photo, Threat Evidence, Location, Other)
- Grid gallery view of uploaded media
- Image thumbnails with descriptions

#### 7. Education Section (آموزش)
- Articles and educational content
- Video tutorials with YouTube integration
- Content organized by:
  - Articles with read time
  - Videos with duration
- Full-screen modal for reading articles
- Topics include:
  - Biological threat identification
  - Prevention methods
  - Hygiene practices
  - Vaccination importance

#### 8. News Feed (اخبار)
- Chronological news feed
- Pull-to-refresh functionality
- Color-coded categories:
  - Official Report (گزارش رسمی) - Blue
  - Alert (هشدار) - Red
  - Prevention (پیشگیری) - Green
- News cards showing:
  - Title and excerpt
  - Date and source
  - Category badge
- Full article view in modal

#### 9. Contact Us (تماس با ما)
- Contact information display:
  - Email (clickable to open mail app)
  - Phone (clickable to dial)
  - Physical address
- Contact form with fields:
  - Name
  - Email (with validation)
  - Phone
  - Subject
  - Message (textarea)
  - File attachment option
- Form validation and submission

#### 10. Settings (تنظیمات)
- Language toggle (Persian/English)
- Notifications toggle
- Dark mode toggle
- Privacy policy link
- App version display (1.1.0)
- Logout button (when logged in)

#### 11. Guide/Help (راهنما)
- How to Use section with step-by-step instructions
- FAQs with common questions and answers
- Installation guide for Android APK
- Troubleshooting information

## Technical Architecture

### Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet
- **Persistence**: AsyncStorage
- **Icons**: Lucide React Native
- **Language**: JavaScript (JSX)

### Project Structure
```
project/
├── app/
│   ├── (tabs)/              # Bottom tab navigation
│   │   ├── _layout.jsx      # Tab configuration
│   │   ├── index.jsx        # Home screen
│   │   ├── public-health.jsx
│   │   ├── covid-symptoms.jsx
│   │   ├── saved.jsx
│   │   └── media.jsx
│   ├── _layout.tsx          # Root layout
│   ├── login.jsx
│   ├── education.jsx
│   ├── news.jsx
│   ├── contact.jsx
│   ├── settings.jsx
│   └── guide.jsx
├── components/
│   ├── Header.jsx           # App header with title
│   ├── CustomButton.jsx     # Reusable button
│   ├── CustomInput.jsx      # Form input component
│   └── StatCard.jsx         # Statistics display card
├── store/
│   └── useStore.js          # Zustand global state
├── constants/
│   ├── translations.js      # i18n translations
│   └── mockData.js          # Sample data
└── assets/
    └── images/
```

### State Management
The app uses Zustand for centralized state management with the following store:

```javascript
{
  user: null,
  isLoggedIn: false,
  isDarkMode: false,
  language: 'fa',
  savedReports: [],
  reports: [],
  newsItems: [],
  educationItems: [],
  mediaItems: [],
}
```

### Design System

#### Color Palette
- Primary Blue: `#007BFF` - Accents and CTAs
- Success Green: `#28A745` - Positive actions and health indicators
- Danger Red: `#DC3545` - Alerts and warnings
- Warning Yellow: `#FFC107` - Cautions
- Info Cyan: `#17A2B8` - Information
- Neutral Gray: `#6c757d` - Secondary elements

#### Dark Mode Colors
- Background: `#121212`
- Cards: `#2a2a2a`
- Text: `#e0e0e0`
- Secondary text: `#999`

#### Typography
- Headers: 20-28px, bold
- Body: 14-16px, regular
- Captions: 12px, regular

### RTL Support
- Full RTL text alignment for Persian language
- Mirrored layouts where appropriate
- `writingDirection: 'rtl'` style applied to Persian text

### Accessibility Features
- High contrast text on all backgrounds
- Touch targets minimum 48px
- Clear visual feedback on interactions
- Form validation with error messages
- Loading states for async operations

## Data Flow

### Report Submission Flow
1. User fills COVID symptoms form
2. Form validation on submit
3. Report saved to Zustand store
4. Persisted to AsyncStorage
5. Success alert displayed
6. Form reset

### Authentication Flow
1. User enters credentials
2. Mock authentication (demo/demo123)
3. User object created and saved
4. If "Remember Me" checked, saved to AsyncStorage
5. Redirect to home screen

### Media Upload Flow
1. User selects camera or gallery
2. Permission check
3. Image picker opens
4. Image selected
5. Upload modal opens with form
6. User enters description and category
7. Media item saved to store
8. Displayed in gallery grid

## Mock Data

The app includes comprehensive mock data for:
- Health statistics (total reports, active threats, recovery rate)
- News items (3 sample articles with categories)
- Education items (4 articles and videos)

## Offline Capabilities
- AsyncStorage persistence for:
  - User authentication
  - Reports and saved items
  - Media uploads
  - Settings (language, dark mode)
- Data loads on app start from local storage
- Graceful handling when offline

## Future API Integration Points
- `/login` - User authentication
- `/reports` - Submit and retrieve symptom reports
- `/reports/:id` - Get report details
- `/news` - Fetch news feed
- `/education` - Get educational content
- `/media/upload` - Upload photos/videos
- `/contact` - Submit contact form

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Web
```bash
npm run build
```

### Build for Android/iOS
```bash
expo build:android
expo build:ios
```

## Demo Credentials
- **Username**: demo
- **Password**: demo123

## Supported Platforms
- Web (primary)
- iOS
- Android

## Languages
- Persian (Farsi) - Default
- English

## Version
1.1.0

## License
Private - All rights reserved
