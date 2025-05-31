🌟 它的作用：
让你 dispatch(function)，而不是普通对象。
从而可以执行异步逻辑，比如：发请求，异步 dispatch 多次。

```js
// action.js
export const fetchUser = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_USER_START" });

    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_USER_FAIL", error });
    }
  };
};
```

✅ 配置方法：

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));
```

📊 redux-thunk vs redux-saga 对比表

| 对比点       | redux-thunk                  | redux-saga                       |
| ------------ | ---------------------------- | -------------------------------- |
| 异步方式     | 直接在函数中写 `async/await` | 使用生成器函数 (`function*`)     |
| 学习成本     | 低（初学者友好）             | 高（需要理解 Generator）         |
| 代码可读性   | 简单逻辑可读性好             | 复杂流程、流控制更清晰           |
| 控制能力     | 较弱，手动控制               | 强，支持取消、节流、并发等       |
| 项目大小推荐 | 小型、中型项目               | 中型、大型项目，或副作用复杂项目 |

---

🧩 项目结构
src/
├── store/
│ ├── index.js // 创建 store，绑定 thunk 中间件
│ ├── actions.js // 定义 action creators（支持异步）
│ └── reducer.js // 定义 reducer 处理状态
├── App.js // 页面展示用户信息
└── index.js // React 入口文件

✅ 1. 创建 store/index.js

```js
// store/index.js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
```

✅ 2. 定义 reducer

```js
// store/reducer.js
const initialState = {
  loading: false,
  user: null,
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

✅ 3. 定义异步 action creator

```js
// store/actions.js
export const fetchUser = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_USER_START" });

    try {
      // 模拟 API 请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 假数据
      const user = {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
      };

      dispatch({ type: "FETCH_USER_SUCCESS", payload: user });
    } catch (err) {
      dispatch({ type: "FETCH_USER_FAIL", error: "请求失败" });
    }
  };
};
```

✅ 4. 页面组件 App.js

```js
// App.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./store/actions";

function App() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>用户信息</h1>
      <button onClick={() => dispatch(fetchUser())} disabled={loading}>
        {loading ? "加载中..." : "获取用户信息"}
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

✅ 5. React 入口文件

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

✅ 效果图（运行后）
点击按钮后：

显示“加载中...”

1 秒后模拟获取到用户信息并显示

如果失败（你可以手动抛错试试），会显示错误信息

✅ 总结 redux-thunk 的核心点：
允许 dispatch 函数（而不是对象）

函数中可以写异步逻辑（如 fetch 请求）

在异步操作前后 dispatch 其他 action 来更新状态
