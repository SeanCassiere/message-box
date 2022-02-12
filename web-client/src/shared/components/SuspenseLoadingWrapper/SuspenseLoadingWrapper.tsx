import React, { Suspense } from "react";

import BackdropLoader from "./BackdropLoader";

const SuspenseLoadingWrapper: React.FC = ({ children }) => {
  return <Suspense fallback={<BackdropLoader />}>{children}</Suspense>;
};

export default SuspenseLoadingWrapper;
