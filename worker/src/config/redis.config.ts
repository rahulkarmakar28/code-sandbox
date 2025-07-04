import { createClient } from "redis"


export function initRedis() {
  return  createClient()
}
