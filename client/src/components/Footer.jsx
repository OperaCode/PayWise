import React from "react";
import footerlogo from "../assets/footerlogo.png";
import logo from "../assets/paywise-logo.png";
import { Phone, Twitter } from "lucide-react";
import { Mail } from "lucide-react";
import { Github } from "lucide-react";
import { Linkedin } from "lucide-react";

// import { SocialIcon } from 'react-social-icons'

const Footer = () => {
  return (
    <>
      <footer className="flex items-center w-screen justify-around  bg-neutral-950 text-white h-50">
        <div className="flex flex-col ">
          <img src={footerlogo} alt="" className="w-18" />
          <p className="text-sm">110234, Lagos, Nigeria.</p>
        </div>
        <div className="">
          <ul className="hover:cursor-pointer md:flex gap-8 text-sm">
            <a href="/about">
              <li>About</li>
            </a>
            <a href="/terms-and-conditions">
              <li>Terms</li>
            </a>
            <a href="/privacy-policy">
              <li>Privacy</li>
            </a>
          </ul>
        </div>
        <div className="">
          <ul className=" hover:cursor-pointer md:flex gap-4 items-center">
            <a href="https://x.com/0pera_dev" target="blank" rel="noopener noreferrer">
              {" "}
              <li>
                <Twitter />
              </li>
            </a>
            <a
              href="https://www.linkedin.com/in/raphael-faboyinde-a031b1195/
" target="blank" rel="noopener noreferrer"
            >
              <li>
                <Linkedin />
              </li>
            </a>
            <a href="mailto:your-email@example.com">
              <li>
                <Mail />
              </li>
            </a>
            <a href="https://github.com/OperaCode" target="blank" rel="noopener noreferrer">
              <li>
                <Github />
              </li>
            </a>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
