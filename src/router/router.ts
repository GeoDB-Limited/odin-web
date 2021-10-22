import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {
  makeAuthorizedOnlyGuard,
  makeRootRedirector,
  makeUnauthorizedOnlyGuard,
} from './guards'

const rootRedirector = makeRootRedirector(
  { name: 'DataSources' },
  { name: 'SignIn' }
)
const authorizedOnlyGuard = makeAuthorizedOnlyGuard({ name: 'Auth' })
const unauthorizedOnlyGuard = makeUnauthorizedOnlyGuard({ name: 'Redirector' })

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Redirector', redirect: rootRedirector },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: rootRedirector },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
    children: [
      {
        path: 'sign_in',
        name: 'SignIn',
        beforeEnter: unauthorizedOnlyGuard,
        component: () => import('../views/SignIn.vue'),
      },
      {
        path: 'recovery',
        name: 'Recovery',
        beforeEnter: unauthorizedOnlyGuard,
        component: () => import('../views/Recovery.vue'),
      },
    ],
  },
  // TODO: temp. hidden all but validators
  {
    path: '/data-sources',
    name: 'DataSources',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "data-sources" */ '../views/DataSources.vue'),
  },
  {
    path: '/oracle-scripts',
    name: 'OracleScripts',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "oracle-scripts" */ '../views/OracleScripts.vue'
      ),
  },
  {
    path: '/requests',
    name: 'Requests',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "requests" */ '../views/Requests.vue'),
  },
  {
    path: '/requests/:id',
    name: 'Request',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "request" */ '../views/RequestItem.vue'),
  },
  {
    path: '/voting',
    name: 'Voting',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "voting" */ '../views/Voting.vue'),
  },
  {
    path: '/validators',
    name: 'Validators',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "validators" */ '../views/Validators.vue'),
  },
  {
    path: '/validators/:address',
    name: 'Validator',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "validator" */ '../views/ValidatorItem.vue'),
  },
  {
    path: '/oracle-validators',
    name: 'OracleValidators',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "oracle-validators" */ '../views/OracleValidators.vue'
      ),
  },
  {
    path: '/wallet',
    name: 'Wallet',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "wallet" */ '../views/Wallet.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
