/**
 * VayuNet Multilingual Translation Dictionary
 * Provides English and Hindi localized strings for the Citizen Interface.
 */

export type LanguageCode = 'en' | 'hi';

export interface TranslationDictionary {
  appName: string;
  citizenPortal: string;
  authorityDashboard: string;
  reportButton: string;
  uploadPhoto: string;
  photoTip: string;
  describeIssue: string;
  describePlaceholder: string;
  voiceButton: string;
  listening: string;
  speakPrompt: string;
  locationLabel: string;
  autoDetecting: string;
  manualPinAdjust: string;
  submit: string;
  submitting: string;
  reportStatus: {
    received: string;
    analyzing: string;
    evidenceProcessing: string;
    confidenceComputed: string;
    alertRouted: string;
  };
  riskLevels: {
    low: string;
    moderate: string;
    high: string;
    critical: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'VayuNet',
    citizenPortal: 'Citizen Pollution Reporter',
    authorityDashboard: 'Authority Intelligence Dashboard',
    reportButton: 'Report Pollution',
    uploadPhoto: 'Upload Observation Photo',
    photoTip: 'Take a live photo or upload clear image of smoke, dust, or emissions',
    describeIssue: 'Describe what you observe',
    describePlaceholder: 'e.g., Heavy dark smoke rising behind factory warehouse, strong burning plastic odor...',
    voiceButton: 'Voice Report (Speech-to-Text)',
    listening: 'Listening... Please speak now',
    speakPrompt: 'Click microphone to dictate in English',
    locationLabel: 'Observation Location',
    autoDetecting: 'Detecting GPS coordinates...',
    manualPinAdjust: 'Drag pin or adjust location if needed',
    submit: 'Submit Pollution Report',
    submitting: 'Submitting report...',
    reportStatus: {
      received: 'Report Received',
      analyzing: 'Gemini AI Multimodal Analyzing...',
      evidenceProcessing: 'Synthesizing with Sensor & Satellite Grid...',
      confidenceComputed: 'Event Confidence Verified',
      alertRouted: 'Alert Routed to Municipal Authority',
    },
    riskLevels: {
      low: 'Low Impact',
      moderate: 'Moderate Exposure',
      high: 'High Risk Alert',
      critical: 'Critical Emergency',
    },
  },
  hi: {
    appName: 'वायुनेट (VayuNet)',
    citizenPortal: 'नागरिक प्रदूषण रिपोर्टर',
    authorityDashboard: 'प्राधिकरण पर्यावरण डैशबोर्ड',
    reportButton: 'प्रदूषण की रिपोर्ट करें',
    uploadPhoto: 'प्रदूषण की फोटो अपलोड करें',
    photoTip: 'धुआं, धूल या अपशिष्ट दहन की स्पष्ट तस्वीर खींचें या अपलोड करें',
    describeIssue: 'आप क्या देख रहे हैं इसका वर्णन करें',
    describePlaceholder: 'उदा. कारखाने के पीछे से काला धुआं निकल रहा है, जलते प्लास्टिक की गंध आ रही है...',
    voiceButton: 'आवाज से रिपोर्ट करें (बोलकर लिखें)',
    listening: 'सुन रहे हैं... कृपया अब बोलें',
    speakPrompt: 'हिंदी में बोलने के लिए माइक पर क्लिक करें',
    locationLabel: 'घटना का स्थान',
    autoDetecting: 'जीपीएस स्थान प्राप्त किया जा रहा है...',
    manualPinAdjust: 'आवश्यकता होने पर पिन को सही स्थान पर ले जाएं',
    submit: 'रिपोर्ट भेजें',
    submitting: 'रिपोर्ट भेजी जा रही है...',
    reportStatus: {
      received: 'रिपोर्ट प्राप्त हुई',
      analyzing: 'जेमिनी एआई बहुविध विश्लेषण जारी...',
      evidenceProcessing: 'सेंसर व सैटेलाइट डेटा से मिलान जारी...',
      confidenceComputed: 'घटना विश्वसनीयता प्रमाणित',
      alertRouted: 'संबंधित प्रदूषण नियंत्रण प्राधिकरण को सतर्क किया गया',
    },
    riskLevels: {
      low: 'कम प्रभाव',
      moderate: 'मध्यम जोखिम',
      high: 'उच्च जोखिम चेतावनी',
      critical: 'अति गंभीर आपातकाल',
    },
  },
};
