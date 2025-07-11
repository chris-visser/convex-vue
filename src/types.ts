import type { FunctionReference } from 'convex/server'
import type { MaybeRefOrGetter } from 'vue'

export type IsOptionalKey<T, K extends keyof T> =
  object extends Pick<T, K> ? true : false

export type AreAllPropertiesOptional<T> =
  true extends {
    [K in keyof T]: IsOptionalKey<T, K> extends true ? never : true
  }[keyof T]
    ? false
    : true

export type OptionalRestArgsOrSkip<FuncRef extends FunctionReference<any>> = AreAllPropertiesOptional<FuncRef['_args']> extends true
  ? [args?: MaybeRefOrGetter<FuncRef['_args']>]
  : [args: MaybeRefOrGetter<FuncRef['_args']>]
