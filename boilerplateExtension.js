import rawlist from '@inquirer/rawlist';
import logSymbols from 'log-symbols';
import prompt from "multiselect-prompt";
import { dirname } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { ControllerCreater } from "./controllerCreation.js";
import { ModelCreater } from './modelCreation.js';
import { RepositoryCreater } from './repositoryCreation.js';
import { ServiceCreater } from "./serviceCreation.js";



    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const functions = [
        { title: 'Find', value: 'Find' },
        { title: 'GetAll', value: 'GetAll' },
        { title: 'Add', value: 'Add' },
        { title: 'Get', value: 'Get' },
        { title: 'Update', value: 'Update' },
        { title: 'Delete', value: 'Delete' }
    ];
    
    const selectedMethods = (items) => items
        .filter((item) => item.selected)
        .map((item) => item.value);

    const opts = {
        cursor: 1,
        maxChoices: 7,
        hint: '– Space to select. Return to submit.'
    };

    const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
      
    function askQuestions(callback) {
        const questions = [
            'Model name: ',
            'Table name: ',
        ];

    let answers = [];

    function askNext(i) {
        readLine.question(questions[i], (answer) => {
            answers.push(answer);
            if (i === questions.length - 1) {
                callback(answers);
            } else {
                askNext(i + 1);
            }
        });
    }

    askNext(0);
    }

    askQuestions((answers) => {
        const [modelName, tableName] = answers;
        
        const opts = {
            cursor: 1,
            maxChoices: 7,
            hint: '– Space to select. Return to submit.'
        };
    
        rawlist({
            message: 'Select a mikroservice name',
            choices: [
                { name: 'M1' },
                { name: 'M2' },
                { name: 'M3' },
                { name: 'M4' },
                { name: 'M5' },
                { name: 'M6' },
                { name: 'M7' },
            ],
        }).then((selectedMicroservice) => {
            const mikroserviceName = selectedMicroservice.value;
            
            prompt('Which functions do you use?', functions, opts)
                .on('data', (data) => {
                    const selectedFuncs = selectedMethods(data.value);
                    ModelCreater(modelName, tableName, mikroserviceName);
                    RepositoryCreater(tableName, selectedFuncs, modelName, mikroserviceName);
                    ServiceCreater(modelName,mikroserviceName,selectedFuncs);
                    ControllerCreater(modelName,mikroserviceName,selectedFuncs);
                    readLine.close();
                });
            console.log(logSymbols.success, 'Finished successfully!');
        });
    });
    

