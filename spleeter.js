import { SysInfo } from './utils';

const { exec, spawn } = require("child_process");

export default class Spleeter {

    constructor(path)
    {
        this.SPLEETER = path || `${SysInfo.home}/.conda/envs/sheeter/bin/spleeter`;
    }

    async _commandStream(command, args, indicator, succeedMessage)
    {
        let S = this.SPLEETER;
        let indicate = indicator !== undefined;
        succeedMessage = succeedMessage || "Success!";

        return new Promise(function (resolve, relect) {

            const ccomm = spawn(S, [command, ...(args.split(" "))]);
    
            ccomm.stdout.on("data", data => {
                if (indicate) {
                    let dataStr = `${data}`;
                    let prefixInd = dataStr.indexOf("INFO:spleeter:");
                    if (prefixInd != -1) {
                        indicator.start(dataStr.substring(14));
                    }
                }
            });
    
            ccomm.stderr.on("data", data => {});
            ccomm.on('error', (error) => { if (indicate) indicator.fail(`${error}`); });
    
            ccomm.on("close", code => {

                if (code == 0) {
                    if (indicate) indicator.succeed(succeedMessage);
                } else {
                    if (indicate) indicator.fail(`Something went wrong. (Spleeter exited with code ${code})`);
                    process.exit(4);
                }

                resolve(code);
            });

        });        
    }

    async split(file, stems, outputDirectory, indicator)
    {
        return await this._commandStream('separate', `-i ${file} -p spleeter:${stems}stems -o ${outputDirectory}`, indicator, "Finished processing audio with Spleeter!");
    }

}