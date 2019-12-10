/**
 * 资源相关的
 */

import resource from './sys/resource'

import Role from './sys/role'
/**
 * 角色相关
 */

export {resource, Role}

/**
 * 用户相关
 */
export {getUsersByRole, login, logout, getUserInfo, findAllUser, changeUserInfo, relateOtherUser, getRelateUsers, updateIsAleart} from './user.js'

/**
 * 健康中国相关
 */
export {getNode, getChildNode, saveOrEditHistory, getHistoryList} from './chinahealth/index.js'

/**
 * 科研工作平台
 */
export {ResearchProjectApi} from './research-project'

export {CreateResearchProjectApi} from './research-project'
/**
 * 模板相关的接口
 */
export {TemplatePageGroupApi} from './research-project'

export {TemplateResultApi} from './research-project'

// 申请相关
export {AuditApplyApi} from './research-project/index.js'

// 任务分类
export {ResearchKindApi} from './research-project/index.js'

export {TemplatePageApi} from './research-project'
// 数据分析
export {DataAnalysisApi} from './research-project/index.js'

export {TemplateApi} from './research-project/index'
