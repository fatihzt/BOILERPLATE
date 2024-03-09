import rawlist from '@inquirer/rawlist'; // Importing a module for raw list input
import logSymbols from 'log-symbols'; // Importing symbols for logging
import prompt from "multiselect-prompt"; // Importing a module for multi-select prompts
import { dirname } from 'path'; // Importing dirname function from path module
import readline from 'readline'; // Importing readline module for reading input
import { fileURLToPath } from 'url'; // Importing fileURLToPath function from url module
import { ControllerCreater } from "./controllerCreation.js"; // Importing ControllerCreater from controllerCreation.js
import { ModelCreater } from './modelCreation.js'; // Importing ModelCreater from modelCreation.js
import { RepositoryCreater } from './repositoryCreation.js'; // Importing RepositoryCreater from repositoryCreation.js
import { ServiceCreater } from "./serviceCreation.js"; // Importing ServiceCreater from serviceCreation.js

// Getting the current filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Functions array for different CRUD operations
const functions = [
    { title: 'Find', value: 'Find' },
    { title: 'GetAll', value: 'GetAll' },
    { title: 'Add', value: 'Add' },
    { title: 'Get', value: 'Get' },
    { title: 'Update', value: 'Update' },
    { title: 'Delete', value: 'Delete' }
];

// Function to extract selected methods from items
const selectedMethods = (items) => items
    .filter((item) => item.selected)
    .map((item) => item.value);

// Options for the prompt
const opts = {
    cursor: 1,
    maxChoices: 7,
    hint: '– Space to select. Return to submit.'
};

// Creating readline interface
const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask questions and get user input
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

// Callback function for asking questions
askQuestions((answers) => {
    const [modelName, tableName] = answers;
    
    // Options for the prompt
    const opts = {
        cursor: 1,
        maxChoices: 7,
        hint: '– Space to select. Return to submit.'
    };

    // Prompting for selecting a microservice
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
        
        // Prompting for selecting functions to use
        prompt('Which functions do you use?', functions, opts)
            .on('data', (data) => {
                const selectedFuncs = selectedMethods(data.value);
                // Creating Model
                ModelCreater(modelName, tableName, mikroserviceName);
                // Creating Repository
                RepositoryCreater(tableName, selectedFuncs, modelName, mikroserviceName);
                // Creating Service
                ServiceCreater(modelName, mikroserviceName, selectedFuncs);
                // Creating Controller
                ControllerCreater(modelName, mikroserviceName, selectedFuncs);
                // Closing readline interface
                readLine.close();
            });
        // Logging success message
        console.log(logSymbols.success, 'Finished successfully!');
    });
});
