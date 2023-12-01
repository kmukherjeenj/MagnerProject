// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from "redux-thunk";
// eslint-disable-next-line import/no-extraneous-dependencies
import AsyncStorage from "redux-persist/lib/storage";
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistStore, persistReducer } from "redux-persist";
// eslint-disable-next-line import/no-extraneous-dependencies
import { compose, applyMiddleware, legacy_createStore as createStore } from "redux";

import rootReducer from "./index";

const middleware = [thunk];

const persistConfig = {
	// Root
	key: "magner-web",
	// Storage Method (React Native)
	storage: AsyncStorage,

	// Whitelist (Save Specific Reducers)
	// Blacklist (Don't Save Specific Reducers)
	// blacklist: [
	//     "auth"
	// ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware: Redux Persist Persisted Reducer
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// options like actionSanitizer, stateSanitizer
	  })
	: compose;

const store = createStore(
	persistedReducer,
	composeEnhancers(
		applyMiddleware(...middleware)
		// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

const persistor = persistStore(store);
// Exports
export { store, persistor };
