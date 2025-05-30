import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/userSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import {
    persistReducer,
    PAUSE,
    PERSIST,
    PURGE,
    FLUSH,
    REGISTER,
    persistStore,
    REHYDRATE,
} from "redux-persist";
import { apis } from "./api";

// persist user config
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user", "isLoggedIn", "isEmailVerified"],
};

// wrap requcers with persist config
const persistUsersReducer = persistReducer(userPersistConfig, usersReducer);

// store config
export const store = configureStore({
    reducer: {
        [apis.reducerPath]: apis.reducer,
        user: persistUsersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, PAUSE, PURGE, REGISTER, REHYDRATE, PERSIST],
            },
        }).concat(apis.middleware),
});

// setup listener for RTK query
setupListeners(store.dispatch);

// create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
