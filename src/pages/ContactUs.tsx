import { MapContainer } from "@/components/ui";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-14 px-4 md:px-6 bg-gray-100 ">
      <section className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're here to help! Reach out to us through any of the methods
            below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Mail className="h-10 w-10 text-rose-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Email Us
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              For general inquiries, support, or feedback.
            </p>
            <a
              href="mailto:support@example.com"
              className="text-rose-600 hover:underline dark:text-rose-400"
            >
              support@example.com
            </a>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Phone className="h-10 w-10 text-rose-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Call Us
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              Speak directly with our customer service team.
            </p>
            <a
              href="tel:+1234567890"
              className="text-rose-600 hover:underline dark:text-rose-400"
            >
              +1 (234) 567-890
            </a>
          </div>

          <div className="md:col-span-2 flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <MapPin className="h-10 w-10 text-rose-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Visit Us
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              Our main office is located at:
            </p>
            <address className="not-italic text-gray-700 dark:text-gray-200">
              123 E-commerce Street, Suite 100
              <br />
              Cityville, State 12345
              <br />
              Country
            </address>
          </div>
        </div>

        <div className="w-full  bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Placeholder for an embedded map (e.g., Google Maps iframe) */}
          <MapContainer />
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
