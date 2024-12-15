import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="  pt-6 bg-gray-50 ">
      <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <p className="  text-2xl sm:text-2xl md:text-xl lg:text-3xl font-bold font-headingFont text-center pb-3 ">
          Rei
          <span className=" text-prime100 ">ment </span>
        </p>
        <div className="flex flex-col items-center border-t border-gray-600 pt-3 ">
          <div className="flex ">
            {/* facebook icon  */}
            <Link
              to={"https://www.facebook.com/MoniruzzamanBillal3018"}
              target="_blank"
              className="mr-6 text-2xl text-neutral-600 hover:text-blue-700"
            >
              <FaFacebook />
            </Link>

            {/* linkedin icon  */}
            <Link
              to={"https://bd.linkedin.com/"}
              target="_blank"
              className="mr-6 text-2xl text-neutral-600 hover:text-blue-800"
            >
              <FaLinkedin />
            </Link>
            {/* github icon  */}
            <Link
              to={"https://github.com/MoniruzzamanBillal"}
              target="_blank"
              className="mr-6 text-2xl text-neutral-600 hover:text-neutral-800"
            >
              <FaGithub />
            </Link>
          </div>
        </div>

        <div className="py-8 text-center text-sm text-gray-600">
          © 2024 All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
