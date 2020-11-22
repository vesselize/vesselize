export function delay(t = 100): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}

export interface DBConfig {
  host?: string;

  username: string;
  password: string;
}

export async function fetchConfig(): Promise<DBConfig> {
  await delay();
  return {
    username: 'config:username',
    password: 'config:password',
  };
}
