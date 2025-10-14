export const config = {
  database: {
    type: 'mysql' as const,
    host: '192.168.2.225',
    port: 3306,
    username: 'root',
    password: 'abc7758258',
    database: 'ehdumper3_dev',
    entities: [],
    synchronize: true,
  },
};

export const getConfig = () => {
  // if (process.env.NODE_ENV === 'production') {
  // } else if (process.env.NODE_ENV === 'test') {
  // } else {
  // process.env.NODE_ENV;
  // 根据环境变量或其他条件返回不同的配置
  return config;
  // }
};
