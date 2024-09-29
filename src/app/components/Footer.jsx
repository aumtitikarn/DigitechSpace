import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t, i18n } = useTranslation('translation');
  return (
    <footer className="bg-[#0B1E48] shadow-md p-5 text-white">
      <div className="flex flex-col lg:flex-row lg:px-[250px]">
        <div className="">
          <p className="font-semibold text-[20px]">{t("footer.contact")}</p>
          <ul className="list-none mt-3 space-y-2">
            <li className="flex items-center">
              <FaFacebook className="mr-2" />{" "}
              <span className="text-[16px]"> : DigitechSpace</span>
            </li>
            <li className="flex items-center">
              <FaLine className="mr-2" />{" "}
              <span className="text-[16px]"> : @DigitechSpace</span>
            </li>
            <li className="flex items-center">
              <MdEmail className="mr-2" />{" "}
              <a
                href="mailto:DigitechSpace@gmail.com"
                className="text-[16px] text-white"
              >
                : DigitechSpace@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-2 pt-2 text-center lg:mt-5 lg:pt-5   ">
        <p>© 2024 DigitechSpace</p>
      </div>
    </footer>
  );
}

export default Footer;
