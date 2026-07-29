import { Elysia, t } from 'elysia'
import { nanoid } from 'nanoid'
import {redis} from "../../../lib/redis"
import { authMiddleware } from './auth'
import {z} from "zod"

const ROOM_TTL_SECONDS = 60 * 10

const rooms = new Elysia({ prefix: '/rooms' }).
post("/create", async ()=>{
    const roomId = nanoid()
    await redis.hset(`meta:${roomId}`, {
        connected: [],
        createdAt: Date.now(),
    })

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

    return {roomId}
})

const messages = new Elysia({prefix:"/messages"})
.use(authMiddleware)
.post("/",async ({body, auth}) =>{
    const {sender, text} = body
    const {roomId} = auth

    const roomExists = await redis.exists(`meta:${roomId}`)

    if(!roomExists){
        throw new Error("Room doesn't exist")
    }
}, {
    query: z.object({roomId: z.string() }),
    body: z.object({
        sender: z.string().max(100),
        text:z.string().max(1000),
    })
})

const App = new Elysia({ prefix: '/api' }).use(rooms)

export const GET = App.fetch 
export const POST = App.fetch 

export type App = typeof App