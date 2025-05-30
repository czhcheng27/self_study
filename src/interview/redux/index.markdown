### Redux 的经典结构

---

🧩 1. store.js —— Redux 中央状态管理器
✅ 作用：

- 创建 Redux 的 store（状态容器）

- 将 reducer 传入 store 中统一管理

- 在 React 应用中作为 <Provider> 的核心数据源

📝 示例：

```js
// store.js
import { createStore } from "redux";
import rootReducer from "./reducer";

const store = createStore(rootReducer);
export default store;
```

---

🎯 2. action.js —— 定义“要做什么”的动作描述
✅ 作用：
定义操作状态的“动作”（action）对象

动作对象通常包含一个 type 和可选的 payload

提供动作创建函数（action creator），让 dispatch 更统一和规范

📝 示例：

```js
// action.js
import { INCREMENT, DECREMENT } from "./const";

export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
```

---

🧠 3. const.js —— 集中管理 Action 类型常量
✅ 作用：
定义所有 action 的类型常量，避免硬编码字符串

防止写错类型名，方便统一管理和重构

📝 示例：

```js
// const.js
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
```

---

🔁 4. reducer.js —— 根据 action 改变 state 的函数
✅ 作用：
接收当前状态和 action，返回新的状态

是 Redux 中“纯函数”的核心

根据 action 的 type 来决定状态如何更新

📝 示例：

```js
// reducer.js
import { INCREMENT, DECREMENT } from "./const";

const initialState = { count: 0 };

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

🧩 总结类比（帮助记忆）：

<!-- 文件名	         类比角色	        功能简述 -->
<!-- store.js	    中央指挥中心	    保存所有状态，统一调度 -->
<!-- action.js	    动作触发器	        定义“做什么”的操作 -->
<!-- const.js	    指令编号	        用常量标记动作类型，防止拼写错误 -->
<!-- reducer.js	    状态处理逻辑	    接收命令并根据当前状态更新新的状态 -->

---

🔄 Action 和 Reducer 是如何协作的？
流程图如下：

```scss
[用户点击按钮]
      ↓
[dispatch 一个 action 对象]
      ↓
{ type: 'INCREMENT' }
      ↓
→ 传给 reducer(state, action)
      ↓
reducer 读取 action.type，返回新 state
      ↓
页面自动重新渲染
```

---

✅ 问题核心：多个 reducer 怎么协作？
举个例子，如果我们有三个 reducer：

counterReducer 管理 count

nameReducer 管理 name

ageReducer 管理 age

你当然不希望每次 dispatch 都触发所有 reducer！

Redux 的做法是：用 combineReducers() 来 “分区管理”，只触发相关 reducer。

📦 示例讲解：
1️⃣ 三个 reducer 文件：

```js
// counterReducer.js
import { INCREMENT } from './const';
export default function counterReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    default:
      return state;
  }
}

// nameReducer.js
export default function nameReducer(state = 'Anonymous', action) {
  switch (action.type) {
    // 假设没有任何 action 处理
    default:
      return state;
  }
}

// ageReducer.js
export default function ageReducer(state = 18, action) {
  switch (action.type) {
    // 假设没有任何 action 处理
    default:
      return state;
  }
}
```

2️⃣ rootReducer.js 中组合：

```js
import { combineReducers } from "redux";
import counterReducer from "./counterReducer";
import nameReducer from "./nameReducer";
import ageReducer from "./ageReducer";

const rootReducer = combineReducers({
  count: counterReducer,
  name: nameReducer,
  age: ageReducer,
});

export default rootReducer;
```

3️⃣ store.js 创建 Store：

```js
import { createStore } from "redux";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer);
export default store;
```

4️⃣ dispatch 如何找到对应 reducer？

```js
dispatch({ type: "INCREMENT" });
```

Redux 内部会自动做：

```js
rootReducer(currentState, action) {
  return {
    count: counterReducer(currentState.count, action),
    name: nameReducer(currentState.name, action),
    age: ageReducer(currentState.age, action)
  }
}
```

🔍 只有 counterReducer 会匹配 INCREMENT 类型，其他两个 reducer 收到这个 action 后直接返回原状态。

🧠 总结：

<!--你想知道的点	                                解答 -->
<!--有多个 reducer，怎么知道谁来处理？	             通过 combineReducers 按 key 分发给对应 reducer -->
<!--dispatch 的 action 会传给所有 reducer 吗？	    是的，但只有匹配的 reducer 会处理，其他会原样返回状态 -->
<!--state 是怎么组合的？	                        combineReducers 会构造出一个大对象，每个 key 对应一个子 reducer -->

Q: 那也还是会有问题吧，万一 counterReducer 和 nameReducer 里都有 type: 'INCREMENT'这个呢
A: 🧨 是的，会有问题 —— 如果多个 reducer 中都有 case 'INCREMENT'，它们都会收到这个 action，只要 switch-case 匹配，就会响应！所以如果多个 reducer 监听同一个 type，多个 reducer 都会触发

有三种解决方案：

✅ 方法 1：用常量 + 前缀命名

```js
export const COUNTER_INCREMENT = "counter/increment";
export const NAME_APPEND = "name/append";
```

✅ 方法 2：使用 Redux Toolkit 自动避免冲突

```js
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
  },
});
```

Redux Toolkit 会自动生成：

```js
type: "counter/increment";
```

✔ 自动避免冲突
✔ 命名空间清晰
✔ 更适合大型项目

✅ 方法 3：中间层 Action Creator 管理粒度
让每个模块只导出自己模块内能用的 dispatch 方法，不共享底层 type 常量。

```js
// counter/actions.js
export const incrementCounter = () => ({ type: "COUNTER/INCREMENT" });
// name/actions.js
export const appendExclamation = () => ({ type: "NAME/APPEND" });
```
