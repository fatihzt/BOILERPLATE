import fs from 'fs';
import { dirname } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function RepositoryCreater(tableName,methods,modelName,mikroserviceName){
  createModelFile(modelName,mikroserviceName,methods)
  createModelFileV2(tableName,modelName,mikroserviceName,methods)
}

function createModelFile(modelName, mikroserviceName, methods) {
  const modelContent = `using PROJECTNAME.Core.Microservice.Wrapper;
  using PROJECTNAME.Data.Abstractions;
  using PROJECTNAME.${mikroserviceName}.Data.Models;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;

  namespace PROJECTNAME.${mikroserviceName.replace(/\./g, '/')}.Data.Abstractions
  {
      public interface I${modelName}sRepository : IMustHaveSetStorageContext
      {
          ${methods.includes("Find") ? `Task<ResponseWrapper<${modelName}>> Find(int id);` : ""}
          ${methods.includes("GetAll") ? `Task<ResponseWrapper<${modelName}>> GetAll();` : ""}
          ${methods.includes("Add") ? `Task<ResponseWrapper> Add(${modelName} entity);` : ""}
          ${methods.includes("Delete") ? `Task<ResponseWrapper> Delete(${modelName} entity);` : ""}
          ${methods.includes("Update") ? `Task<ResponseWrapper> Update(${modelName} entity);` : ""}
      }
  }`;
const dirname = __dirname.substring(0,__dirname.length-2)

const fileName = `${dirname}\\src\\Microservices\\${mikroserviceName.replace(/\./g, '/')}\\PROJECTNAME.${mikroserviceName}.Repository\\Abstractions\\I${modelName}Repository.cs`;
fs.writeFileSync(fileName, modelContent);
console.log(`Repository Creation Done: ${fileName}`);
}

function createModelFileV2(tableName,modelName,mikroserviceName,methods){
  const modelContentV2 = `using PROJECTNAME.Core.Microservice.Wrapper;
  using PROJECTNAME.Data.Dapper;
  using PROJECTNAME.${mikroserviceName}.Data.Abstractions;
  using PROJECTNAME.${mikroserviceName}.Data.Models;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;
  
  namespace PROJECTNAME.${mikroserviceName}.Data.Repositories
  {
      public class ${modelName}sRepository : ExtendedRepository<int,${modelName}>, I${modelName}sRepository
      {
          private readonly string table = "${tableName}";
          ${methods.includes("Add") ? `public async Task<ResponseWrapper> Add(${modelName} entity)
          {
              var result = await AddAsync(entity);
              return new ResponseWrapper(result);
          }` : ""}
  
          ${methods.includes("Delete") ? `public async Task<ResponseWrapper> Delete(${modelName} entity)
          {
              var result= await DeleteAsync(entity);
              return new ResponseWrapper(result);
          }` : ""}
  
          ${methods.includes("Find") ? `public async Task<ResponseWrapper<${modelName}>> Find(int id)
          {
              var response = await GetAsync(id);
              return new ResponseWrapper<${modelName}>(response);
          }` : ""}
  
          ${methods.includes("GetAll") ? `public async Task<ResponseWrapper<${modelName}>> GetAll()
          {
              var response = await GetAllAsync();
              return new ResponseWrapper<${modelName}>(response);
          }` : ""}
  
          ${methods.includes("Update") ? `public async Task<ResponseWrapper> Update(${modelName} entity)
          {
              var result = await UpdateAsync(entity);
              return new ResponseWrapper(result);
          }` : ""}
      }
  }`;
  const dirname = __dirname.substring(0,__dirname.length-2)

  const fileNameV2 = `${dirname}\\src\\Microservices\\${mikroserviceName.replace(/\./g, '/')}\\PROJECTNAME.${mikroserviceName}.Repository\\Repositories\\${modelName}Repository.cs`;
  fs.writeFileSync(fileNameV2,modelContentV2);
};