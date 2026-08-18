# GEHU Lost & Found 🏫

A campus-wide Lost & Found web platform for students and staff of **Graphic Era Hill University, Haldwani**.

## ✨ Features
- 🔍 **Browse Lost & Found Items**: Real-time listing with category and date filters.
- 📝 **Report Missing & Found Belongings**: Upload photos, specify campus spots, and set contact preferences.
- 📱 **Multi-Channel Contact**: Reach reporters directly via WhatsApp, Phone Call, or Email.
- 🔐 **Secure Authentication**: Supabase authentication with email verification support.
- 📱 **Mobile & Tablet Optimized**: Mobile bottom navigation bar, touch targets, and responsive bento grids.
- 👤 **Student Profile**: Manage your reported lost and found items.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Rahul2005-ctrl/clg-project.git
   cd clg-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```
