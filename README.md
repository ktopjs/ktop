# ktop

### Quick Start

use [vue-cli](https://github.com/ktopjs/ktop-cli) for command line

```bash
npm i @ktopjs/ktop-cli -g
ktop new hello -d sqlite3
cd hello && npm run dev
```
more info see [vue-cli](https://github.com/ktopjs/ktop-cli)

### controllers
ktop will auto load controllers in `/app/controllers`  with namespace (without file name start with `.` `ApplicationController` `BaseController`)

### modes
ktop will auto load models in `/app/models` (without file name start with `.` `ApplicationRecord.`)

### autoMiddlewares
ktop will auto load middlewares in `/config/autoMiddlewares` (without file name start with `.`)
  
