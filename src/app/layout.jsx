import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Ticketo | Premium Event Discovery & Ticket Booking Platform",
  description:
    "Browse, discover, and purchase tickets for the finest premium events near you. Or create your own organizer account and host events seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#080c16] text-[#f3f4f6]">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}

