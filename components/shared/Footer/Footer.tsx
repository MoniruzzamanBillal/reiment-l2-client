import { Facebook, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 border-t-4 border-indigo-600">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="col-span-1">
          <Link href="/" className="text-3xl font-bold text-white">
            Rei<span className="text-indigo-400">ment</span>
          </Link>
          <p className="mt-4 text-sm">
            Your ultimate destination for quality products from various vendors.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-indigo-400 transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link href="/flash-sale" className="hover:text-indigo-400 transition-colors">
                Flash Sale
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products?ParamCategory=a9278158-cbdc-47da-9fc9-f087066a12bc"
                className="hover:text-indigo-400 transition-colors"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                href="/products?ParamCategory=5a9c1ab8-fbf7-4f7b-a406-30f21bce4fe1"
                className="hover:text-indigo-400 transition-colors"
              >
                Toys, Kids & Babies
              </Link>
            </li>
            <li>
              <Link
                href="/products?ParamCategory=857965f4-3b41-48e2-942c-f111296a3b7b"
                className="hover:text-indigo-400 transition-colors"
              >
                Sports & Outdoors
              </Link>
            </li>
            <li>
              <Link
                href="/products?ParamCategory=792c731b-f87c-4c58-81d4-32f94b4f7400"
                className="hover:text-indigo-400 transition-colors"
              >
                Groceries & Food
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-4 mb-6">
            <a
              href="https://www.facebook.com/MoniruzzamanBillal3018"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/moniruzzamanbillal3018"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/MoniruzzamanBillal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm">Email: info@reiment.com</p>
          <p className="text-sm">Phone: +1 (234) 567-890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Reiment. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
