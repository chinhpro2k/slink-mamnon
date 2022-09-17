# Socialkids

This project is initialized with [Socialkids](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Socialkids provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```
### Deploy product

```bash
npm run push-server
```
or

```bash
yarn push-server
```

## File constructor
### Config api
```bash
src/utils/constants.ts
```
### Config router,theme,...
```bash
config/config.ts
```
### Common components
```bash
src/components
```
### Call api
```bash
src/service
```
### Modal global state
```bash
src/modal
You can use global state by useModel('name model file')
```

### Page
Where to write page components!




















































## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
