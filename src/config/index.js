/**
 * 环境配置封装
 */
// 获取当前的环境变量 默认设置为prood
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi:
      'https://www.fastmock.site/mock/f8a8ca271ce531d5ea50d573a68d3859/api',
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/f8a8ca271ce531d5ea50d573a68d3859/api',
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/f8a8ca271ce531d5ea50d573a68d3859/api',
  },
}
export default {
  env,
  mock: false,
  // mock: true,
  // namespace: 'manager',
  // 这样直接可以根据不同的开发环境动态把 baseApi和mocApi给解构出来
  ...EnvConfig[env],
}
