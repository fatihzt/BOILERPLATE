import fs from 'fs';
import { dirname } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
export function ModelCreater(modelName,tableName,mikroserviceName){
  createModelFile(modelName,tableName,mikroserviceName)
}


function createModelFile(modelName, tableName, mikroserviceName) {
  const modelContent = `using System;
using PROJECTNAME.Data.Entities;
using PROJECTNAME.Data.Entities;
using Dapper.Contrib.Extensions;

namespace PROJECTNAME.${mikroserviceName.replace(/\./g, '/')}.Data.Models
{
    [Table("${tableName}")]
    public class ${modelName} : AuditedEntity, IEntity
    {

    }
}`;
  const dirname = __dirname.substring(0,__dirname.length-2)
  const fileName = `${dirname}\\src\\Microservices\\${mikroserviceName.replace(/\./g, '/')}\\PROJECTNAME.${mikroserviceName}.Repository\\Models\\${modelName}.cs`;
  fs.writeFileSync(fileName, modelContent);
  console.log(`Model Creation Done: ${fileName}`);
}
