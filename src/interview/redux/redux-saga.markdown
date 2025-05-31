🌟 它的作用：
通过 生成器函数（function\*），写出结构清晰、易测试、可管理的异步流程。

适用于：

多个异步操作串行执行

需要取消/重试的异步请求

更复杂的副作用处理（延时、并发、监听等）

✅ 示例：

```js
// saga.js
import { call, put, takeEvery } from "redux-saga/effects";

function* fetchUserSaga() {
  try {
    const res = yield call(fetch, "/api/user");
    const data = yield res.json();
    yield put({ type: "FETCH_USER_SUCCESS", payload: data });
  } catch (e) {
    yield put({ type: "FETCH_USER_FAIL", error: e.message });
  }
}

function* watchUser() {
  yield takeEvery("FETCH_USER_START", fetchUserSaga);
}
```

这段代码的意思是：每当 dispatch FETCH_USER_START，就运行 fetchUserSaga，它内部完成异步请求，再 dispatch 成功或失败 action。

✅ 配置方法：

```js
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
```

📊 redux-thunk vs redux-saga 对比表

| 对比点       | redux-thunk                  | redux-saga                       |
| ------------ | ---------------------------- | -------------------------------- |
| 异步方式     | 直接在函数中写 `async/await` | 使用生成器函数 (`function*`)     |
| 学习成本     | 低（初学者友好）             | 高（需要理解 Generator）         |
| 代码可读性   | 简单逻辑可读性好             | 复杂流程、流控制更清晰           |
| 控制能力     | 较弱，手动控制               | 强，支持取消、节流、并发等       |
| 项目大小推荐 | 小型、中型项目               | 中型、大型项目，或副作用复杂项目 |

🧩 项目结构
src/
├── store/
│ ├── index.js // 创建 store，注入 sagaMiddleware
│ ├── reducer.js // 处理状态变化
│ ├── actions.js // action 类型和创建函数
│ └── sagas.js // 所有副作用逻辑集中管理
├── App.js // UI 组件
└── index.js // React 应用入口

✅ 1. 安装依赖
npm install redux redux-saga react-redux

✅ 2. 配置 store

```js
// store/index.js
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
```

✅ 3. reducer.js

```js
// store/reducer.js
const initialState = {
  user: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USER_START":
      return { ...state, loading: true, error: null };
    case "FETCH_USER_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_USER_FAIL":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default reducer;
```

✅ 4. actions.js

```js
// store/actions.js

// 这里只定义 action type 和（可选）action 创建函数
export const FETCH_USER_START = "FETCH_USER_START";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAIL = "FETCH_USER_FAIL";

export const fetchUserStart = () => ({ type: FETCH_USER_START });
```

✅ 5. sagas.js

```js
// store/sagas.js
import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "./actions";

// 模拟异步请求
function fetchUserApi() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Bob",
        email: "bob@example.com",
      });
    }, 1000)
  );
}

// worker saga
function* fetchUser() {
  try {
    const user = yield call(fetchUserApi); // 类似 await
    yield put({ type: FETCH_USER_SUCCESS, payload: user });
  } catch (e) {
    yield put({ type: FETCH_USER_FAIL, error: "获取用户失败" });
  }
}

// watcher saga
function* rootSaga() {
  yield takeEvery(FETCH_USER_START, fetchUser); // 监听启动
}

export default rootSaga;
```

✅ 6. App.js 页面组件

```js
// App.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStart } from "./store/actions";

function App() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>用户信息（redux-saga）</h1>
      <button onClick={() => dispatch(fetchUserStart())} disabled={loading}>
        {loading ? "加载中..." : "获取用户"}
      </button>

      {user && (
        <div style={{ marginTop: "1rem" }}>
          <p>姓名：{user.name}</p>
          <p>Email：{user.email}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>错误：{error}</p>}
    </div>
  );
}

export default App;
```

✅ 7. index.js（React 入口）

```js
// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

🧠 redux-saga 核心概念复习：
| 概念 | 作用 |
| ------------- | -------------------------- |
| `function*` | Generator 函数，用来写 saga |
| `takeEvery` | 每次 action 发出，都会触发对应 saga |
| `call(fn)` | 类似 `await fn()`，用于调用异步函数 |
| `put(action)` | 触发新的 action（类似 `dispatch`） |

✅ 总结
redux-saga 和 redux-thunk 的主要区别是：

    * thunk 把异步写在 action creator 里（代码分散）

    * saga 把异步逻辑集中在 saga.js 中，便于维护、测试、组合
