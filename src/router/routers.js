// import templateRouters from './sys/template-routers'
import chinaRouters from './chinahealth/china-health'

import config from '@/config'

import sysRouters from './sys/sys-routers'

import priRouters from './sys/pri-routers'

import ResearchProjectRouters from './research-project'

let routers = []

if (config.sysName === 'ChinaHealth') {
  chinaRouters.forEach(item => {
    routers.push(item)
  })
}

if (config.sysName === 'ResearchPlatform') {
  // templateRouters.forEach(item => {
  //   routers.push(item)
  // })

  ResearchProjectRouters.forEach(item => {
    routers.push(item)
  })
  sysRouters.forEach(item => {
    routers.push(item)
  })
  priRouters.forEach(item => {
    routers.push(item)
  })
}

export default routers
