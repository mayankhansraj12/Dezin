# Dezin AI 🎨

**Make Smooth UI Easily** - An AI-powered React component generator using Google's Gemini API.

## ✨ Features

- 🤖 **AI-Powered UI Generation** - Natural language to React components
- 🔄 **5-Model Fallback System** - Automatic fallback across Gemini models
- 🎨 **Live Preview** - Real-time component rendering with syntax highlighting
- 📝 **Code Viewer** - VS Code-style editor with JSX/React syntax
- 🌙 **Dark Theme** - Sleek navy blue aesthetic
- ⚡ **Fast & Responsive** - Built with Vite and React

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Gemini API Key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Dezin
   ```

2. **Set up environment variables**
   ```bash
   # Server environment
   cp server/.env.example server/.env
   ```
   Edit `server/.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   ```
   
   (Optional) Client environment:
   ```bash
   cp client/.env.example client/.env
   # Only needed if you want to customize the API URL
   ```

3. **Install dependencies**
   ```bash
   npm run install:all
   ```

4. **Run development servers**
   ```bash
   # Option 1: Run both servers concurrently
   npm run dev

   # Option 2: Run separately
   npm run dev:server  # Terminal 1
   npm run dev:client  # Terminal 2
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Project Structure

```
Dezin/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── store/       # Zustand state management
│   │   └── lib/         # Utilities
│   └── package.json
├── server/              # Express backend
│   ├── agent/           # AI orchestration
│   │   ├── gemini.js    # Gemini API integration
│   │   ├── orchestrator.js  # Model fallback system
│   │   └── planner.js   # UI generation logic
│   └── package.json
├── .env.example         # Environment template
├── vercel.json          # Vercel deployment config
└── DEPLOYMENT.md        # Deployment guide
```

## 🎯 Usage

1. **Enter your prompt** in the chat input
2. **Select AI model** from the dropdown (defaults to Gemini 2.5 Flash)
3. **View live preview** of generated component
4. **Switch to Code tab** to see the JSX source

### Example Prompts
- "Create a pricing card with three tiers"
- "Build a hero section with gradient background"
- "Design a contact form with validation"

## 🔧 Configuration

### Available Models
- Gemini 2.5 Pro (Best quality)
- Gemini 2.5 Flash (Recommended - balanced)
- Gemini 2.0 Flash
- Gemini 2.5 Flash Lite
- Gemini 2.0 Flash Lite

### Model Fallback
If your selected model fails (e.g., quota limit), the system automatically tries other models in order of capability.

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Recommended Platforms
- **Vercel** (easiest) - [Deploy Now](https://vercel.com)
- **Render** (free tier)
- **Railway**

## 🛠️ Development

### Build
```bash
# Build client for production
npm run build

# Preview production build
cd client && npm run preview
```

### Environment Variables
Required:
- `GEMINI_API_KEY` - Your Gemini API key

Optional:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (production)

## 📝 API Endpoints

- `GET /health` - Health check
- `GET /api` - API info
- `POST /api/chat` - Generate UI component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI model provider
- [React Live](https://github.com/FormidableLabs/react-live) - Live code preview
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ using Google Gemini AI**
