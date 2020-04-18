import fs from 'fs';
import { SysInfo } from './utils';

const { exec, spawn } = require("child_process");


export default class Conda {

    static installed()
    {
        let hasConda = false;
        fs.readdirSync(SysInfo.home).forEach(
            file => {
                if (file === '.conda') { 
                    hasConda = true;
                } 
            }
        );

        return hasConda;
    }

    constructor(path)
    {
        this.CONDA = path || '/opt/anaconda/bin/conda';
    }

    async _command(command, args, quiet, yes)
    {   
        let C = this.CONDA;
        quiet = quiet || false;
        yes = yes || false;

        return new Promise(function(resolve, reject) {
            exec(
                `${C} ${command} ${args} ${quiet ? '-q' : ''} ${yes ? '-y' : ''} --json`, 
                (error, stdout, stderr) => {
                
                    if (error) { resolve({ 'error': error }); }
                    if (stderr) { resolve({ 'stderr': stderr }); }
            
                    resolve(JSON.parse(stdout));
                }
            );
        });
    }

    async _commandStream(command, args, indicator, succeedMessage)
    {
        let C = this.CONDA;
        let indicate = indicator !== undefined;
        succeedMessage = succeedMessage || "Success!";

        return new Promise(function (resolve, relect) {

            const ccomm = spawn(C, [command, ...(args.split(" "))]);
    
            ccomm.stdout.on("data", data => {
                if (indicate) {
                    let dataStr = `${data}`;
                    let colon = (dataStr.indexOf(":"));
                    if ( colon != -1) {
                        indicator.start(`${dataStr.substring(0, colon)}...`);
                    }
                }
            });
    
            ccomm.stderr.on("data", data => {});
            ccomm.on('error', (error) => { if (indicate) indicator.fail(`${error}`); });
    
            ccomm.on("close", code => {

                if (code == 0) {
                    if (indicate) indicator.succeed(succeedMessage);
                } else {
                    if (indicate) indicator.fail(`Something went wrong. (Conda exited with code ${code})`);
                    process.exit(4);
                }

                resolve(code);
            });

        });        
    }


    async info(args)
    {
        args = args || '';
        return this._command("info", args);
    }

    async create(envname)
    {
        return await this._command("create", `-n ${envname}"`);
    }

    async hasEnvironment(envname)
    {
        let inf = this.inf || await this.info();
        this.inf = inf;

        let environmentNames = inf.envs.map(env => env.substring(env.lastIndexOf("/") + 1));
        
        return ( environmentNames.indexOf(envname) != -1 );
    }

    async packages(envname)
    {
        return await this._command("list", `-n ${envname}`);
    }

    async hasPackage(envname, pkg)
    {
        let pkgs = this.pkgs || await this.packages(envname);
        this.pkgs = pkgs;

        let packageNames = pkgs.map(item => item.name);

        return ( packageNames.indexOf(pkg) != -1 );
    }

    async installPackage(envname, pkg, indicator)
    {
        return await this._commandStream('install', `-n ${envname} -c conda-forge ${pkg} -y`, indicator, `${pkg} installed!`);
    }

}

/*



async function spawn_wrapped_spleeter(indicator, command, args)
{
    return new Promise(function (resolve, relect) {
        const comm = spawn(command, args);

        comm.stdout.on("data", data => {
            let dataStr = `${data}`;
            let prefixInd = dataStr.indexOf("INFO:spleeter:");
            if (prefixInd != -1) {
                indicator.start(dataStr.substring(14));
            }
        });

        comm.stderr.on("data", data => {
        });

        comm.on('error', (error) => {
            console.log(`${error}`);
        });

        comm.on("close", code => {
            resolve(true);
        });        
    })
}

async function conda_spawn(indicator, args) {
    return new Promise(function (resolve, relect) {
        const ccomm = spawn(CONDA, args);

        ccomm.stdout.on("data", data => {
            let dataStr = `${data}`;
            let colon = (dataStr.indexOf(":"));
            if ( colon != -1) {
                indicator.start(`${dataStr.substring(0, colon)}...`);
            }
        });

        ccomm.stderr.on("data", data => {
        });

        ccomm.on('error', (error) => {
            indicator.fail(`${error}`);
        });

        ccomm.on("close", code => {
            if (code == 0) {
                indicator.succeed("Spleeter installed!");
            } else {
                indicator.fail(`Something went wrong. (Conda exited with code ${code})`);
                process.exit(4);
            }
        });        
    })
}

*/