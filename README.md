# ktop

### Quick Start

use [ktop-cli](https://github.com/ktopjs/ktop-cli) for command line

```bash
npm i ktop-cli -g
ktop new hello -d sqlite3
cd hello && npm run dev
```
more info see [ktop-cli](https://github.com/ktopjs/ktop-cli)

### controllers base [koa-router](https://github.com/ZijianHe/koa-router)
ktop will auto load controllers in `/app/controllers`  with namespace (without `files` or `folders` name start with `.` & `ApplicationController.` & `BaseController.`)

### modes base [bookshelf](https://github.com/bookshelf/bookshelf)
ktop will auto load models in `/app/models` (without `files` or `folders` name start with `.` & `ApplicationRecord.`)

### autoMiddlewares - middlewares of application(koa)
ktop will auto load middlewares in `/config/autoMiddlewares` (without `files` or `folders` name start with `.`)

### jobs base [node-schedule](https://github.com/node-schedule/node-schedule)
ktop will auto load jobs in `/app/jobs` (without `files` or `folders` name start with `.`)

others
* mongo - https://github.com/agenda/agenda
* redis - https://github.com/OptimalBits/bull
  
  
