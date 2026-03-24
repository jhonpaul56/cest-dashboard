import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  return { toast, showToast };
};
