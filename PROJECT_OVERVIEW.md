# Luna Wellness - Project Overview

## 🌙 What is Luna Wellness?
Luna Wellness is a personalized AI-powered hormonal health companion for women. It focuses on managing conditions like PCOD, PCOS, and Thyroid issues, while also providing cycle tracking and personalized wellness plans.

## 🚀 Core Features
- **AI-Driven Onboarding**: Tailored questions based on health goals (PCOS, Thyroid, etc.).
- **Hormonal Risk Scoring**: An interactive gauge showing hormonal balance.
- **Personalized Plans**: AI-generated diet and workout recommendations.
- **Cycle Tracking**: Menstrual cycle monitoring and predictions.
- **AI Coach**: An in-app assistant for health queries.
- **Doctor Consultations**: Telemedicine and appointment booking.
- **Community**: A social space for peer support.

## 🛠️ Tech Stack
- **Frontend**: React Native (Expo SDK 54)
- **Routing**: Expo Router v6
- **Styling**: NativeWind (Tailwind CSS)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **AI**: Google Gemini (@google/generative-ai)
- **State Management**: Zustand & React Context
- **Forms**: React Hook Form & Zod
- **Animations**: React Native Reanimated

## 📂 Key Directory Structure
- `/app`: File-based routing (pages/screens).
- `/src/components`: UI components.
- `/src/services`: Integration with Firebase and Gemini AI.
- `/functions`: Firebase Cloud Functions for backend logic.
- `/assets`: Media assets and fonts.

## 🚩 Current Status
The project is in active development. Key navigation flows are being finalized, and AI integration is being moved to server-side (Firebase Functions) for security.
