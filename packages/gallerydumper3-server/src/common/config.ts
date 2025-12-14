export const config = {
  database: {
    type: 'mysql' as const,
    host: '192.168.2.225',
    port: 3306,
    user: 'root',
    password: 'abc7758258',
    database: 'eh_dumper3_dev',
  },
  leveldb: {
    baseDir: './leveldb',
    nodeCount: 10,
  },
  file: {
    baseDir: './data',
  },
};

export const TEST_CONFIG = {
  ...config,
  leveldb: {
    ...config.leveldb,
    baseDir: './tmp/leveldb/test',
  },
  file: {
    ...config.file,
    baseDirs: ['./tmp/data'],
  },
};

export const getConfig = () => {
  // if (process.env.NODE_ENV === 'production') {
  // } else if (process.env.NODE_ENV === 'test') {
  // } else {
  // process.env.NODE_ENV;
  // 根据环境变量或其他条件返回不同的配置
  if (process.env.NODE_ENV === 'test') {
    return TEST_CONFIG;
  }
  return config;
};
