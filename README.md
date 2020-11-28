# Vesselize

[![CircleCI](https://circleci.com/gh/openfext/vesselize.svg?style=svg)](https://circleci.com/gh/openfext/vesselize)
[![codecov](https://codecov.io/gh/openfext/vesselize/branch/main/graph/badge.svg)](https://codecov.io/gh/openfext/vesselize)
[![License](https://img.shields.io/github/license/openfext/vesselize?style=flat-square)](https://www.npmjs.com/package/@vesselize/vesselize)
[![Version](https://img.shields.io/npm/v/@vesselize/core.svg)](https://github.com/openfext/vesselize)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/openfext/vesselize)

⛵ A JavaScript IoC container that works seamlessly with Vue.js and React.

## Features

- IoC container that can be used separately
- Official Vue.js Composition API Integration
- Official React Hook Integration

## Docs

WIP.

## Examples

WIP.

## Quick Start

### Vue.js

#### Prerequisites

- Vue.js >= 3.0.0

#### Installation

```bash
yarn add @vesselize/vue
# or
npm install @vesselize/vue
```

#### Basic Usage

Create injectable classes.

```js
class UserService {
  async getUser() {}
}

export default UserService;
```

Create `VueVesselize` plugin.

```js
import UserService from './services/UserService';

const vesselize = createVesselize({
  providers: [UserService],
});

export default vesselize;
```

Use plugin in your app.

```js
import { createApp } from 'vue';
import vesselize from './vesselize';
import App from './App.vue';

const app = createApp(App);

app.use(vesselize);

app.mount('#app');
```

Use instance in components.

```vue
<template>
  <div>Name: {{ user.name || '✨' }}</div>
</template>

<script>
import { ref } from 'vue';
import { useInstance } from '@vesselize/vue';

export default {
  setup() {
    const user = ref({});
    const userService = useInstance('UserService');

    userService.getUser((data) => (user.value = data));

    return {
      user,
    };
  },
};
</script>
```

### React

- React >= 16.8.0

#### Installation

```bash
yarn add @vesselize/react
# or
npm install @vesselize/react
```

#### Basic Usage

Create injectable classes.

```js
class UserService {
  async getUser() {}
}

export default UserService;
```

Add `VesselizeProvider` in your app.

```jsx
import React from 'react';
import { VesselizeProvider } from '@vesselize/react';
import UserService from './services/UserService';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <VesselizeProvider providers={[UserService]}>
      <UserProfile />
    </VesselizeProvider>
  );
}

export default App;
```

Use instance in components.

```jsx
import React, { useState, useEffect } from 'react';
import { useInstance } from '@vesselize/react';

function UserProfile() {
  const [user, setUser] = useState({});
  const userService = useInstance('UserService');

  useEffect(() => {
    userService.getUser().then((data) => setUser(data));
  }, []);

  return <div>Name: {user.name || '✨'}</div>;
}
```

## Packages

| Package          | NPM                                            | Github                                 |
| ---------------- | ---------------------------------------------- | -------------------------------------- |
| @vesselize/core  | [![Version][core-version]][core-npm]           | [packages/core][core-github]           |
| @vesselize/vue   | [![Version][vue-version]][vue-npm]             | [packages/vue][vue-github]             |
| @vesselize/react | [![Version][react-version]][react-npm]         | [packages/react][react-github]         |
| vesselize        | [![Version][vesselize-version]][vesselize-npm] | [packages/vesselize][vesselize-github] |

[core-version]: https://img.shields.io/npm/v/@vesselize/core.svg
[core-npm]: https://www.npmjs.com/package/@vesselize/core
[core-github]: https://github.com/openfext/vesselize/tree/develop/packages/core
[vue-version]: https://img.shields.io/npm/v/@vesselize/vue.svg
[vue-npm]: https://www.npmjs.com/package/@vesselize/vue
[vue-github]: https://github.com/openfext/vesselize/tree/develop/packages/core
[react-version]: https://img.shields.io/npm/v/@vesselize/react.svg
[react-npm]: https://www.npmjs.com/package/@vesselize/react
[react-github]: https://github.com/openfext/vesselize/tree/develop/packages/react
[vesselize-version]: https://img.shields.io/npm/v/vesselize.svg
[vesselize-npm]: https://www.npmjs.com/package/vesselize
[vesselize-github]: https://github.com/openfext/vesselize/tree/develop/packages/vesselize

## Contribution

Please read the [contribution guidelines](./CONTRIBUTING).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020 - present, Felix Yang
