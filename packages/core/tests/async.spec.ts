import {
  Vesselize,
  IVesselize,
  VesselizeOptions,
  VesselizeAware,
  Context,
} from '@vesselize/core';
import { DBConfig, fetchConfig } from './util/async-helper';

const LocalConfigEnv: Partial<DBConfig> = {
  host: 'config:host',
};

const createDBConnection = async function () {
  const config = await fetchConfig();

  return new DBConnection(config);
};

class DBConnection implements VesselizeAware {
  private host: string;
  private username: string;
  private password: string;

  constructor(config: DBConfig) {
    this.username = config.username;
    this.password = config.password;
  }

  setVesselize(v: IVesselize) {
    const localConfig = v.get('LocalDBConfig') as DBConfig;

    this.host = localConfig.host;
  }

  public getConfig(): DBConfig {
    const { host, username, password } = this;

    return {
      host,
      username,
      password,
    };
  }
}

class BookService implements VesselizeAware {
  private conn: Promise<DBConnection>;

  setVesselize(v: IVesselize) {
    this.conn = v.getAsync(DBConnection);
  }

  async getDBConnection(): Promise<DBConnection> {
    return this.conn;
  }

  async getDBConfig(): Promise<DBConfig> {
    const db = await this.conn;

    return db.getConfig();
  }
}

const fooContext: Context = {
  id: 1000,
};

const options: VesselizeOptions = {
  providers: [
    BookService,
    {
      token: DBConnection,
      useFactory: createDBConnection,
    },
    {
      token: 'LocalDBConfig',
      useValue: LocalConfigEnv,
    },
  ],
};

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize(options);
});

describe('vesselize async tests', () => {
  test('lookup async instance', () => {
    const bookService = v.get(BookService);

    return bookService.getDBConfig().then((config) => {
      expect(config.host).toBe('config:host');
      expect(config.username).toBe('config:username');
      expect(config.password).toBe('config:password');
    });
  });

  test('lookup async instance in context', async () => {
    const bookService = v.get(BookService);
    const conn = v.getAsync(DBConnection);
    const connInContext = v.getInContextAsync(DBConnection, fooContext);

    return Promise.all([
      bookService.getDBConnection(),
      conn,
      connInContext,
    ]).then(([connInBookService, conn, connInContext]) => {
      expect(connInBookService).toBe(conn);

      expect(conn).toEqual(connInContext);
      expect(conn).not.toBe(connInContext);
    });
  });
});
