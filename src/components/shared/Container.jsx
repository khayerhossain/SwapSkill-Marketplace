import React from "react";

const Container = ({ children, className = "" }) => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-10">
      <div className={`w-full max-w-[1400px] mx-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Container;
