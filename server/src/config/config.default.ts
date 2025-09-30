import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1759241581177_1055',
  koa: {
    port: 7001,
  },typeorm: {
    dataSource: {
      default: {
        /**
         * 单数据库实例
         */
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: '*******',
        password: '*******',
        database: 'ehdumper',
        synchronize: false,		    // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: false,
        // 支持如下的扫描形式，为了兼容我们可以同时进行.js和.ts匹配
        entities: [
          'entity',                 // 特定目录
        ]
      }
    }
  },
} as MidwayConfig;
