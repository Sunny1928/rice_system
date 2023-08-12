import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Outwards from '@/components/outwards'
import Customer from '@/components/outwards/Customer'
import Transport from '@/components/outwards/Transport'
import Product from '@/components/outwards/Product'
import Trade from '@/components/outwards/Trade'
import SellUint from '@/components/outwards/SellUint'
import CashMethod from '@/components/outwards/CashMethod'
import Inwards from '@/components/inwards'
import InwardsCustomer from '@/components/inwards/Customer'
import inwardsTrade from '@/components/inwards/TradeView'
import InwardsProduct from '@/components/inwards/Product'
import InwardsRicekind from '@/components/inwards/Ricekind'
import printEnvelope from '@/components/print/PrintEnvelope'
import printInwardsTrade from '@/components/print/PrintInwardsTrade'
import printInwardsOtherTrade from '@/components/print/PrintInwardsOtherTrade'
import printOutwardsSomeTrade from '@/components/print/PrintOutwardsSomeTrade'
import printOutwardsAllTrade from '@/components/print/PrintOutwardsAllTrade'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    component: Home
  },
  {
    path: '/outwards',
    name: 'outwards',
    component: Outwards
  },
  {
    path: '/inwards',
    name: 'inwards',
    component: Inwards
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/outwards/customer',
    name: 'customer',
    component: Customer
  },
  {
    path: '/outwards/transport',
    name: 'transport',
    component: Transport
  },
  {
    path: '/outwards/product',
    name: 'product',
    component: Product
  },
  {
    path: '/outwards/sellUint',
    name: 'sellUint',
    component: SellUint
  },
  {
    path: '/outwards/cashMethod',
    name: 'cashMethod',
    component: CashMethod
  },
  {
    path: '/outwards/trade/:customerName',
    name: 'trade',
    component: Trade
  },

  {
    path: '/inwards/customer',
    name: 'inwardsCustomer',
    component: InwardsCustomer
  },
  {
    path: '/inwards/product',
    name: 'inwardsProduct',
    component: InwardsProduct
  },
  {
    path: '/inwards/ricekind',
    name: 'inwardsRicekind',
    component: InwardsRicekind
  },
  {
    path: '/inwards/trade/:customerName',
    name: 'inwardsTrade',
    component: inwardsTrade
  },
  
  {
    path: '/inwards/printenvelope',
    name: 'printEnvelope',
    component: printEnvelope
  },
  {
    path: '/inwards/printtrade',
    name: 'printInwardsTrade',
    component: printInwardsTrade
  },
  {
    path: '/inwards/printothertrade',
    name: 'printInwardsOtherTrade',
    component: printInwardsOtherTrade
  },
  {
    path: '/outwards/printsometrade',
    name: 'printOutwardsSomeTrade',
    component: printOutwardsSomeTrade
  },
  {
    path: '/outwards/printalltrade',
    name: 'printOutwardsAllTrade',
    component: printOutwardsAllTrade
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
