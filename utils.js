const HOME = require('os').homedir();

const Questions = [{
    type: 'fuzzypath',
    name: 'file',
    itemType: 'file',
    rootPath: HOME,
    message: 'Select an input file:',
    depthLimit: 2
},
{
    type: 'input',
    name: 'outputDir',
    message: 'Output directory name:'
},
{
    type: "list",
    name: "stems",
    message: "How many stems of music to process?",
    choices: [
        {
            name: "2 (Vocals/Accompaniment)",
            value: 2,
            short: "2"
        },
        {
            name: "4 (Vocals/Drums/Bass/Other)",
            value: 4,
            short: "4"
        },
        {
            name: "5 (Vocals/Drums/Bass/Piano/Other)",
            value: 5,
            short: "5"
        },
    ]
}
]

const ShowTitle = () => {
    const title = ["",
        "           /$$                             /$$                        ",
        "          | $$                            | $$                        ",
        "  /$$$$$$$| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$ ",
        " /$$_____/| $$__  $$ /$$__  $$ /$$__  $$|_  $$_/   /$$__  $$ /$$__  $$",
        "|  $$$$$$ | $$  \\ $$| $$$$$$$$| $$$$$$$$  | $$    | $$$$$$$$| $$  \\__/",
        " \\____  $$| $$  | $$| $$_____/| $$_____/  | $$ /$$| $$_____/| $$      ",
        " /$$$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$| $$      ",
        "|_______/ |__/  |__/ \\_______/ \\_______/   \\___/   \\_______/|__/      ",
        "",
        "",
        "Convert audio files into human-readable sheet music.",
        "Author: Daniel R. Greco, 2020",
        ""
    ].join('\n');
    console.log(title);
}

const SysInfo = {
    home: HOME
}

export {
    SysInfo,
    Questions,
    ShowTitle
}