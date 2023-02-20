import React from "react";
import { motion } from "framer-motion";
interface Props {
  children: React.ReactNode;
}

export function PageTransition({ children }: Props): JSX.Element {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
export default PageTransition;
