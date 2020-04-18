import fs from 'fs';
import ora from 'ora';
import inquirer from 'inquirer';
import {SysInfo, Questions, ShowTitle} from './utils';
import Conda from './conda';
import Spleeter from './spleeter';

/* Package Config */
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

/* Constants */
const PACKAGES = ['spleeter', 'aubio'];

/* Spinner Var */
var _;

function checkConda()
{
    _ = ora("Checking for Conda...").start();

    if (Conda.installed()) {
        _.succeed("Conda installed.");
    } else {
        _.fail("Conda not installed!");
        process.exit(1);
    }
}

async function checkEnvironment(c)
{
    _ = ora("Checking for sheeter environment...").start();

    if (await c.hasEnvironment('sheeter')) {
        _.succeed("sheeter environment exists!");
    } else {
        _.warn("No sheeter environment present, creating it.");
        _ = ora("Creating sheeter env...").start();

        if ((await c.create('sheeter')).success) {
            _.succeed("Created sheeter Conda environment.");
        } else {
            _.fail("Something went wrong!");
            process.exit(2);
        }
    }
}

async function checkPackages(c)
{
    _ = ora("Checking for packages...").start();

    for (let pkg of PACKAGES) {
        if (!(await c.hasPackage('sheeter', pkg))) {
            _.warn(`${pkg} not installed, installing.}`);
            let __ = ora(`Installing ${pkg}...`).start();
            let code = await c.installPackage('sheeter', pkg, __);
        }
    }
    
    _.succeed("All pakcages installed!");
}

async function getUserInput()
{
    return await inquirer.prompt(Questions).then(answers => answers).catch(error => console.error(error))
}

async function splitAudio(s, file, stems, outputDir)
{
    _ = ora("Splitting audio with Spleeter...").start();
    let code = await s.split(file, stems, outputDir, _);
}

async function main() {

    ShowTitle();
    console.log("Checking setup...");

    checkConda();

    let conda = new Conda();
    let info = await conda.info();

    await checkEnvironment(conda);
    await checkPackages(conda);

    let config = await getUserInput();

    const outputDirPath = `${SysInfo.home}/sheeter/${config.outputDir}`;
    fs.mkdirSync(outputDirPath, {recursive: true});

    let spleeter = new Spleeter();
    await splitAudio(spleeter, config.file, config.stems, outputDirPath);
    
    console.log(`Audio files outputted to ${outputDirPath}.`);
}

main();
