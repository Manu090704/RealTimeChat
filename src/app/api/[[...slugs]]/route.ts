import { Elysia, t } from 'elysia'

const App = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = App.fetch 
export const POST = App.fetch 

export type App = typeof App