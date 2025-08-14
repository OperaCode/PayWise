import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LazyLoad from "react-lazyload";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import heropicture from "../assets/hero1.png";
import computer from "../assets/computer.png";
import files from "../assets/files.png";
import security from "../assets/security.png";
import tick from "../assets/tick.png";
import hero2 from "../assets/hero2.png";
import quote from "../assets/heroquote.png";
import { Check, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    img: computer,
    title: "Manage Bills Anywhere",
    desc: "Access, track, and pay your bills seamlessly from any location.",
  },
  {
    img: security,
    title: "Secure Transactions",
    desc: "Your data is protected with advanced encryption and fraud prevention.",
  },
  {
    img: files,
    title: "Organized Payments",
    desc: "Centralize all your bills in one place for clarity and control.",
  },
  {
    img: tick,
    title: "Vendor Management",
    desc: "Smooth, timely vendor payments without hassle.",
  },
];

const testimonials = [
  {
    text: "The automated bill payment feature ensures my bills are always paid on time. Game changer!",
    author: "David A., Digital Marketer",
  },
  {
    text: "Instant transfers — no more waiting hours or days for payments to reflect!",
    author: "Jessica T., Small Business Owner",
  },
  {
    text: "I love that I can fund my wallet instantly from my bank or card. Seamless experience!",
    author: "Michael R., Software Engineer",
  },
];

const integrations = [
  "Visa",
  "MasterCard",
  "Flutterwave",
  "Paystack",
  "Stripe",
];

// quick stats
// const quickStats = [
//   { label: "Users", value: `${users.toLocaleString()}+` },
//   { label: "On-time rate", value: `${onTime}%` },
//   { label: "Vendors", value: `${vendors.toLocaleString()}+` },
// ];

// simple count-up hook for stats
const useCounter = (end = 1000, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return value;
};

const LandingPage = () => {
  const users = useCounter(10000, 1200);
  const onTime = useCounter(98, 1200);
  const vendors = useCounter(1200, 1200);

  return (
    <div className="w-full flex-col justify-center bg-[radial-gradient(1200px_600px_at_70%_-100px,rgba(34,211,238,0.10),transparent)]">
      {/* Header  */}
      <Header />

      {/* Main */}
      <main className="flex flex-col justify-center pt-24 md:pt-36">
        {/* HERO */}
        <motion.section
          id="home"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl px-6 md:px-12"
        >
          {/* soft background accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl"
          ></div>
          <div
            aria-hidden
            className="pointer-events-none absolute top-32 -right-20 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"
          ></div>

          <div className="flex flex-col items-center text-center">
            <motion.img
              src={heropicture}
              alt="Illustration of PayWise bill payment platform"
              className="w-full max-w-2xl mx-auto mb-6 drop-shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            <h1 className="font-extrabold tracking-tight text-5xl md:text-6xl leading-tight">
              Pay Smarter,{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-cyan-700 mt-3">
              Effortless Bill Payments, Anytime, Anywhere
            </p>

            <p className="mt-6 md:text-xl leading-relaxed max-w-2xl ">
              Goodbye to late fines and missed deadlines. PayWise lets you
              automate recurring payments for subscriptions and utilities —
              securely and on time.
            </p>

            <div className="flex justify-center gap-4 mt-7">
              <Link to="/register" aria-label="Register for PayWise">
                <button className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 text-white px-8 py-3 rounded-3xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  Get Started Today
                </button>
              </Link>
              <Link to="/about" aria-label="Learn more about PayWise">
                <button className="border-2 border-cyan-700 text-cyan-700 px-8 py-3 rounded-3xl font-semibold hover:bg-cyan-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  Learn More
                </button>
              </Link>
            </div>

            {/* trust badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm ">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 " /> Bank-grade security
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" /> PCI-aware payment flows
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Real-time notifications
              </div>
            </div>
          </div>
        </motion.section>

        {/* FEATURES */}
        <LazyLoad height={200} offset={100}>
          <motion.section
            id="features"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative py-20 scroll-mt-28"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 "></div>

            <h2 className="text-3xl md:text-5xl font-bold text-center mb-14">
              Why Choose <span className="text-cyan-700">PayWise</span>?
            </h2>

            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-zinc-100  p-6 text-center shadow-[0_6px_24px_rgba(2,132,199,0.10)] border border-gray-100 hover:border-cyan-200 transition-all"
                >
                  <div className="mx-auto mb-4 grid place-items-center h-20 w-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-400 shadow-sm">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="h-12 w-12"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    Trusted by 5,000+ monthly users
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </LazyLoad>

        {/* REWARDS */}
        <LazyLoad height={200} offset={100}>
          <motion.section
            id="rewards"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 flex w-full max-w-6xl flex-col md:flex-row items-center gap-8 px-6 md:px-12"
          >
            <div className="flex-1">
              <motion.img
                src={hero2}
                alt="Illustration of earning rewards with PayWise"
                className="w-full max-w-lg mx-auto rounded-xl shadow-lg"
                loading="lazy"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120 }}
              />
            </div>

            <div className="flex-1 p-1 text-center md:text-left">
              <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                Earn <span className="text-cyan-700">Rewards</span> for Every
                Automated Payment
              </h3>
              <p className="mt-4  leading-relaxed">
                Every time you use our platform for automated payments, you’ll
                earn reward-based tokens. Redeem them for discounts and
                exclusive perks — making discipline pay off.
              </p>

              {/* quick stat strip */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-cyan-100  p-4 backdrop-blur">
                <Stat label="Users" value={`${users.toLocaleString()}+`} />
                <Stat label="On-time rate" value={`${onTime}%`} />
                <Stat label="Vendors" value={`${vendors.toLocaleString()}+`} />
              </div>

              <Link to="/about" aria-label="Learn more about PayWise rewards">
                <button className="mt-6 bg-cyan-700 text-white px-8 py-3 rounded-3xl font-semibold shadow-lg hover:bg-cyan-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.section>
        </LazyLoad>

        {/* TESTIMONIALS */}
        <LazyLoad height={200} offset={100}>
          <motion.section
            id="testimonials"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="py-20 px-6 md:px-12"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3 mb-8">
                <img src={quote} alt="" className="w-10 h-10" loading="lazy" />
                <h2 className="text-3xl font-bold">What Our Users Say</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                  <motion.figure
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-cyan-100/70 bg-white/70 p-6 shadow-[0_10px_30px_rgba(2,132,199,0.08)] backdrop-blur"
                  >
                    <p className="italic text-gray-800 leading-relaxed">
                      “{t.text}”
                    </p>
                    <figcaption className="mt-4 flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 text-cyan-900 font-semibold">
                        {t.author.split(" ")[0][0]}
                      </div>
                      <span className="font-semibold text-cyan-700">
                        — {t.author}
                      </span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </motion.section>
        </LazyLoad>

        {/* SOCIAL PROOF / INTEGRATIONS */}
        <LazyLoad height={160} offset={100}>
          <motion.section
            id="proof"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="py-12"
          >
            <div className="mx-auto max-w-6xl px-6 md:px-12 text-center">
              <h3 className="text-2xl font-bold ">Trusted by Thousands</h3>
              <p className="mt-2 ">
                Over 10,000 users manage their bills with PayWise — securely and
                effortlessly.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <ul className="flex flex-wrap items-center justify-center gap-3">
                  {integrations.map((name, idx) => (
                    <li
                      key={idx}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm font-semibold"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        </LazyLoad>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

/* ---------- Tiny UI helpers (icons / stats / badges) ---------- */
const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white/80 p-3 text-center shadow-sm">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
  </div>
);

export default LandingPage;