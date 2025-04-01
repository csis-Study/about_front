// import React, { Suspense } from "react";

// const LoginUser = React.lazy(() => import("../pages/Login/LoginUser.jsx"));
// const LoginSystem = React.lazy(() => import("../pages/Login/LoginSystem.jsx"));

// // 不同角色的主页
// const ClientHome = React.lazy(() => import("../pages/Layout/ClientHome.jsx"));
// const AdvisorHome = React.lazy(() => import("../pages/Layout/AdvisorHome"));
// const RiskOfficerHome = React.lazy(() => import("../pages/Layout/RiskOfficerHome"));
// const ComplianceOfficerHome = React.lazy(() => import("../pages/Layout/ComplianceOfficerHome"));
// const AdminHome = React.lazy(() => import("../pages/Layout/AdminHome"));

// const route = [
//     {
//         path: "/client-login",
//         element: <Suspense ><LoginUser></LoginUser></Suspense>,
//     },
//     {
//         path: "/system-login",
//         element: <Suspense ><LoginSystem></LoginSystem></Suspense>,
//     },
//     {
//         path: "/",
//         element: <Suspense ><LoginUser></LoginUser></Suspense>
//     },
//     {
//         path: "/clients",
//         element: <Suspense ><ClientHome></ClientHome></Suspense>
//     },
//     {
//         path: "/advisor",
//         element: <Suspense ><AdvisorHome></AdvisorHome></Suspense>
//     },
//     {
//         path: "/risk-officer",
//         element: <Suspense ><RiskOfficerHome></RiskOfficerHome></Suspense>
//     },
//     {
//         path: "/compliance-officer",
//         element: <Suspense ><ComplianceOfficerHome></ComplianceOfficerHome></Suspense>
//     },
//     {
//         path: "/admin",
//         element: <Suspense ><AdminHome></AdminHome></Suspense>
//     },
// ];

// export default route;