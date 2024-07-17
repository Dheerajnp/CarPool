import React from "react";

interface ScrollToButtonProps {
  refElement: React.RefObject<HTMLButtonElement>;
  id: string;
  label: string;
}

const ScrollToButton = ({ refElement, id, label }: ScrollToButtonProps) => {
  const scrollToElement = () => {
    if (refElement.current) {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <button
      ref={refElement}
      onClick={scrollToElement}
      className="bg-blue-400 text-white py-3 px-6 rounded-md hover:bg-blue-300 transition-colors duration-300 shadow-md"
    >
      {label}
    </button>
  );
};

export default ScrollToButton;