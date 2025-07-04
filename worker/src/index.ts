import { initRedis } from "./config/redis.config"
import { executeCode } from "./services/executor.service"
import { writeCodeToFile, removeFile } from "./services/file.service"
import LANG_CONFIG from "./config/language.config";


export const redisClient = initRedis()
type LanguageKey = keyof typeof LANG_CONFIG;


async function main() {
    await redisClient.connect()
    while (1) {
        const response = await redisClient.brPop("submission", 0)
        // console.log(response)
        if (response !== null) {
            const { element } = response;

            const { code, language, roomID } = JSON.parse(element);
            // Now you can use code, language, and roomID safely
            const config = LANG_CONFIG[language as LanguageKey];
            const file = await writeCodeToFile(code, config.ext);
            const output = await executeCode(file, config);
            removeFile(file.path);

            await redisClient.publish(`submission_result`, JSON.stringify({
                roomID,
                output
            }));

            // console.log(`processed ${roomID} submission`, output)
        } else {
            console.warn("No submission in queue");
        }
    }
}
main()