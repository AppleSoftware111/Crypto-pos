import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4 group">
              <img 
                src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                alt="Omara Payments Logo" 
                className="h-8 w-8 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
              />
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                <span className="text-gradient">Omara</span> Payments
              </h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Empowering businesses with next-generation payment solutions and secure blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Company</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.omarapay.com/about-us" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  About Us <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.omarapay.com/careers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  Careers <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link to="/business-locator" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Business Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.omarapay.com/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  Privacy Policy <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.omarapay.com/terms-of-use" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  Terms of Use <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.omarapay.com/acceptable-use" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  Acceptable Use Policy <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-primary mt-1 shrink-0" />
                <span className="text-gray-400">
                  Unit 1702, 17TH Floor High Street South Corporate Plaza Tower 1 26TH Street Corner 9TH Avenue, Bonifacio Global City, City of Taguig.
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary shrink-0" />
                <a href="mailto:support@omarapay.com" className="text-gray-400 hover:text-primary transition-colors">support@omarapay.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Disclaimer Section */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Omara Payment Services Corp.</strong> is registered with the Securities and Exchange Commission (SEC) with Registration No. <span className="text-gray-400 font-medium">2023110126009-01</span>.
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-amber-500">IMPORTANT DISCLAIMER:</strong>Cryptocurrencies and digital assets are highly volatile and involve significant risk. Prices can fluctuate rapidly, and you may lose part or all of your investment. Omara does not provide financial, investment, legal, or tax advice. Any information presented on this website is for general informational purposes only and should not be considered professional advice.Before engaging in any cryptocurrency-related activity, you should carefully assess your financial situation, conduct your own research (DYOR), and consult with a qualified financial advisor if necessary. By using our services, you acknowledge and accept the risks associated with digital assets and blockchain technology.Please review our Risk Disclosure and Terms & Conditions before proceeding with any crypto-related transactions or services.
              </p>
            </div>

            <p className="text-xs text-gray-600">
              Omara Business Solutions Corporationis is registered with the Securities and Exchange Commission (SEC) with Registration No. <span className="text-gray-400 font-medium">2023070110046-00</span>.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Omara Payment Services Corp. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
             <span>SEC Reg. No. 2023110126009-01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;