import Dashboard from "@/components/dashboard/manager/layout.vue";
import DashboardHome from "@/components/dashboard/manager/home/home.vue";
import AllEmployees from "@/components/dashboard/manager/employees/all-employees.vue";
import CreateEmployee from "@/components/dashboard/manager/employees/create-employee.vue";
import UpdateEmployee from "@/components/dashboard/manager/employees/update-employee.vue";
import MyAccount from "@/components/dashboard/manager/myAccount/my-account.vue";
import Attendance from "@/components/dashboard/manager/attendance/attendance.vue";

export default [
  {
    path: "/dashboard/manager",
    component: Dashboard,
    children: [
      {
        path: "",
        redirect: "home",
      },
      {
        path: "home",
        name: "dashboard",
        component: DashboardHome,
      },
      {
        path: "employees",
        name: "all-employees",
        component: AllEmployees,
      },
      {
        path: "employees/create",
        name: "create-employee",
        component: CreateEmployee,
      },
      {
        path: "employees/:employee_id/update",
        name: "update-employee",
        component: UpdateEmployee,
        props: true,
      },
      {
        path: "attendance",
        name: "attendance",
        component: Attendance,
      },

      {
        path: "my-account",
        name: "my-account",
        component: MyAccount,
      },
    ],
  },
];
