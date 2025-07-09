# TechPulse

A modern web application for staying updated with the latest technology trends and learning resources.

## Features

- 🎯 Interactive dashboard with tech trend cards
- 📚 Daily 5-minute learning challenges with flashcards
- 🔐 Authentication with Firebase (Email + Google)
- 🌙 Dark mode support
- 📱 Responsive design
- ✨ Smooth animations with Framer Motion

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Firebase Authentication
- Firebase Firestore
- React Router for navigation
- Framer Motion for animations

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/techpulse.git
cd techpulse
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── contexts/      # React contexts
  ├── config/        # Configuration files
  └── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
