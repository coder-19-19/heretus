import React from "react";
import {Navigate} from "react-router-dom";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import Branches from "../pages/Branches";
import Employees from "../pages/Employees";
import Positions from "../pages/Positions";
import Suppliers from "../pages/Suppliers";
import Missions from "../pages/Missions";
import Cashbox from "../pages/Cashbox";
import ExaminationsList from "../pages/ExaminationsList";
import Examinations from "../pages/Examinations";
import ProductTypes from "../pages/ProductTypes";
import Products from "../pages/Products";
import Purchase from "../pages/Purchase";
import Sale from "../pages/Sale";
import WarehouseLeft from "../pages/WarehouseLeft";
import Salary from "../pages/Salary";
import Permissions from "../pages/Permissions";
import Dashboard from "../pages/Dashboard";
import Examinations2 from "../pages/Examinations2";
import Companies from "../pages/Companies";
import Customers from "../pages/Customers";
import Invoice from "../pages/Invoice";
import OutsideWork from "../pages/OutsideWork";


const authProtectedRoutes = [
    // {path: "users", component: <Users/>, title: 'İstifadəçilər'},
    {
        path: "departament",
        component: <Branches/>,
        title: 'Şöbələr',
        menu: 'settings',
        icon: 'code-branch',
        can: 'department_view'
    },
    {
        path: "missions",
        component: <Missions/>,
        title: 'Xidmətlər', menu: 'settings',
        icon: 'list',
        can: 'service_view'
    },
    {
        path: "positions",
        component: <Positions/>,
        title: 'Vəzifələr',
        menu: 'settings',
        icon: 'check-to-slot',
        can: 'position_view'
    },
    {
        path: "employees",
        component: <Employees/>,
        title: 'İşçilər',
        menu: 'settings',
        icon: 'users',
        can: 'worker_view'
    },
    {
        path: "companies",
        component: <Companies/>,
        title: 'Şirkətlər',
        menu: 'settings',
        icon: 'building',
        can: 'company_view'
    },
    {
        path: "customers",
        component: <Customers/>,
        title: 'Müştərilər',
        menu: 'settings',
        icon: 'users',
        can: 'customer_view'
    },
    {
        path: "suppliers",
        component: <Suppliers/>,
        title: 'Təhcizatçılar',
        menu: 'settings',
        icon: 'car',
        can: 'supplier_view'
    },
    {
        path: "permissions",
        component: <Permissions/>,
        title: 'Səlahiyyətlər',
        menu: 'settings',
        icon: 'lock',
        can: 'role_view'
    },
    {
        path: "examinations",
        component: <Examinations/>,
        title: 'Xidmət/məhsul əlavə et',
        menu: 'operations',
        icon: 'user-nurse',
        can: 'examination_add'
    },
    {
        path: "examination-list",
        component: <ExaminationsList/>,
        title: 'Ximdət/Məhsul (Detallı)',
        menu: 'statistics',
        icon: 'user-circle',
        can: 'examination_view'
    },
    // {path: "payments", component: <Payments/>, title: 'Ödənişlər'},
    {
        path: "cashbox",
        component: <Cashbox/>,
        title: 'Kassa',
        menu: 'operations',
        icon: 'coins',
        can: 'examinationPayment_view'
    },
    {
        path: "invoice",
        component: <Invoice/>,
        title: 'Faktura',
        menu: 'operations',
        icon: 'file-invoice',
        can: 'invoice_view'
    },
    {
        path: "outside-work",
        component: <OutsideWork/>,
        title: 'Kənar işçilik',
        menu: 'operations',
        icon: 'users',
        can: 'outside_work_view'
    },
    {
        path: "product-types",
        component: <ProductTypes/>,
        title: 'Məhsul növləri',
        menu: 'warehouse',
        icon: 'filter',
        can: 'productType_view'
    },
    {
        path: "products",
        component: <Products/>,
        title: 'Məhsullar',
        menu: 'warehouse',
        icon: 'pills',
        can: 'product_view'
    },
    {
        path: "purchase",
        component: <Purchase/>,
        title: 'Mədaxil',
        menu: 'warehouse',
        icon: 'store',
        can: 'purchase_view'
    },
    {
        path: "examinations2",
        component: <Examinations2/>,
        title: 'Ximdət/Məhsul',
        menu: 'statistics',
        icon: 'user-circle',
        can: 'examination_view'
    },
    {
        path: "warehouse-left",
        component: <WarehouseLeft/>,
        title: 'Anbarda qalıq',
        menu: 'statistics',
        icon: 'cash-register',
        can: 'warehouse_left'
    },
    {
        path: "salaries",
        component: <Salary/>,
        title: 'Maaşlar',
        menu: 'operations',
        icon: 'money-bill-1',
        can: 'salary_view'
    },
    {
        path: "dashboard",
        component: <Dashboard/>,
        title: 'Ana səhifə',
        hide: true
    },
    {path: '', component: <Navigate to="/dashboard"/>}
];

const publicRoutes = [
    {path: "/logout", component: <Logout/>},
    {path: "/login", component: <Login/>},
    {path: "/forgot-password", component: <ForgetPwd/>},
    {path: "/register", component: <Register/>},
];

export {authProtectedRoutes, publicRoutes};
