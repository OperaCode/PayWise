import React from "react";
import footerlogo from "../assets/footerlogo.png";
import { Twitter, Mail, Github, Linkedin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  const socials = [
    { icon: <Twitter size={18} />, href: "https://x.com/0pera_dev" },
    {
      icon: <Linkedin size={18} />,
      href: "https://www.linkedin.com/in/raphael-faboyinde-a031b1195/",
    },
    { icon: <Mail size={18} />, href: "mailto:raphaelfaboyinde27@gmail.com" },
    { icon: <Github size={18} />, href: "https://github.com/OperaCode" },
  ];

  return (
    <footer className="bg-cyan-900 text-white ">
      <div className="max-w-6xl mx-auto  px-6 py-10 grid grid-cols-1 md:flex justify-between gap-8">
        {/* Brand */}
        <div>
          <img src={footerlogo} alt="PayWise" className="w-28 mb-3" />
          <p className="text-sm leading-relaxed">
            110234, Lagos, Nigeria.
          </p>
          <p className="flex items-center gap-2 mt-2 text-sm">
            <Phone size={16} className="text-cyan-600" /> +234 800 123 4567
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-cyan-400 mb-3">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="hover:text-cyan-600 transition-colors text-sm"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className="font-semibold text-cyan-300 mb-3">Connect With Us</h4>
          <ul className="flex items-center gap-4">
            {socials.map((s, idx) => (
              <li key={idx}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full  border-gray-200 hover:border-cyan-600 hover:text-cyan-600 transition-colors shadow-sm"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>



      </div>

      {/* Sub-footer */}
      <div className=" py-4 text-center text-sm ">
        <hr className="border-gray-200 p-2 w-2/4 m-auto"/>
        © {currentYear} PayWise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
