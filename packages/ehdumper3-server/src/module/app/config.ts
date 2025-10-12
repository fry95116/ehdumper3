export const config = {
  database: {
    type: 'mysql' as const,
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [],
    synchronize: true,
  },
};

export const getConfig = () => {
  // 根据环境变量或其他条件返回不同的配置
  return config;
};
