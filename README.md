# ktop

### Quick Start

use [ktop-cli](https://github.com/ktopjs/ktop-cli) for command line

```bash
npm i ktop-cli -g
ktop new hello -d sqlite3
cd hello && npm run dev
```
more info see [ktop-cli](https://github.com/ktopjs/ktop-cli)

### controllers
ktop will auto load controllers in `/app/controllers`  with namespace (without `files` name start with `.` `ApplicationController` `BaseController`)

### modes
ktop will auto load models in `/app/models` (without `files` name start with `.` `ApplicationRecord.`)

### autoMiddlewares
ktop will auto load middlewares in `/config/autoMiddlewares` (without `files` or `folders` name start with `.`)
  
