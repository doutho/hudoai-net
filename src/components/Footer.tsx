import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-white/20">
      <div className="container mx-auto text-center">
        <p className="text-white/80 font-serif">
          © {new Date().getFullYear()} Hudo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;