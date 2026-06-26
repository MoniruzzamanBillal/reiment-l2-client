"use client";

import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Clock, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 pt-24 pb-16 px-4">
      <Wrapper>
        {/* Page heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-prime100/10 mb-4">
            <MessageSquare className="size-7 text-prime100" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            We&apos;re here to help. Reach out through any channel or use the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — info cards */}
          <div className="flex flex-col gap-5">
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-start gap-3 hover:shadow-md transition">
                <div className="flex items-center justify-center size-10 rounded-xl bg-rose-50">
                  <Mail className="size-5 text-rose-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Email</h2>
                  <p className="text-xs text-gray-500 mb-2">For inquiries & support</p>
                  <a
                    href="mailto:support@reiment.com"
                    className="text-sm text-prime100 hover:text-prime200 hover:underline font-medium"
                  >
                    support@reiment.com
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-start gap-3 hover:shadow-md transition">
                <div className="flex items-center justify-center size-10 rounded-xl bg-green-50">
                  <Phone className="size-5 text-green-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Phone</h2>
                  <p className="text-xs text-gray-500 mb-2">Speak with our team</p>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-prime100 hover:text-prime200 hover:underline font-medium"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-50 shrink-0">
                <MapPin className="size-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 mb-1">Office Address</h2>
                <address className="not-italic text-sm text-gray-600 leading-relaxed">
                  123 E-commerce Street, Suite 100<br />
                  Cityville, State 12345<br />
                  Country
                </address>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-prime100 hover:underline font-medium"
                >
                  View on Google Maps
                  <MapPin className="size-3" />
                </a>
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-10 rounded-xl bg-indigo-50">
                  <Clock className="size-5 text-prime100" />
                </div>
                <h2 className="font-semibold text-gray-800">Business Hours</h2>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map(({ day, hours }) => (
                  <li key={day} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-700 font-medium">{day}</span>
                    <span className={hours === "Closed" ? "text-red-400 font-medium" : "text-gray-500"}>{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Send a Message</h2>
            <p className="text-sm text-gray-500 mb-6">We typically reply within 24 hours.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Your Name
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-prime100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-prime100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Subject
                </label>
                <Input
                  required
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="rounded-xl border-gray-200 focus:border-prime100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us more…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-prime100/30 focus:border-prime100 resize-none transition"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-prime100 hover:bg-prime200 rounded-xl py-5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Send className="size-4" />
                {sending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
