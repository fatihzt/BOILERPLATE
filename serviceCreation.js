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

export function ServiceCreater(modelName,mikroserviceName,methods){
  createModelFile(modelName,mikroserviceName,methods)
  createModelFileV2(modelName,mikroserviceName,methods)
  createModelFileV3(modelName,mikroserviceName)
}

function createModelFile(modelName, mikroserviceName, methods) {
  const modelContent = `using PROJECTNAME.${mikroserviceName}.Business.Dto;
  using PROJECTNAME.${mikroserviceName}.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


  namespace PROJECTNAME.${mikroserviceName}.Business.Contracts
  {
      public interface I${modelName}sService
      {
          ${methods.includes("Find") ? `Task<ReportConfigDto> Find(int id);` : ""}
          ${methods.includes("GetAll") ? `Task<IEnumerable<ReportConfigDto>> GetAll();` : ""}
          ${methods.includes("Add") ? `Task<int> Save(${modelName}Dto dto);` : ""}
          ${methods.includes("Delete") ? `Task<bool> Delete(int id);` : ""}
      }
  }`;
const dirname = __dirname.substring(0,__dirname.length-2)

const fileName = `${dirname}\\src\\Microservices\\${mikroserviceName}\\PROJECTNAME.${mikroserviceName}.Business\\Contracts\\I${modelName}sService.cs`;
fs.writeFileSync(fileName, modelContent);
console.log(`Service Creation Done: ${fileName}`);
}

function createModelFileV2(modelName,mikroserviceName,methods){
  const modelContentV2 = `using PROJECTNAME.Core.Microservice;
  using PROJECTNAME.Core.Microservice.Abstractions;
  using PROJECTNAME.Core.Microservice.Exceptions;
  using PROJECTNAME.Data.Abstractions;
  using PROJECTNAME.Data.Mapping;
  using PROJECTNAME.${mikroserviceName}.Business.Contracts;
  using PROJECTNAME.${mikroserviceName}.Business.Dto;
  using PROJECTNAME.${mikroserviceName}.Data.Abstractions;
  using PROJECTNAME.${mikroserviceName}.Data.Models;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;
  
  namespace PROJECTNAME.${mikroserviceName}.Business.Services
  {
      public class ${modelName}sService : BaseService, I${modelName}sRepository
      {
          private readonly I${modelName}sRepository repo;

          public ${modelName}sService(IMapper mapper, IStorage storage, IUser user) : base(mapper, storage, user)
          {
             repo = storage.GetRepository<I${modelName}sRepository>();
          }
          ${methods.includes("Add") ? `public async Task<int> Save(${modelName}Dto dto)
          {
              // Add
              if (dto.Id == null)
              {
                  
              }
              // Update
              else
              {
                  
              }
          }` : ""}
  
          ${methods.includes("Delete") ? `public async Task<bool> Delete(int id)
          {
              var response = await repo.Find(id);
              if (response.Status == 0) throw new AppException(response.Message);
          
              var entity = response.Item;
              if (entity == null) return false;
          
              entity.ModifiedAt = DateTime.Now;
              entity.ModifiedBy = userName;
          
              var result = await repo.Delete(entity);
              if (result.Status == 0) throw new AppException(result.Message);
              return true;
          }` : ""}
  
          ${methods.includes("Find") ? `public async Task<ReportConfigDto> Find(int id)
          {
              var response = await repo.Find(id);
              if (response.Status == 0) throw new AppException(response.Message);
          
              var result = mapper.Map<${modelName}, ${modelName}Dto>(response.Item);
              return result;
          }` : ""}
  
          ${methods.includes("GetAll") ? `public async Task<IEnumerable<ReportConfigDto>> GetAll()
          {
              var response = await repo.GetAll();
              if (response.Status == 0) throw new AppException(response.Message);
          
              var result = mapper.Map<IEnumerable<${modelName}>, IEnumerable<${modelName}Dto>>(response.Items);
              return result;
          }` : ""}
      }
  }`;
  const dirname = __dirname.substring(0,__dirname.length-2)

  const fileNameV2 = `${dirname}\\src\\Microservices\\${mikroserviceName}\\PROJECTNAME.${mikroserviceName}.Business\\Services\\${modelName}sService.cs`;
  fs.writeFileSync(fileNameV2,modelContentV2);
};

function createModelFileV3(modelName,mikroserviceName) {
  const modelContentV3 = `using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;

namespace PROJECTNAME.${mikroserviceName}.Business.Dto
{
    public class ${modelName}Dto
    {

    }
}`;
  const dirname = __dirname.substring(0,__dirname.length-2)
  const fileName = `${dirname}\\src\\Microservices\\${mikroserviceName}\\PROJECTNAME.${mikroserviceName}.Business\\Dto\\${modelName}Dto.cs`;
  fs.writeFileSync(fileName, modelContentV3);
  console.log(`Model Creation Done: ${fileName}`);
}
