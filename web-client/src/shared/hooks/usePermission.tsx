import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectUserState } from "../redux/store";

export const usePermission = (requestPermission: string) => {
  const { permissions } = useSelector(selectUserState);
  const isPermissionAvailable = useMemo(
    () => permissions.includes(requestPermission),
    [permissions, requestPermission]
  );
  return isPermissionAvailable;
};
