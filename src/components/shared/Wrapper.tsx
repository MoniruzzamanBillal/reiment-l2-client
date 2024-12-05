import { ReactNode } from "react";

type TWrapperProps = {
  children: ReactNode;
  className?: string;
};

const Wrapper = ({ children, className }: TWrapperProps) => {
  return (
    <div
      className={`WrapperContainer  w-[96%] sm:w-[92%] xl:w-[88%] xlg:w-[84%] m-auto ${
        className || ""
      } `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
