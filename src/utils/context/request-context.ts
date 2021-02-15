import asyncHooks, { AsyncHook, HookCallbacks } from 'async_hooks';
import { v4 as uuid } from 'uuid';
import { IContext } from '../../components/context/context';
const store = new Map<Number, IContext>();

const hook: HookCallbacks = {
    init: (asyncId, type, triggerAsyncId, resource) => {
        if (store.has(triggerAsyncId)) {
            store.set(asyncId, store.get(triggerAsyncId))
        }
    },
    destroy: (asyncId) => {
        if (store.has(asyncId)) {
            store.delete(asyncId);
        }
    }
}

const asyncHook: AsyncHook = asyncHooks.createHook(hook);
asyncHook.enable();

export const createRequestContext = (data, correlationId = uuid()): IContext => {
    const requestInfo: IContext = { correlationId, data };
    store.set(asyncHooks.executionAsyncId(), requestInfo);
    return requestInfo;
};

export const getRequestContext = (): IContext => {
    return store.get(asyncHooks.executionAsyncId());
};

export default { createRequestContext, getRequestContext };