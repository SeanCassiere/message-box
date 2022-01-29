import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectAppProfileState } from "../redux/store";

export const usePermission = (requestPermission: string) => {
  const { permissions } = useSelector(selectAppProfileState);
  const isPermissionAvailable = useMemo(
    () => permissions.includes(requestPermission),
    [permissions, requestPermission]
  );
  return isPermissionAvailable;
};
