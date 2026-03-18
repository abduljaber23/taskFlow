import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-6 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        <nav className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-center">
          <Link to="/about" className="link link-hover whitespace-nowrap">
            A propos
          </Link>
          <Link to="/contact" className="link link-hover whitespace-nowrap">
            Contact
          </Link>
          <Link to="/terms" className="link link-hover whitespace-nowrap">
            Conditions d'utilisation
          </Link>
          <Link to="/privacy" className="link link-hover whitespace-nowrap">
            Confidentialité
          </Link>
        </nav>

        <div className="flex gap-4 mt-4 md:mt-0">
          <FaTwitter className="text-xl cursor-pointer hover:text-blue-400 transition-colors" />
          <FaYoutube className="text-xl cursor-pointer hover:text-red-500 transition-colors" />
          <FaFacebook className="text-xl cursor-pointer hover:text-blue-600 transition-colors" />
        </div>
      </div>

      <p className="text-xs md:text-sm text-center mt-6 md:mt-4">
        © {new Date().getFullYear()} - Tous droits réservés - TaskFlow
      </p>
    </footer>
  );
}
