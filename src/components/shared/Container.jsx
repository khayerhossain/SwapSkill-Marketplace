import React from "react";

const Container = ({ children, className = "" }) => {
  return (
    <div className="w-full px-0 md:px-8 lg:px-10">
      <div
        className={`w-full max-w-[1400px] mx-auto px-0 md:px-8 lg:px-12 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
