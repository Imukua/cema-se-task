import express from 'express';
import authRoute from './auth.route';
import programsRoute from './program.route';
import clientsRoute from './client.route';
import enrollmentsRoute from './enrollment.route';
import usersRoute from './user.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/programs',
    route: programsRoute
  },
  {
    path: '/clients',
    route: clientsRoute
  },
  {
    path: '/enrollments',
    route: enrollmentsRoute
  },
  {
    path: '/users',
    route: usersRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
