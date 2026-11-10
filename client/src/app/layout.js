import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "InkWell — Technical Engineering, DevOps, AI & DevRel Platform",
  description: "InkWell — The premier publishing platform for developers, DevOps engineers, AI builders, and DevRel leaders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
                {children}
              </main>
              <Footer />
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
              />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
