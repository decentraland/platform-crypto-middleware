import { IHttpServerComponent } from '@well-known-components/interfaces'
import {
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
  DecentralandSignatureContext,
  DecentralandSignatureData,
  DecentralandSignatureRequiredContext,
  DEFAULT_ERROR_FORMAT,
  Options
} from './types'
import verify from './verify'

export {
  Options,
  DecentralandSignatureData,
  DecentralandSignatureContext,
  DecentralandSignatureRequiredContext,
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_TIMESTAMP_HEADER,
  AUTH_METADATA_HEADER,
  verify
}

/** Well-Known Components */
export function wellKnownComponents<P>(
  options: Options
): IHttpServerComponent.IRequestHandler<
  IHttpServerComponent.PathAwareContext<
    DecentralandSignatureContext<P> | DecentralandSignatureRequiredContext<P>,
    string
  >
> {
  return async (ctx, next) => {
    try {
      ctx.verification = await verify(ctx.request.method, ctx.url.pathname, ctx.request.headers.raw(), options)
    } catch (err: any) {
      if (!options.optional) {
        const onError = options.onError ?? DEFAULT_ERROR_FORMAT
        const status = err.statusCode || err.status || 500
        return { status, body: onError(err) }
      }
    }

    return next()
  }
}
