// import { readLocalStorageValue } from "@mantine/hooks";
// import { Navigate } from "react-router";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// };

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const activeUser = JSON.parse(readLocalStorageValue({ key: 'activeUser' }));

//   if (!activeUser) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

import { readLocalStorageValue } from "@mantine/hooks";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const storedValue = readLocalStorageValue({ key: "activeUser" });

  let activeUser = null;

  try {
    activeUser = storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error("Failed to parse activeUser from localStorage:", error);
    activeUser = null;
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}