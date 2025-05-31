中间件 Middleware: redux-thunk、redux-saga、自定义中间件, 支持异步 action（如请求 API）、日志记录、调试等

异步处理: Thunk、Saga、Observable, 让 Redux 支持异步 dispatch，比如发起请求、定时器等

状态持久化: redux-persist, 把 Redux 状态保存到 localStorage 或 IndexedDB，实现页面刷新不丢状态

组合 reducer: combineReducers, 多模块管理，划分不同功能状态空间

Selector: Reselect、Memoization, 派生数据优化性能，避免不必要的重渲染

Immutable 状态管理: immer（Redux Toolkit 内建）, 让状态不可变操作变得简洁安全

DevTools 集成: Redux DevTools, 可视化查看 state、action 流、时间旅行调试

动态注入 reducer/middleware: injectReducer(), 在懒加载模块时动态添加 reducer，提高初始加载性能

多 store 管理: 子 store、模块隔离, 某些微前端场景中使用多个 Redux store

Redux Toolkit 提供的高级功能: createSlice、createAsyncThunk、createEntityAdapter, 简化开发流程、处理异步请求、统一状态结构等

🔍 常用高级功能详解

1. Middleware 中间件机制（拦截 action 流）
   Redux 的中间件就像是 Redux 的“插件机制”，可以在 dispatch 和 reducer 之间做文章。

📦 redux-thunk: 让你可以 dispatch 函数，而不是对象，用于异步请求

⚙️ redux-saga: 更强大的异步处理工具，基于生成器函数

🛠 自定义中间件：做日志、打点、权限校验等操作

```js
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("dispatching", action);
  return next(action);
};
```

2. 异步处理（Thunk/Saga）

```js
// redux-thunk 示例
export const fetchUser = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_USER_START" });
    const user = await fetch("/api/user").then((res) => res.json());
    dispatch({ type: "FETCH_USER_SUCCESS", payload: user });
  };
};
```

3. 状态持久化（redux-persist）
   让 Redux 的 state 在刷新后仍然保留：

```js
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

4. Selector（选择器）+ Reselect（缓存优化）

```js
import { createSelector } from "reselect";

const selectCart = (state) => state.cart;

export const selectCartTotal = createSelector([selectCart], (cart) =>
  cart.items.reduce((sum, item) => sum + item.price, 0)
);
```

5. Redux Toolkit 的强大封装（推荐现代写法）
   Redux Toolkit 提供了许多高级功能，如：

```js
// 异步请求处理
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await fetch("/api/todos");
  return res.json();
});

// 创建切片
const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});
```

🔚 总结一句话
Redux 的高级功能围绕三个核心目标展开：异步处理能力、状态组织与复用、性能优化与可维护性提升。
